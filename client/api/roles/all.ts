import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

export type Role = {
  id: number
  name: string
  created_at: string
}

type GetAllRolesResponse = {
  data: Role[]
}

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await apiClient.get<GetAllRolesResponse>('/roles')
      return res.data
    },
  })
}
