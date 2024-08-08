import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { User } from '../auth/me'

type UserWithSignature = User & {
  signature: string | null
}

type GetUserByIdResponse = {
  data: UserWithSignature
}

export const useGetUserById = (params: number) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const res = await apiClient.get<GetUserByIdResponse>(`/users/${params}`)
      return res.data
    },
    retry: false,
  })
}
