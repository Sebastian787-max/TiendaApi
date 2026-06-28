import axios from 'axios'

// Instancia base apuntando al backend desplegado
const api = axios.create({
  baseURL: 'https://latiendaapibackend.onrender.com',
  headers: { 'Content-Type': 'application/json' },
})

// ── Interceptor de REQUEST ────────────────────────────────────────────────────
// Antes de cada llamada, busca el token en localStorage y lo adjunta.
// Si no hay token, la petición sale sin header de auth (el backend la rechazará
// con 401 en rutas protegidas, lo cual es el comportamiento correcto).
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Interceptor de RESPONSE ───────────────────────────────────────────────────
// Si el backend devuelve 401 (token vencido / inválido), limpia el storage
// y redirige al login automáticamente.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
