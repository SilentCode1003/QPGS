import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

export type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  username: string
  role_id: number
  role: {
    id: number
    name: string
    created_at: string
  }
  job_title: string
  is_active: boolean
  created_at: string
  updated_at: string
}

type MeResponse = {
  data: User
}

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await apiClient.get<MeResponse>('/auth/me')
      return res.data
    },
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // staleTime: 1000 * 60 * 60 * 9, // 9 Hours
  })
}
