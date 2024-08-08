import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

export type Category = {
  id: number
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

type GetAllCategoriesResponse = {
  data: Category[]
}

type QueryParams = {
  is_active?: 'true' | 'false'
}

export const useGetAllCategories = (queryParams?: QueryParams) => {
  const filteredParams =
    queryParams && Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v))

  const queryKey = filteredParams ? ['categories', { queryParams: filteredParams }] : ['categories']

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await apiClient.get<GetAllCategoriesResponse>(
        '/categories?' + new URLSearchParams(filteredParams)
      )
      return res.data
    },
  })
}
