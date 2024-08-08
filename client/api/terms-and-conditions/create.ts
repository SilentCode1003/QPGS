import { apiClient } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type CreateTermsAndConditionsPayload = {
  summary: string
  body: string
}

export const useCreateTermsAndConditions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateTermsAndConditionsPayload) => {
      const res = await apiClient.post('/terms-and-conditions', payload)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms-and-conditions'], refetchType: 'all' })
    },
  })
}
