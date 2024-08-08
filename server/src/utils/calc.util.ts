export function calculateChangePercentage(next: number, prev: number) {
  return ((next - prev) / prev) * 100
}
