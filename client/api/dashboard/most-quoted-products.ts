import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

type GetMostQuotedProductsResponse = {
  data: {
    name: string
    value: number
  }[]
}

export const useGetMostQuotedProducts = () => {
  return useQuery({
    queryKey: ['quotations', 'most-quoted-products'],
    queryFn: async () => {
      const res = await apiClient.get<GetMostQuotedProductsResponse>(
        '/dashboard/most-quoted-products'
      )
      return res.data
    },
  })
}
