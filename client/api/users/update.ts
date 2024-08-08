import { apiClient } from '@/lib/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type UpdateUserPayload = {
  first_name: string | null
  last_name: string | null
  email: string | null
  username: string | null
  password: string | null
  role_id: number | null
  job_title: string | null
  signature: string | null
  is_active: string | null
}

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      const res = await apiClient.patch(`/users/${userId}`, payload)
      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userId], type: 'all' })
    },
  })
}
