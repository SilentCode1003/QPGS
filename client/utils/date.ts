import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
import relativeTIme from 'dayjs/plugin/relativeTime'

dayjs.extend(localizedFormat)
dayjs.extend(relativeTIme)

export const formatDateTimeToMonthDateYear = (date: Date | string) => {
  return dayjs(date).format('LL')
}

export const formatDateTimeToMonthDateYearTime = (date: Date | string) => {
  return dayjs(date).format('LLL')
}

export const formatDateToFromNow = (date: Date | string) => {
  return dayjs(date).fromNow()
}
