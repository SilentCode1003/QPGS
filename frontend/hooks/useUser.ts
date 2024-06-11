import { apiClient } from '@/lib/api-client'
import { User } from '@/types/User'
import { useQuery } from '@tanstack/react-query'

type MeResponse = {
  data: User
}

export function useUser() {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['authenticated-user'],
    queryFn: async () => {
      const res = await apiClient.get<MeResponse>('/auth/me')
      return res.data.data
    },
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60 * 9, // 9 Hours
  })

  return {
    isLoading,
    isError,
    error,
    user: user ?? null,
  }
}
