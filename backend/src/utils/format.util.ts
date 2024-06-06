import type { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'

dayjs.extend(localizedFormat)

/**
 * Formats the prisma error target to use as a message for an error response
 * @example
 * // returns "User username"
 * formatPrismaErrorTarget("user_username_key")
 * @param {string} word The err.meta.target string from PrismaClientKnownError
 * @returns {string} Returns the formatted string
 */
export const formatPrismaErrorTarget = (word: string) => {
  const str = word.split('_').slice(0, -1).join(' ')
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @example
 * // returns "August 16, 2018"
 * formatDateTimeToMonthDateYear(new Date())
 * @param date The DateTime to format
 * @returns Returns the formatted date
 */
export const formatDateTimeToMonthDateYear = (date: Date) => {
  return dayjs(date).format('LL')
}

const numberFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' })

export const formatDecimalToPresentation = (decimal: Prisma.Decimal) => {
  const numString = decimal.toFixed(2)
  return numberFormatter.format(+numString)
}
