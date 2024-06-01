import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { createReport } from 'docx-templates'
import type { RequestHandler } from 'express'
import fs from 'node:fs'
import { z } from 'zod'
import { prisma } from '../db/prisma'
import { numberToCurrencyString, prismaDecimalToCurrencyString } from '../utils/format.util'
import { generateQuotationId } from '../utils/gen.util'

dayjs.extend(localizedFormat)

export const getQuotations: RequestHandler = async (req, res, next) => {
  const paramsSchema = z.object({
    status: z.string().optional(),
    created_by: z.coerce.number().optional(),
  })

  const validatedParams = paramsSchema.safeParse(req.query)

  if (!validatedParams.success) {
    return res.status(400).json({ message: validatedParams.error.errors })
  }

  console.log(validatedParams.data)

  try {
    const quotations = await prisma.quotation.findMany({
      where: {
        quotation_status: {
          name: validatedParams.data.status,
        },
        created_by: validatedParams.data.created_by,
      },
      include: {
        quotation_status: {
          select: {
            name: true,
          },
        },
        created_by_user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      omit: {
        quotation_status_id: true,
        created_by: true,
      },
    })

    res.status(200).json({ data: quotations })
  } catch (err) {
    next(err)
  }
}

export const createQuotation: RequestHandler = async (req, res, next) => {
  const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    payment_type: z.string().min(1),
    price: z.number().nonnegative(),
    markup: z.number().nonnegative(),
    vat_ex: z.number().nonnegative(),
    vat_inc: z.number().nonnegative(),
    duration: z.number().gt(0),
    quantity: z.number().gt(0),
    vat_type: z.string(),
    total_amount: z.number(),
  })

  type Product = z.infer<typeof productSchema>

  const bodySchema = z.object({
    type: z.string().min(1),
    subject: z.string().min(3),
    date: z.string(),
    expiry_date: z.string(),
    note: z.string().min(1).optional(),
    terms_and_conditions: z.string().min(3),
    client: z.object({
      id: z.number(),
      name: z.string().min(1),
      tel_no: z.string().optional(),
      contact_no: z.string().min(1),
      email: z.string().email(),
      address: z.string().min(3),
    }),
    products: z.array(productSchema),
    grand_total: z.number(),
  })

  const validatedBody = bodySchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  // TODO: Check if data (price, vat_ex, vat_inc, grand_total, etc.) are correct
  try {
    const { id, monthYear } = await generateQuotationId()

    const quotation = await prisma.quotation.create({
      data: {
        ...validatedBody.data,
        id,
        month_year: monthYear,
        // TODO: make this a config or make this the default value in schema
        quotation_status_id: 2, //pending
        created_by: req.session.user!.id,
      },
    })

    const quotationProducts = quotation.products as Product[]
    const products = quotationProducts.map((product) => ({
      ...product,
      price: numberToCurrencyString(product.price),
      vat_ex: numberToCurrencyString(product.vat_ex),
      vat_inc: numberToCurrencyString(product.vat_inc),
      total_amount: numberToCurrencyString(product.total_amount),
    }))

    const templateData = {
      ...quotation,
      date: dayjs(quotation.date).format('LL'),
      expiry_date: dayjs(quotation.expiry_date).format('LL'),
      products,
      grand_total: prismaDecimalToCurrencyString(quotation.grand_total),
    }

    const template = fs.readFileSync('./templates/template.docx')
    const buffer = await createReport({
      template,
      data: templateData,
    })
    fs.writeFileSync(`./reports/report-${id}.docx`, buffer)

    res.status(200).json({ data: quotation })
  } catch (err) {
    next(err)
  }
}

export const getQuotation: RequestHandler = async (req, res, next) => {
  const idSchema = z.object({
    id: z.string(),
  })

  const validatedId = idSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors })
  }

  try {
    const quotation = await prisma.quotation.findUnique({
      where: {
        id: validatedId.data.id,
      },
      include: {
        quotation_status: {
          select: {
            name: true,
          },
        },
        approved_by_user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        created_by_user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      omit: {
        quotation_status_id: true,
        created_by: true,
      },
    })

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' })
    }

    res.status(200).json({ data: quotation })
  } catch (err) {
    next(err)
  }
}
