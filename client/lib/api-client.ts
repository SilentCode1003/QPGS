import { CONFIG_ENV } from '@/config/env'
import { notifications } from '@mantine/notifications'
import Axios, { AxiosError } from 'axios'

export const apiClient = Axios.create({
  baseURL: CONFIG_ENV.API_URL,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('axios interceptor', error)

    if (error instanceof AxiosError) {
      if (typeof error.response?.data.message === 'object') {
        notifications.show({ title: 'Error', message: 'Invalid data', color: 'red' })
      } else if (error.response?.data.message) {
        notifications.show({ title: 'Error', message: error.response.data.message, color: 'red' })
      }
    }

    return Promise.reject(error)
  }
)
