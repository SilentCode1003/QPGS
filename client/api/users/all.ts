import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { User } from '../auth/me'

type GetAllUsersResponse = {
  data: User[]
}

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiClient.get<GetAllUsersResponse>('/users')
      return res.data
    },
  })
}
