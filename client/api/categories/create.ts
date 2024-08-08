import { apiClient } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type CreateCategoryPayload = {
  name: string
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      const res = await apiClient.post('/categories', payload)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'], refetchType: 'all' })
    },
  })
}
