import { apiClient } from '@/lib/api-client'
import { useMutation } from '@tanstack/react-query'

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.delete('/auth/logout')
      return res.data
    },
  })
}
