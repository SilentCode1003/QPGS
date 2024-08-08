import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { Category } from '../categories/all'

export type Product = {
  id: number
  name: string
  description: string
  price: string
  category_id: number
  category: Category
  is_active: boolean
  created_at: string
  updated_at: string
}

export type GetAllProductsResponse = {
  data: Product[]
}

type QueryParams = {
  is_active?: 'true' | 'false'
  category_id?: string
}

export const useGetAllProducts = (queryParams?: QueryParams) => {
  const filteredParams =
    queryParams && Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v))

  const queryKey = filteredParams ? ['products', { queryParams: filteredParams }] : ['products']

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiClient.get<GetAllProductsResponse>(
        '/products?' + new URLSearchParams(filteredParams)
      )
      return res.data
    },
  })
}
