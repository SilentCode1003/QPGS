import Axios from 'axios'

export const api = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log('interceptor', error) // TODO: show notification
    return Promise.reject(error)
  },
)
