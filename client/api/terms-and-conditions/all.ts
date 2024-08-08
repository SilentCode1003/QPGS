import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

export type TermsAndConditions = {
  id: number
  summary: string
  body: string
  is_active: boolean
  created_at: string
  updated_at: string
}

type GetAllTermsAndConditionsResponse = {
  data: TermsAndConditions[]
}

type QueryParams = {
  is_active?: 'true' | 'false'
}

export const useGetAllTermsAndConditions = (queryParams?: QueryParams) => {
  const filteredParams =
    queryParams && Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v))

  const queryKey = filteredParams
    ? ['terms-and-conditions', { queryParams: filteredParams }]
    : ['terms-and-conditions']

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiClient.get<GetAllTermsAndConditionsResponse>(
        '/terms-and-conditions?' + new URLSearchParams(filteredParams)
      )
      return res.data
    },
  })
}
