import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { Product } from './all'

type GetProductByIdResponse = {
  data: Product
}

export const useGetProductById = (params: number) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await apiClient.get<GetProductByIdResponse>(`/products/${params}`)
      return res.data
    },
    retry: false,
  })
}
