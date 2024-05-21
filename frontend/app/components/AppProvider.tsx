'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthLoader } from '../lib/auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* TODO: Make a loading component */}
      <AuthLoader renderLoading={() => <div>AuthLoader loading...</div>}>{children}</AuthLoader>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
