import { apiClient } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'

type ChangePasswordPayload = {
  password: string
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      const res = await apiClient.post('/users/password', payload)
      return res.data
    },
  })
}
