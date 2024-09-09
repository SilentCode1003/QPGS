/**
 * Formats number to string with PHP sign
 *
 * @example
 * // returns "PHP 62,772.87"
 * formatNumberToPhCurrency(62772.865)
 *
 * @example
 * // returns "PHP 1.50"
 * formatNumberToPhCurrency(1.5)
 *
 * @example
 * // returns "PHP 1.20"
 * formatNumberToPhCurrency(1.204)
 *
 * @example
 * // returns "PHP 1.21"
 * formatNumberToPhCurrency(1.205)
 */
export const formatNumberToPhCurrency = (number: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    currencyDisplay: 'code',
  }).format(number)
}
