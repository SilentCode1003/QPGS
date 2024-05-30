import type { Prisma } from '@prisma/client'

const numberFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' })

export const prismaDecimalToCurrencyString = (num: Prisma.Decimal) => {
  const numString = num.toFixed(2)
  return numberFormatter.format(+numString)
}

export const numberToCurrencyString = (num: number) => {
  return numberFormatter.format(num)
}
