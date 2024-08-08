import { apiClient } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useApproveQuotation = (quotationId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.put(`/quotations/${quotationId}/approve`)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations', quotationId] })
    },
  })
}
