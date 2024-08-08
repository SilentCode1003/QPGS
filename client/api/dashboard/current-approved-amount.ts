import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

type GetCurrentApprovedTotalAmountResponse = {
  data: {
    changePercent: number
    currentMonthTotalAmount: string
  }
}

export const useGetCurrentApprovedTotalAmount = () => {
  return useQuery({
    queryKey: ['quotations', 'current-approved-amount'],
    queryFn: async () => {
      const res = await apiClient.get<GetCurrentApprovedTotalAmountResponse>(
        '/dashboard/current-approved-amount'
      )
      return res.data
    },
  })
}
