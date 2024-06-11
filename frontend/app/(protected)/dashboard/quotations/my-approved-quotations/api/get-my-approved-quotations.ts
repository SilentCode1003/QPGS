import { apiClient } from '@/lib/api-client'
import { Quotation } from '@/types/Quotation'
import { useQuery } from '@tanstack/react-query'

type ApprovedQuotationsResponse = {
  data: Quotation[]
}

export function useGetMyApprovedQuotations(userId: number) {
  return useQuery({
    queryKey: ['my-approved-quotations'],
    queryFn: () => {
      return apiClient.get<ApprovedQuotationsResponse>(
        `/users/${encodeURIComponent(userId)}/approved-quotations`
      )
    },
  })
}
