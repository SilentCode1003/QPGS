import { prisma } from '@/db/prisma'
import { calculateChangePercentage } from '@/utils/calc.util'
import dayjs from 'dayjs'
import type { RequestHandler } from 'express'

type LineChartResponse = { date: string; count: number }[]

export const getQuotationCountPerMonth: RequestHandler = async (req, res, next) => {
  try {
    // The following lines is for count per day, but prisma doesn't support formatting of date
    // const count = await prisma.quotation.aggregate({
    //   _count: {
    //     _all: true,
    //   },
    // })

    const count = await prisma.quotation.groupBy({
      by: ['month_year'],
      _count: { _all: true },
      orderBy: { month_year: 'asc' },
    })

    const transformedCount: LineChartResponse = count.map((r) => ({
      count: r._count._all,
      // convert "08" to "August"
      date: dayjs()
        .month(Number(r.month_year.slice(0, 2)) - 1)
        .format('MMMM'),
    }))

    res.status(200).json({ data: transformedCount })
  } catch (error) {
    next(error)
  }
}

type PieChartResponse = { name: string; value: number }[]
export const getMostQuotedProducts: RequestHandler = async (req, res, next) => {
  try {
    const aggregate = await prisma.quotation_product.groupBy({
      by: ['product_id'],
      _count: { _all: true },
    })

    const products = await prisma.product.findMany({
      select: { id: true, name: true },
    })

    const mostQuotedProducts: PieChartResponse = []

    for (let i = 0; i < aggregate.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if (aggregate[i]!.product_id === products[j]!.id) {
          const element = {
            name: products[j]!.name,
            value: aggregate[i]!._count._all,
          }

          mostQuotedProducts.push(element)
        }
      }
    }

    res.status(200).json({ data: mostQuotedProducts })
  } catch (error) {
    next(error)
  }
}

export const getPendingQuotationsCount: RequestHandler = async (req, res, next) => {
  try {
    const count = await prisma.quotation.count({
      where: { quotation_status: 'pending' },
    })

    res.status(200).json({ data: count })
  } catch (error) {
    next(error)
  }
}

export const getCurrentApprovedQuotationsCount: RequestHandler = async (req, res, next) => {
  const currentMonth = dayjs().month() + 1
  const currentYear = dayjs().year()

  const prevMonthYear = `${(currentMonth - 1).toString().padStart(2, '0')}${currentYear}`
  const currMonthYear = `${currentMonth.toString().padStart(2, '0')}${currentYear}`

  try {
    const prevMonthTotalCount = await prisma.quotation.count({
      where: {
        quotation_status: 'approved',
        month_year: prevMonthYear,
      },
    })

    const currentMonthTotalCount = await prisma.quotation.count({
      where: {
        quotation_status: 'approved',
        month_year: currMonthYear,
      },
    })

    const data = {
      changePercent: calculateChangePercentage(currentMonthTotalCount, prevMonthTotalCount),
      currentMonthTotalCount,
    }

    res.status(200).json({ data })
  } catch (error) {
    next(error)
  }
}

export const getCurrentApprovedTotalAmount: RequestHandler = async (req, res, next) => {
  const currentMonth = dayjs().month() + 1
  const currentYear = dayjs().year()

  const prevMonthYear = `${(currentMonth - 1).toString().padStart(2, '0')}${currentYear}`
  const currMonthYear = `${currentMonth.toString().padStart(2, '0')}${currentYear}`

  try {
    const previousMonthTotalAmount = await prisma.quotation.aggregate({
      _sum: { grand_total: true },
      where: { quotation_status: 'approved', month_year: prevMonthYear },
    })

    const currentMonthTotalAmount = await prisma.quotation.aggregate({
      _sum: { grand_total: true },
      where: { quotation_status: 'approved', month_year: currMonthYear },
    })

    let curTotal = 0
    let prevTotal = 0

    if (previousMonthTotalAmount._sum.grand_total) {
      prevTotal = previousMonthTotalAmount._sum.grand_total.toNumber()
    }

    if (currentMonthTotalAmount._sum.grand_total) {
      curTotal = currentMonthTotalAmount._sum.grand_total.toNumber()
    }

    const data = {
      changePercent: calculateChangePercentage(curTotal, prevTotal),
      currentMonthTotalAmount: curTotal,
    }

    res.status(200).json({ data })
  } catch (error) {
    next(error)
  }
}
