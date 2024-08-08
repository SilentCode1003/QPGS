import { apiClient } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type CreateUserPayload = {
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
  role_id: number
  job_title: string
  signature: string | null
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const res = await apiClient.post('/users', payload)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'], type: 'all' })
    },
  })
}
