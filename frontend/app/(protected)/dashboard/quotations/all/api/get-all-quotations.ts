import { apiClient } from '@/lib/api-client'
import { Quotation } from '@/types/Quotation'
import { useQuery } from '@tanstack/react-query'

type AllQuotationsResponse = {
  data: Quotation[]
}

export function useGetAllQuotations() {
  return useQuery({
    queryKey: ['all-quotations'],
    queryFn: () => {
      return apiClient.get<AllQuotationsResponse>('/quotations')
    },
  })
}
