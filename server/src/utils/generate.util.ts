import dayjs from 'dayjs'

export const generateCurrentMonthYear = (currentDate: dayjs.Dayjs) => {
  return currentDate.format('MMYYYY')
}

export const generateQuotationReferenceId = (count: number, currentDate: dayjs.Dayjs) => {
  /**
   * The required reference id example is:  107-       2024-        0001
   *                                       |  |          |            |---- The number of quotations in this month and year (4 digits)
   *                                      |  |          |-------------------- The current year
   *                                     |  |-------------------------------- The current month (2 digits)
   *                                    |----------------------------------- Required to have 1 at the beginning
   * We will separate the given example by the dash and call it parts 1, 2, and 3
   */

  // Compute for part 3
  const idString = (count + 1).toString().padStart(4, '0')

  // Compute for parts 1 and 2 (excluding 1 at the very beginning)
  const monthString = (currentDate.month() + 1).toString().padStart(2, '0')

  // Generate the whole id
  const id = `1${monthString}-${currentDate.year()}-${idString}`
  return id
}
