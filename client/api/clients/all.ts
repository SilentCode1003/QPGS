import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { User } from '../auth/me'

export type Client = {
  id: number
  name: string
  tel_no: string | null
  contact_no: string
  email: string
  address: string
  created_by_id: number
  created_by_user: Omit<User, 'role'>
  is_active: boolean
  created_at: string
  updated_at: string
}

type GetAllClientsResponse = {
  data: Client[]
}

type QueryParams = {
  is_active?: 'true' | 'false'
}

export const useGetAllClients = (queryParams?: QueryParams) => {
  const filteredParams =
    queryParams && Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v))

  const queryKey = filteredParams ? ['clients', { queryParams: filteredParams }] : ['clients']

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiClient.get<GetAllClientsResponse>(
        '/clients?' + new URLSearchParams(filteredParams)
      )
      return res.data
    },
  })
}
