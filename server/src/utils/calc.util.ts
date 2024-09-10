/**
 * Calculates the difference between values in percentage.
 * @example
 * // returns 100
 * calculateChangePercentage(10, 5)
 * @example
 * // returns -50
 * calculateChangePercentage(2, 4)
 */
export function calculateChangePercentage(next: number, prev: number) {
  return ((next - prev) / prev) * 100
}
