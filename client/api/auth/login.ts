import { apiClient } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from './me'

type LoginPayload = {
  username: string
  password: string
}

type LoginResponse = {
  data: User
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await apiClient.post<LoginResponse>('/auth/login', payload)
      return res.data
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
