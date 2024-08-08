import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { TermsAndConditions } from './all'

type GetTermsAndConditionsByIdResponse = {
  data: TermsAndConditions
}

export const useGetTermsAndConditionsById = (params: number) => {
  return useQuery({
    queryKey: ['terms-and-conditions', params],
    queryFn: async () => {
      const res = await apiClient.get<GetTermsAndConditionsByIdResponse>(
        `/terms-and-conditions/${params}`
      )
      return res.data
    },
    retry: false,
  })
}
