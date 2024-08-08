import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

type GetPendingQuotationsCountResponse = {
  data: number
}

export const useGetPendingQuotationsCount = () => {
  return useQuery({
    queryKey: ['quotations', 'pending-count'],
    queryFn: async () => {
      const res = await apiClient.get<GetPendingQuotationsCountResponse>('/dashboard/pending-count')
      return res.data
    },
  })
}
