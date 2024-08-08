import { CONFIG_CONSTANT } from '@/config/constants.config'
import { prisma } from '@/db/prisma'
import { approveQuotationParamDto } from '@/dtos/v1/quotations/approve-quotation.dto'
import { createQuotationBodyDto } from '@/dtos/v1/quotations/create-quotation.dto'
import { getQuotationByIdParamDto } from '@/dtos/v1/quotations/get-quotation.dto'
import { getAllQuotationsQueryDto } from '@/dtos/v1/quotations/get-quotations.dto'
import { formatNumberToPhCurrency } from '@/utils/currency.util'
import { formatDateTimeToMonthDateYear } from '@/utils/dates.util'
import { generateCurrentMonthYear, generateQuotationReferenceId } from '@/utils/generate.util'
import { PrismaClientKnownRequestError, type Decimal } from '@prisma/client/runtime/library'
import dayjs from 'dayjs'
import { createReport } from 'docx-templates'
import type { RequestHandler } from 'express'
import fs from 'node:fs'

const hardwareTemplate = fs.readFileSync('./templates/hardware-template.docx')
const softwareTemplate = fs.readFileSync('./templates/software-template.docx')

export const getAllQuotations: RequestHandler = async (req, res, next) => {
  const validatedQuery = getAllQuotationsQueryDto.safeParse(req.query)

  if (!validatedQuery.success) {
    return res.status(400).json({ message: validatedQuery.error.errors })
  }

  // Block getting other users' quotations when not admin
  const user = req.session.user!
  const isAdmin = user.role.name === CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME
  const isOwner = validatedQuery.data.created_by_id === user.id

  // Block req if not owner and has a created_by_id query param
  if (!isAdmin && validatedQuery.data.created_by_id && !isOwner) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const whereClause = {
    ...validatedQuery.data,
  }

  if (!isAdmin) {
    whereClause.created_by_id = user.id
  }

  try {
    const quotations = await prisma.quotation.findMany({
      where: whereClause,
      include: {
        category: {
          select: { name: true },
        },
        client: {
          select: { name: true },
        },
        created_by_user: {
          select: { first_name: true, last_name: true },
        },
        approved_by_user: {
          select: { first_name: true, last_name: true },
        },
      },
    })

    res.status(200).json({ data: quotations })
  } catch (error) {
    next(error)
  }
}

export const createQuotation: RequestHandler = async (req, res, next) => {
  const validatedBody = createQuotationBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  // Validate relations
  try {
    await prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id: validatedBody.data.category_id },
      })

      if (!category) {
        throw new Error('Invalid foreign key: cannot find category_id')
      }

      const client = await tx.client.findUnique({ where: { id: validatedBody.data.client_id } })

      if (!client) {
        throw new Error('Invalid foreign key: cannot find client_id')
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    next(error)
  }

  // List possible product errors
  // The string value contains the product_id number of the error
  let categoryMismatchError: boolean | string = false
  let categoryDurationError: boolean | string = false
  let alreadySeenProductIdError: boolean | string = false
  let productIdDoesNotExistError: boolean | string = false
  let entryNameMismatchError: boolean | string = false
  let entryDescriptionMismatchError: boolean | string = false
  let entryPriceMismatchError: boolean | string = false
  let vatExCalculationWrongError: boolean | string = false
  let vatIncCalculationWrongError: boolean | string = false
  let totalAmountCalculationWrongError: boolean | string = false

  // Validate quotation_products
  const quotation_products = validatedBody.data.quotation_products
  const hasSeenProductIds: number[] = []

  let serverComputedGrandTotal: number = 0
  for (let i = 0; i < quotation_products.length; i++) {
    if (hasSeenProductIds.includes(quotation_products[i]!.product_id)) {
      // Duplicated product_id
      alreadySeenProductIdError = `product_id: ${quotation_products[i]!.product_id} is duplicated`
      break
    }

    hasSeenProductIds.push(quotation_products[i]!.product_id)

    // product type with category included in relation
    let product:
      | ({
          category: {
            id: number
            name: string
            is_active: boolean
            created_at: Date
          }
        } & {
          id: number
          name: string
          description: string
          price: Decimal
          category_id: number
          is_active: boolean
          created_at: Date
          updated_at: Date
        })
      | null = null

    try {
      product = await prisma.product.findUnique({
        where: {
          id: quotation_products[i]!.product_id,
        },
        include: {
          category: true,
        },
      })
    } catch (error) {
      next(error)
    }

    if (!product) {
      // product_id does not exist
      productIdDoesNotExistError = `product_id: ${quotation_products[i]!.product_id}`
      break
    }

    if (validatedBody.data.category_id !== product!.category_id) {
      categoryMismatchError = `product_id: ${quotation_products[i]!.product_id}`
      break
    }

    if (
      product.category.name === CONFIG_CONSTANT.DB_CATEGORY_HARDWARE_NAME &&
      quotation_products[i]!.duration !== 1
    ) {
      categoryDurationError = `product_id: ${quotation_products[i]!.product_id}`
      break
    }

    if (quotation_products[i]!.entry_name !== product.name) {
      // entry_name is different from product name
      entryNameMismatchError = `product_id: ${quotation_products[i]!.product_id}`
      break
    }

    if (quotation_products[i]!.entry_description !== product.description) {
      // entry_description is different from product description
      entryDescriptionMismatchError = `product_id: ${quotation_products[i]!.product_id}`
      break
    }

    if (Number(quotation_products[i]!.entry_price) !== product.price.toNumber()) {
      // entry_price is different from product price
      entryPriceMismatchError = `product_id: ${quotation_products[i]!.product_id}`
      break
    }

    const serverComputedVatEx = product.price.toNumber() * (1 + quotation_products[i]!.markup / 100)

    if (serverComputedVatEx !== Number(quotation_products[i]!.vat_ex)) {
      // vat_ex calculation is wrong
      vatExCalculationWrongError = `product_id: ${quotation_products[i]!.product_id} - Expected ${serverComputedVatEx}, received: ${quotation_products[i]!.vat_ex}`
      break
    }

    const serverComputedVatInc = serverComputedVatEx * CONFIG_CONSTANT.VAT_INC_RATE

    if (serverComputedVatInc !== Number(quotation_products[i]!.vat_inc)) {
      // vat_inc calculation is wrong
      vatIncCalculationWrongError = `product_id: ${quotation_products[i]!.product_id} - Expected ${serverComputedVatInc}, received: ${quotation_products[i]!.vat_inc}`
      break
    }

    const serverComputedTotalAmount =
      (quotation_products[i]!.vat_type === 'vat_ex'
        ? Number(quotation_products[i]!.vat_ex)
        : Number(quotation_products[i]!.vat_inc)) *
      quotation_products[i]!.quantity *
      quotation_products[i]!.duration

    if (serverComputedTotalAmount !== Number(quotation_products[i]!.total_amount)) {
      // total_amount calculation is wrong
      totalAmountCalculationWrongError = `product_id: ${quotation_products[i]!.product_id} - Expected ${serverComputedTotalAmount}, received: ${quotation_products[i]!.total_amount}`
      break
    }

    serverComputedGrandTotal = serverComputedTotalAmount + serverComputedGrandTotal
  }

  if (categoryMismatchError !== false) {
    return res.status(400).json({
      message: `Product category does not match quotation category. ${categoryMismatchError}`,
    })
  }

  if (categoryDurationError !== false) {
    return res.status(400).json({
      message: `Product duration error. ${categoryDurationError}`,
    })
  }

  if (alreadySeenProductIdError !== false) {
    return res
      .status(400)
      .json({ message: `There are duplicated product_id. ${alreadySeenProductIdError}` })
  }

  if (productIdDoesNotExistError !== false) {
    return res
      .status(400)
      .json({ message: `product_id does not exist. ${productIdDoesNotExistError}` })
  }

  if (entryNameMismatchError !== false) {
    return res
      .status(400)
      .json({ message: `entry_name does not match product name. ${entryNameMismatchError}` })
  }

  if (entryDescriptionMismatchError !== false) {
    return res.status(400).json({
      message: `entry_description does not match product description. ${entryDescriptionMismatchError}`,
    })
  }

  if (entryPriceMismatchError !== false) {
    return res
      .status(400)
      .json({ message: `entry_price does not match product price. ${entryPriceMismatchError}` })
  }

  if (vatExCalculationWrongError !== false) {
    return res
      .status(400)
      .json({ message: `Wrong calculation: vat_ex. ${vatExCalculationWrongError}` })
  }

  if (vatIncCalculationWrongError !== false) {
    return res
      .status(400)
      .json({ message: `Wrong calculation: vat_inc. ${vatIncCalculationWrongError}` })
  }

  if (totalAmountCalculationWrongError !== false) {
    return res
      .status(400)
      .json({ message: `Wrong calculation: total_amount. ${totalAmountCalculationWrongError}` })
  }

  if (serverComputedGrandTotal !== Number(validatedBody.data.grand_total)) {
    // grand_total calculation is wrong
    return res.status(400).json({
      message: `Wrong calculation: grand_total. Expected: ${serverComputedGrandTotal}, received: ${validatedBody.data.grand_total}`,
    })
  }

  try {
    const quotation = await prisma.$transaction(async (tx) => {
      // Create quotation first because quotation id is needed for quotation_product

      // Remove quotation_products to spread on tx.quotation.create
      const transformedBody = { ...validatedBody.data, quotation_products: undefined }

      const currentDate = dayjs()
      const monthYear = generateCurrentMonthYear(currentDate)

      const count = await tx.quotation.count({
        where: { month_year: monthYear },
      })

      const quotation = await tx.quotation.create({
        data: {
          ...transformedBody,
          // This should work on small scale deployment but not on larger scale
          // When requests are too fast reference id can duplicate
          // One possible way to fix this is by creating a trigger on db
          reference_id: generateQuotationReferenceId(count, currentDate),
          month_year: monthYear,
          created_by_id: req.session.user!.id,
        },
      })

      // Add quotation_id on every element on quotation_product
      const transformedQuotationProduct = validatedBody.data.quotation_products.map((qp) => ({
        ...qp,
        quotation_id: quotation.id,
      }))

      await tx.quotation_product.createMany({
        data: transformedQuotationProduct,
      })

      // Find quotation with relations included
      const createdQuotation = await tx.quotation.findUnique({
        where: { id: quotation.id },
      })

      return createdQuotation
    })

    if (!quotation) {
      return res.status(500).json({ message: 'Cannot create quotation' })
    }

    res.status(200).json({ data: quotation })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Server is busy, please try again' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
      }
    }

    next(error)
  }
}

export const approveQuotation: RequestHandler = async (req, res, next) => {
  const validatedParam = approveQuotationParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const quotation = await prisma.quotation.update({
      where: { id: validatedParam.data.quotationId },
      data: { quotation_status: 'approved', approved_by_id: req.session.user!.id },
    })

    res.status(200).json({ data: quotation })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Quotation to approve not found' })
        }
      }
    }

    next(error)
  }
}

export const getQuotationById: RequestHandler = async (req, res, next) => {
  const validatedParam = getQuotationByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const quotation = await prisma.quotation.findUnique({
      where: {
        id: validatedParam.data.quotationId,
        // is_active: true
      },
      include: {
        category: {
          select: { name: true },
        },
        client: {
          select: { name: true },
        },
        created_by_user: {
          select: { first_name: true, last_name: true },
        },
        approved_by_user: {
          select: { first_name: true, last_name: true },
        },
        quotation_product: true,
      },
    })

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' })
    }

    res.status(200).json({ data: quotation })
  } catch (error) {
    next(error)
  }
}

export const generateQuotation: RequestHandler = async (req, res, next) => {
  const validatedParam = getQuotationByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: validatedParam.data.quotationId },
      include: { category: true, approved_by_user: true, client: true, quotation_product: true },
    })

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' })
    }

    const transformedQuotationProduct = quotation.quotation_product.map((qp) => ({
      ...qp,
      // This is the price displayed on the document
      display_price: formatNumberToPhCurrency(
        qp.vat_type === 'vat_ex' ? qp.vat_ex.toNumber() : qp.vat_inc.toNumber(),
      ),
      total_amount: formatNumberToPhCurrency(qp.total_amount.toNumber()),
    }))

    const templateData = {
      ...quotation,
      date: formatDateTimeToMonthDateYear(quotation.date),
      expiry_date: formatDateTimeToMonthDateYear(quotation.expiry_date),
      grand_total: formatNumberToPhCurrency(quotation.grand_total.toNumber()),
      approved_by: quotation.approved_by_user,
      quotation_product: transformedQuotationProduct,
    }

    const buffer = await createReport({
      template:
        quotation.category.name === CONFIG_CONSTANT.DB_CATEGORY_HARDWARE_NAME
          ? hardwareTemplate
          : softwareTemplate,
      data: templateData,
      additionalJsContext: {
        renderSignature: (dataUrl: string | null) => {
          if (!dataUrl) {
            return
          }

          if (dataUrl.split(',')[1] === undefined) {
            return
          }

          const buffer = Buffer.from(dataUrl.split(',')[1]!, 'base64')
          return { width: 4, height: 2, data: buffer, extension: '.png' }
        },
      },
    })

    const fileName = `report-${quotation.reference_id}.docx`

    fs.writeFileSync(`./reports/${fileName}`, buffer)

    res.download(`./reports/${fileName}`, fileName)
  } catch (error) {
    next(error)
  }
}

export const updateQuotation: RequestHandler = async (req, res, next) => {
  const validatedParam = getQuotationByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  const validatedBody = createQuotationBodyDto.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors })
  }

  // Validate relations
  try {
    await prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id: validatedBody.data.category_id },
      })

      if (!category) {
        throw new Error('Invalid foreign key: cannot find category_id')
      }

      const client = await tx.client.findUnique({ where: { id: validatedBody.data.client_id } })

      if (!client) {
        throw new Error('Invalid foreign key: cannot find client_id')
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }

    next(error)
  }

  // List possible product errors
  // The string value contains the product_id number of the error
  let categoryMismatchError: boolean | string = false
  let categoryDurationError: boolean | string = false
  let alreadySeenProductIdError: boolean | string = false
  let productIdDoesNotExistError: boolean | string = false
  let vatExCalculationWrongError: boolean | string = false
  let vatIncCalculationWrongError: boolean | string = false
  let totalAmountCalculationWrongError: boolean | string = false

  // Validate quotation_products
  const quotation_products = validatedBody.data.quotation_products
  const hasSeenProductIds: number[] = []

  let serverComputedGrandTotal: number = 0
  for (let i = 0; i < quotation_products.length; i++) {
    if (hasSeenProductIds.includes(quotation_products[i]!.product_id)) {
      // Duplicated product_id
      alreadySeenProductIdError = `product_id: ${quotation_products[i]!.product_id} is duplicated`
      break
    }

    hasSeenProductIds.push(quotation_products[i]!.product_id)

    // product type with category included in relation
    let product:
      | ({
          category: {
            id: number
            name: string
            is_active: boolean
            created_at: Date
          }
        } & {
          id: number
          name: string
          description: string
          price: Decimal
          category_id: number
          is_active: boolean
          created_at: Date
          updated_at: Date
        })
      | null = null

    try {
      product = await prisma.product.findUnique({
        where: {
          id: quotation_products[i]!.product_id,
        },
        include: {
          category: true,
        },
      })
    } catch (error) {
      next(error)
    }

    if (!product) {
      // product_id does not exist
      productIdDoesNotExistError = `product_id: ${quotation_products[i]!.product_id}`
      break
    }

    if (validatedBody.data.category_id !== product!.category_id) {
      categoryMismatchError = `product_id: ${quotation_products[i]!.product_id}`
      break
    }

    if (
      product.category.name === CONFIG_CONSTANT.DB_CATEGORY_HARDWARE_NAME &&
      quotation_products[i]!.duration !== 1
    ) {
      categoryDurationError = `product_id: ${quotation_products[i]!.product_id}`
      break
    }

    // No entry mismatch error because this is update handler

    const serverComputedVatEx =
      Number(quotation_products[i]?.entry_price) * (1 + quotation_products[i]!.markup / 100)

    if (serverComputedVatEx !== Number(quotation_products[i]!.vat_ex)) {
      // vat_ex calculation is wrong
      vatExCalculationWrongError = `product_id: ${quotation_products[i]!.product_id} - Expected ${serverComputedVatEx}, received: ${quotation_products[i]!.vat_ex}`
      break
    }

    const serverComputedVatInc = serverComputedVatEx * CONFIG_CONSTANT.VAT_INC_RATE

    if (serverComputedVatInc !== Number(quotation_products[i]!.vat_inc)) {
      // vat_inc calculation is wrong
      vatIncCalculationWrongError = `product_id: ${quotation_products[i]!.product_id} - Expected ${serverComputedVatInc}, received: ${quotation_products[i]!.vat_inc}`
      break
    }

    const serverComputedTotalAmount =
      (quotation_products[i]!.vat_type === 'vat_ex'
        ? Number(quotation_products[i]!.vat_ex)
        : Number(quotation_products[i]!.vat_inc)) *
      quotation_products[i]!.quantity *
      quotation_products[i]!.duration

    if (serverComputedTotalAmount !== Number(quotation_products[i]!.total_amount)) {
      // total_amount calculation is wrong
      totalAmountCalculationWrongError = `product_id: ${quotation_products[i]!.product_id} - Expected ${serverComputedTotalAmount}, received: ${quotation_products[i]!.total_amount}`
      break
    }

    serverComputedGrandTotal = serverComputedTotalAmount + serverComputedGrandTotal
  }

  if (categoryMismatchError !== false) {
    return res.status(400).json({
      message: `Product category does not match quotation category. ${categoryMismatchError}`,
    })
  }

  if (categoryDurationError !== false) {
    return res.status(400).json({
      message: `Product duration error. ${categoryDurationError}`,
    })
  }

  if (alreadySeenProductIdError !== false) {
    return res
      .status(400)
      .json({ message: `There are duplicated product_id. ${alreadySeenProductIdError}` })
  }

  if (productIdDoesNotExistError !== false) {
    return res
      .status(400)
      .json({ message: `product_id does not exist. ${productIdDoesNotExistError}` })
  }

  if (vatExCalculationWrongError !== false) {
    return res
      .status(400)
      .json({ message: `Wrong calculation: vat_ex. ${vatExCalculationWrongError}` })
  }

  if (vatIncCalculationWrongError !== false) {
    return res
      .status(400)
      .json({ message: `Wrong calculation: vat_inc. ${vatIncCalculationWrongError}` })
  }

  if (totalAmountCalculationWrongError !== false) {
    return res
      .status(400)
      .json({ message: `Wrong calculation: total_amount. ${totalAmountCalculationWrongError}` })
  }

  if (serverComputedGrandTotal !== Number(validatedBody.data.grand_total)) {
    // grand_total calculation is wrong
    return res.status(400).json({
      message: `Wrong calculation: grand_total. Expected: ${serverComputedGrandTotal}, received: ${validatedBody.data.grand_total}`,
    })
  }

  try {
    const quotation = await prisma.$transaction(async (tx) => {
      // Create quotation first because quotation id is needed for quotation_product

      // Remove quotation_products to spread on tx.quotation.create
      const transformedBody = { ...validatedBody.data, quotation_products: undefined }

      const quotation = await tx.quotation.update({
        where: { id: validatedParam.data.quotationId },
        data: {
          ...transformedBody,
        },
      })

      // Add quotation_id on every element on quotation_product
      const transformedQuotationProduct = validatedBody.data.quotation_products.map((qp) => ({
        ...qp,
        quotation_id: quotation.id,
      }))

      await tx.quotation_product.deleteMany({
        where: { quotation_id: validatedParam.data.quotationId },
      })

      await tx.quotation_product.createMany({
        data: transformedQuotationProduct,
      })

      const createdQuotation = await tx.quotation.findUnique({
        where: { id: quotation.id },
      })

      return createdQuotation
    })

    if (!quotation) {
      return res.status(500).json({ message: 'Cannot update quotation' })
    }

    res.status(200).json({ data: quotation })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          return res.status(400).json({ message: 'Server is busy, please try again' })
        }
        case 'P2003': {
          return res.status(400).json({ message: 'Foreign key does not exist' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Quotation to update not found' })
        }
      }
    }

    next(error)
  }
}

export const deleteQuotation: RequestHandler = async (req, res, next) => {
  const validatedParam = getQuotationByIdParamDto.safeParse(req.params)

  if (!validatedParam.success) {
    return res.status(400).json({ message: validatedParam.error.errors })
  }

  try {
    const quotation = await prisma.quotation.update({
      where: { id: validatedParam.data.quotationId },
      data: { is_active: false },
    })

    res.status(200).json({ data: quotation })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2003': {
          return res.status(400).json({ message: 'A foreign key is being deleted' })
        }
        case 'P2025': {
          return res.status(404).json({ message: 'Quotation to delete not found' })
        }
      }
    }

    next(error)
  }
}

export const getRecentQuotations: RequestHandler = async (req, res, next) => {
  const user = req.session.user!
  const isAdmin = user.role.name === CONFIG_CONSTANT.DB_ROLE_ADMIN_NAME

  // Only get own quotations when role is user
  const whereClause: { created_by_id?: number } = {}

  if (!isAdmin) {
    whereClause.created_by_id = user.id
  }

  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { created_at: 'desc' },
      where: whereClause,
      include: {
        category: {
          select: { name: true },
        },
        client: {
          select: { name: true },
        },
        created_by_user: {
          select: { first_name: true, last_name: true },
        },
        approved_by_user: {
          select: { first_name: true, last_name: true },
        },
      },
    })

    res.status(200).json({ data: quotations })
  } catch (error) {
    next(error)
  }
}

export const getPendingQuotations: RequestHandler = async (req, res, next) => {
  try {
    const quotations = await prisma.quotation.findMany({
      where: { quotation_status: 'pending' },
      include: {
        category: {
          select: { name: true },
        },
        client: {
          select: { name: true },
        },
        created_by_user: {
          select: { first_name: true, last_name: true },
        },
        approved_by_user: {
          select: { first_name: true, last_name: true },
        },
      },
    })

    res.status(200).json({ data: quotations })
  } catch (error) {
    next(error)
  }
}
