import { notifications } from '@mantine/notifications'
import Axios, { AxiosError } from 'axios'

export const api = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

type ErrorResponse = {
  message: string
}

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ErrorResponse>) => {
    notifications.show({
      title: 'Error',
      message: error.response?.data.message,
      color: 'red',
    })

    return Promise.reject(error)
  },
)
