import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

type GetQuotationCountPerMonthResponse = {
  data: {
    date: string
    count: number
  }[]
}

export const useGetQuotationsPerMonth = () => {
  return useQuery({
    queryKey: ['quotations', 'quotations-per-month'],
    queryFn: async () => {
      const res = await apiClient.get<GetQuotationCountPerMonthResponse>(
        '/dashboard/quotations-per-month'
      )
      return res.data
    },
  })
}
