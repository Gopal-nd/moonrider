import axios, { type AxiosRequestConfig } from 'axios'
import { useAuthStore } from './store'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    const { user } = useAuthStore.getState()
    const token = user?.token

    config.headers = config.headers ?? {}

    if (token) {
      ;(config.headers as Record<string, string>).Authorization =
        `Bearer ${token}`
    } else {
      delete (config.headers as Record<string, string>).Authorization
    }

    return config
  },
  (error) => Promise.reject(error),
)

export { axiosInstance }
