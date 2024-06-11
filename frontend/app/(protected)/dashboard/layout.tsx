export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <h1>Layout</h1>
      {children}
    </div>
  )
}
