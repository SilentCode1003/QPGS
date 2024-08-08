import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { GetAllQuotationsResponse } from './all'

export const useGetRecentQuotations = () => {
  return useQuery({
    queryKey: ['quotations', 'recent'],
    queryFn: async () => {
      const res = await apiClient.get<GetAllQuotationsResponse>('/quotations/recent')
      return res.data
    },
  })
}
