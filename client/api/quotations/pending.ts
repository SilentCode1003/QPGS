import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { GetAllQuotationsResponse } from './all'

export const useGetPendingQuotations = () => {
  return useQuery({
    queryKey: ['quotations', 'pending'],
    queryFn: async () => {
      const res = await apiClient.get<GetAllQuotationsResponse>('/quotations/pending')
      return res.data
    },
  })
}
