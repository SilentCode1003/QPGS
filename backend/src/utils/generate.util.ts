import dayjs from 'dayjs'
import { prisma } from '../db/prisma'

/**
 * @example
 * // returns "062024"
 * generateCurrentMonthYear(dayjs())
 * @param dayjs The dayjs instance
 * @returns The date string
 */
const generateCurrentMonthYear = (dayjs: dayjs.Dayjs) => {
  return dayjs.format('MMYYYY')
}

/**
 * @example
 * // returns { id: "106-2024-0001", monthYear: "062024" }
 * { id, monthYear } = generateQuotationId()
 * @returns The generated quotation id and monthYear for creating a quotation
 */
export const generateQuotationId = async () => {
  const currentDate = dayjs()
  const monthYear = generateCurrentMonthYear(currentDate)

  const count = await prisma.quotation.count({
    where: {
      month_year: monthYear,
    },
  })

  // idString is the number of quotation in current month and year (ex. "0001")
  // Add multiple 0s on the left of the count to ensure that idString has 4 digits
  const idString = (count + 1).toString().padStart(4, '0')

  // monthString is the current month with a 0 padding if single digit (ex: "06")
  // Add one on current month because dayjs is 0 based index
  // Add a 0 to the left of the number if current month is single digit
  const monthString = (currentDate.month() + 1).toString().padStart(2, '0')

  // The quotation id format 106     -  2024 -         0001
  //                        |  |           ^               ^---- The number of quotations in this month and year (4 digits)
  //                        |  |           |-------------------- The current year
  //                        |  |-------------------------------- The current month (2 digits)
  //                        |----------------------------------- Required to have 1 at the beginning
  const id = `1${monthString}-${currentDate.year()}-${idString}`

  return { id, monthYear }
}
