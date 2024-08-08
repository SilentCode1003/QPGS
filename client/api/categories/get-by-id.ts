import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import { Category } from './all'

type GetCategoryByIdResponse = {
  data: Category
}

export const useGetCategoryById = (params: number) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const res = await apiClient.get<GetCategoryByIdResponse>(`/categories/${params}`)
      return res.data
    },
    retry: false,
  })
}
