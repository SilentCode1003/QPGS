import { apiClient } from '@/lib/api-client'
import { Quotation } from '@/types/Quotation'
import { useQuery } from '@tanstack/react-query'

type MyQuotationsResponse = {
  data: Quotation[]
}

export function useGetMyQuotations(userId: number) {
  return useQuery({
    queryKey: ['my-quotations'],
    queryFn: () => {
      return apiClient.get<MyQuotationsResponse>(
        `/users/${encodeURIComponent(userId)}/created-quotations`
      )
    },
  })
}
