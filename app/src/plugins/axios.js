import axios from 'axios'
import VueCookies from 'vue-cookies'

export default function createApiClient(basePath = '') {
  const baseApi = import.meta.env.VITE_API_BASE_URL || ''
  const api = axios.create({
    baseURL: baseApi + basePath,
    timeout: 15000,
    withCredentials: true,
  })

  api.interceptors.request.use(
    (config) => {
      try {
        const token = VueCookies.get('accessToken')
        if (token) config.headers.Authorization = `Bearer ${token}`
      } catch (e) {
        console.error(e) 
      }
      return config
    },
    (err) => Promise.reject(err),
  )

  return api
}
