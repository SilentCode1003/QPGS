import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

type GetCurrentApprovedCountResponse = {
  data: {
    changePercent: number
    currentMonthTotalCount: number
  }
}

export const useGetCurrentApprovedCount = () => {
  return useQuery({
    queryKey: ['quotations', 'current-approved-count'],
    queryFn: async () => {
      const res = await apiClient.get<GetCurrentApprovedCountResponse>(
        '/dashboard/current-approved-count'
      )
      return res.data
    },
  })
}
