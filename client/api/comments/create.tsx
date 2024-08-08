import { apiClient } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type CreateCommentPayload = {
  body: string
}

export const useCreateComment = (quotationId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
      const res = await apiClient.post(`/quotations/${quotationId}/comments`, payload)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', quotationId], type: 'all' })
    },
  })
}
