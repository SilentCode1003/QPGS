import { createReport } from 'docx-templates'
import type { RequestHandler } from 'express'
import fs from 'node:fs'
import { CONSTANT } from '../config/constant.config'
import { prisma } from '../db/prisma'
import { numberUserIdSchema, stringIdParamSchema } from '../schemas/param.schema'
import { createQuotationSchema } from '../schemas/quotation.schema'
import { formatDateTimeToMonthDateYear, formatDecimalToPresentation } from '../utils/format.util'
import { generateQuotationId } from '../utils/generate.util'

const hardwareTemplate = fs.readFileSync('./templates/hardware-template.docx')
const softwareTemplate = fs.readFileSync('./templates/software-template.docx')

export const getQuotations: RequestHandler = async (req, res, next) => {
  try {
    const quotations = await prisma.quotation.findMany()

    res.status(200).json({ data: quotations })
  } catch (err) {
    next(err)
  }
}

export const getCreatedQuotationsByUserId: RequestHandler = async (req, res, next) => {
  const validatedParam = numberUserIdSchema.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.format() })
  }

  try {
    const quotations = await prisma.quotation.findMany({
      where: {
        created_by: validatedParam.data.userId,
      },
    })

    res.status(200).json({ data: quotations })
  } catch (err) {
    next(err)
  }
}

export const getApprovedQuotationsByUserId: RequestHandler = async (req, res, next) => {
  const validatedParam = numberUserIdSchema.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.format() })
  }

  try {
    const quotations = await prisma.quotation.findMany({
      where: {
        approved_by: validatedParam.data.userId,
      },
    })

    res.status(200).json({ data: quotations })
  } catch (err) {
    next(err)
  }
}

export const createQuotation: RequestHandler = async (req, res, next) => {
  const validatedBody = createQuotationSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.format() })
  }

  const { products, ...validatedDataWithoutProducts } = validatedBody.data

  // ------------------------------Validate quotation type

  // Store quotation category id for comparison with the request body products array category_id
  let categoryId: number | undefined = undefined

  try {
    const categories = await prisma.category.findMany({})

    if (!categories.some((category) => category.name === validatedBody.data.type)) {
      return res.status(400).json({ message: 'Unknown category type' })
    }

    categoryId = categories.find((category) => category.name === validatedBody.data.type)!.id
  } catch (err) {
    next(err)
  }

  // -------------------------------Validate product ids, category_id, and compute vat_ex and vat_inc

  const validatedProducts = []
  const hasSeenIds: number[] = []

  // Iterates through each product in product array and checks if the id exists
  let isDuplicatedId = false
  let isNotFound = false
  let isCategoryIncorrect = false
  let isDurationIncorrect = false
  let isComputationWrong = false
  let wrongComputationProductId: number | undefined = undefined

  let computedVatEx: number | undefined = undefined
  let computedVatInc: number | undefined = undefined
  let computedTotalAmount: number | undefined = undefined
  for (let i = 0; i < products.length; i++) {
    if (hasSeenIds.some((id) => id === products[i]!.id)) {
      isDuplicatedId = true
      break
    } else {
      hasSeenIds.push(products[i]!.id)
    }

    const p = await prisma.product.findUnique({
      where: {
        id: products[i]!.id,
      },
    })

    if (!p) {
      isNotFound = true
      break
    }

    if (p.category_id !== categoryId) {
      isCategoryIncorrect = true
      break
    }

    if (p.category_id === 1 && products[i]?.duration !== CONSTANT.DB_HARDWARE_CATEGORY_ID) {
      isDurationIncorrect = true
      break
    }

    computedVatEx = (products[i]!.markup / 100) * p.price.toNumber() + p.price.toNumber()
    computedVatInc = computedVatEx * 1.12
    computedTotalAmount =
      products[i]?.vat_type === 'vat_ex'
        ? computedVatEx * products[i]!.quantity * products[i]!.duration
        : computedVatInc * products[i]!.quantity * products[i]!.duration

    if (
      products[i]?.vat_ex !== computedVatEx ||
      products[i]?.vat_inc !== computedVatInc ||
      products[i]?.total_amount !== computedTotalAmount
    ) {
      isComputationWrong = true
      wrongComputationProductId = products[i]!.id
      break
    }

    validatedProducts[i] = {
      product_id: p.id,
      entry_name: p.name,
      entry_description: p.description,
      entry_price: p.price,
      entry_category_id: p.category_id,
      markup: products[i]!.markup,
      vat_ex: products[i]!.vat_ex,
      vat_inc: products[i]!.vat_inc,
      vat_type: products[i]!.vat_type,
      duration: products[i]!.duration,
      quantity: products[i]!.quantity,
      total_amount: products[i]!.total_amount,
    }
  }

  if (isDuplicatedId) {
    return res.status(400).json({ message: 'Product is not unique' })
  }

  if (isNotFound) {
    return res.status(400).json({ message: 'Product not found' })
  }

  if (isCategoryIncorrect) {
    return res.status(400).json({ message: 'Product category id does not match quotation type' })
  }

  if (isDurationIncorrect) {
    return res.status(400).json({ message: 'Hardware type can only have a duration of 1' })
  }

  if (isComputationWrong) {
    return res.status(400).json({
      message: `Wrong calculation for product id: ${wrongComputationProductId} vat_ex: ${computedVatEx}, vat_inc: ${computedVatInc}, total_amount: ${computedTotalAmount}`,
    })
  }

  const calculatedGrandTotal = validatedProducts.reduce(
    (prev, current) => prev + current.total_amount,
    0,
  )

  if (calculatedGrandTotal !== validatedBody.data.grand_total) {
    return res
      .status(400)
      .json({ message: `Wrong grand_total calculation, expected: ${calculatedGrandTotal}` })
  }

  try {
    const { id, monthYear } = await generateQuotationId()

    const quotation = await prisma.quotation.create({
      data: {
        ...validatedDataWithoutProducts,
        id,
        month_year: monthYear,
        // created_by: req.session.user.id ,
        // TODO: req.session.user.id is undefined because ensureLogin middleware is not used
        created_by: 1,
        quotation_status_id: CONSTANT.DB_PENDING_STATUS_ID,
        quotation_product: {
          createMany: {
            data: validatedProducts,
          },
        },
      },
      include: {
        client: true,
        quotation_product: true,
      },
    })

    const templateData = {
      ...quotation,
      date: formatDateTimeToMonthDateYear(quotation.date),
      expiry_date: formatDateTimeToMonthDateYear(quotation.expiry_date),
      quotation_product: quotation.quotation_product.map((quotationProduct) => {
        return {
          ...quotationProduct,
          vat_ex: formatDecimalToPresentation(quotationProduct.vat_ex),
          vat_inc: formatDecimalToPresentation(quotationProduct.vat_inc),
          display_price: formatDecimalToPresentation(
            quotationProduct.vat_type === 'vat_ex'
              ? quotationProduct.vat_ex
              : quotationProduct.vat_inc,
          ),
          total_amount: formatDecimalToPresentation(quotationProduct.total_amount),
        }
      }),
      grand_total: formatDecimalToPresentation(quotation.grand_total),
    }

    const buffer = await createReport({
      template: quotation.type === 'hardware' ? hardwareTemplate : softwareTemplate,
      data: templateData,
    })
    fs.writeFileSync(`./reports/report-${id}.docx`, buffer)

    res.status(200).json({ data: quotation })
  } catch (err) {
    next(err)
  }
}

export const getQuotation: RequestHandler = async (req, res, next) => {
  const validatedId = stringIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: !validatedId.error.format() })
  }

  try {
    const quotation = await prisma.quotation.findUnique({
      where: {
        id: validatedId.data.id,
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

// TODO: create updateQuotation handler
// export const updateQuotation: RequestHandler = async (req, res, next) => {
//   const validatedId = stringIdParamSchema.safeParse(req.params)

//   if (!validatedId.success) {
//     return res.status(400).json({ message: !validatedId.error.format() })
//   }

//   try {
//     const
//   } catch (err) {
//     next(err)
//   }
// }

export const approveQuotation: RequestHandler = async (req, res, next) => {
  const validatedId = stringIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: !validatedId.error.format() })
  }

  try {
    const quotation = await prisma.quotation.update({
      where: {
        id: validatedId.data.id,
      },
      data: {
        // TODO: use ensureLogin middleware
        // approved_by: req.session.user?.id,
        approved_by: 1,
        quotation_status_id: CONSTANT.DB_APPROVED_STATUS_ID,
      },
    })

    res.status(200).json({ data: quotation })
  } catch (err) {
    next(err)
  }
}

export const deleteQuotation: RequestHandler = async (req, res, next) => {
  const validatedId = stringIdParamSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: !validatedId.error.format() })
  }

  try {
    const quotation = await prisma.quotation.delete({
      where: {
        id: validatedId.data.id,
      },
    })

    fs.renameSync(
      `./reports/report-${quotation.id}.docx`,
      `./reports/report-${quotation.id}-deleted.docx`,
    )

    res.status(200).json({ data: quotation })
  } catch (err) {
    next(err)
  }
}
