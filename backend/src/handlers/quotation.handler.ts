import type { RequestHandler } from 'express'
import { CONSTANT } from '../config/constant.config'
import { prisma } from '../db/prisma'
import { numberUserIdSchema } from '../schemas/param.schema'
import { createQuotationSchema } from '../schemas/quotation.schema'
import { generateQuotationId } from '../utils/generate.util'
import type { product } from '@prisma/client'

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
      message: `Wrong calculations: vat_ex: ${computedVatEx}, vat_inc: ${computedVatInc}, total_amount: ${computedTotalAmount}`,
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
    })

    res.status(200).json({ data: quotation })
  } catch (err) {
    next(err)
  }
}
