import dayjs from 'dayjs'
import { prisma } from '../db/prisma'

const generateCurrentMonthYear = (dayjs: dayjs.Dayjs) => {
  return dayjs.format('MMYYYY')
}

export const generateQuotationId = async () => {
  const currentDate = dayjs()
  const monthYear = generateCurrentMonthYear(currentDate)

  const count = await prisma.quotation.count({
    where: {
      month_year: monthYear,
    },
  })

  const idString = (count + 1).toString().padStart(4, '0')
  const monthString = (currentDate.month() + 1).toString().padStart(2, '0')
  const id = `1${monthString}-${currentDate.year()}-${idString}`

  return { id, monthYear }
}
