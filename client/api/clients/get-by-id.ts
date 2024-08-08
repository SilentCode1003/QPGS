import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { Client } from './all'

type GetClientByIdResponse = {
  data: Client
}

export const useGetClientById = (params: number) => {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: async () => {
      const res = await apiClient.get<GetClientByIdResponse>(`/clients/${params}`)
      return res.data
    },
  })
}
