import { configureAuth } from 'react-query-auth'
import { api } from './api'
import { z } from 'zod'

// TODO: Maybe move types to a separate file
type User = {
  id: number
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
  role_id: number
  signature: string | null
  job_title: string
  created_at: string
  updated_at: string
}

type MeResponse = {
  data: User
}

// TODO: Maybe reuse the schema at login page
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
})
type LoginInput = z.infer<typeof loginSchema>

const getUser = async () => {
  try {
    const res = await api.get<MeResponse>('/auth/me')
    return res.data.data
  } catch (err) {
    return null
  }
}

const login = async (values: LoginInput) => {
  const res = await api.post<MeResponse>('/auth/login', values)
  return res.data.data
}

const logout = async () => {
  const res = await api.delete<null>('/auth/logout')
  return res.data
}

// TODO: fix this function
const register = async () => {
  console.log('register')
  return {}
}

export const { useUser, useLogin, useLogout, AuthLoader } = configureAuth({
  userFn: getUser,
  loginFn: login,
  logoutFn: logout,
  registerFn: register,
})
