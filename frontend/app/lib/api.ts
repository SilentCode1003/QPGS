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
    if (!error.response) {
      // if network error
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      })
    } else if (error.response?.status >= 500) {
      // if server error
      notifications.show({
        title: 'Error',
        message: 'Server error',
        color: 'red',
      })
    } else {
      // if the error is not a network error (e.g. wrong credentials)
      notifications.show({
        title: 'Error',
        message: error.response?.data.message,
        color: 'red',
      })
    }

    return Promise.reject(error)
  },
)
