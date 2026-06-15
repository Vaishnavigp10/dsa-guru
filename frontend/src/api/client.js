import axios from 'axios'

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  try {
    const auth  = JSON.parse(localStorage.getItem('auth-storage') || '{}')
    const token = auth?.state?.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }
  } catch (e) {
    delete config.headers.Authorization
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default client