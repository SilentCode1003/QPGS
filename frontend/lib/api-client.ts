import { notifications } from '@mantine/notifications'
import Axios, { AxiosError } from 'axios'

export const apiClient = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    if (err instanceof AxiosError) {
      const message = err.response?.data.message || err.message
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      })
    }

    return Promise.reject(err)
  }
)
