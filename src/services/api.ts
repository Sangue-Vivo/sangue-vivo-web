import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 60000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sangue-vivo-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url || ''
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register')
    // Sessão expirada durante uso normal: limpa e manda pro login.
    // Falha de login/registro (também 401/400) NÃO deve redirecionar — a tela exibe o erro.
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('sangue-vivo-token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
