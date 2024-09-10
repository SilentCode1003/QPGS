import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'

dayjs.extend(localizedFormat)

/**
 * Formats date to MMMM D, YYYY
 * @example
 * // returns "September 9, 2024"
 * formatDateTimeToMonthDateYear(new Date())
 */
export const formatDateTimeToMonthDateYear = (date: Date) => {
  return dayjs(date).format('LL')
}
