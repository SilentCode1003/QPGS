import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'

dayjs.extend(localizedFormat)

export const formatDateTimeToMonthDateYear = (date: Date) => {
  return dayjs(date).format('LL')
}
