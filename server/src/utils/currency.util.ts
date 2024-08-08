export const formatNumberToPhCurrency = (number: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    currencyDisplay: 'code',
  }).format(number)
}
