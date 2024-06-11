import { apiClient } from '@/lib/api-client'
import { User } from '@/types/User'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
  username: z.string().trim().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

type LoginInput = z.infer<typeof schema>

type LoginResponse = {
  data: User
}

export function useLogin() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')

  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: LoginInput) => {
      const res = apiClient.post<LoginResponse>('/auth/login', values)
      console.log(res)
      return res
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['authenticated-user'], res.data.data)
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green',
      })
      router.push(redirectTo || '/dashboard')
    },
  })
}
