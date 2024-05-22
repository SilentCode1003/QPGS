import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

// Formats number to a compact form (e.g. 1000 => 1K)
export const compactNumber = (number: number) => {
  return new Intl.NumberFormat('en-ph', {
    notation: 'compact',
    maximumSignificantDigits: 3,
  }).format(number)
}

export const currencyNumber = (number: number) => {
  return new Intl.NumberFormat('en-ph', {
    style: 'currency',
    currency: 'PHP',
  }).format(number)
}

export const formatDate = (date: Date) => {
  return dayjs(date).format('LLL')
}

export const timeFromNow = (date: Date) => {
  return dayjs(date).fromNow()
}
