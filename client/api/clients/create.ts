import { apiClient } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type CreateClientPayload = {
  name: string
  tel_no: string | null
  contact_no: string
  email: string
  address: string
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateClientPayload) => {
      const res = await apiClient.post('/clients', payload)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'], refetchType: 'all' })
    },
  })
}
