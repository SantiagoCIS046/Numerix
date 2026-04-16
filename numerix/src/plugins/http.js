/**
 * plugins/http.js — Cliente HTTP basado en Axios (Unificado)
 * 
 * Reemplaza al anterior axios.js y al cliente fetch temporal.
 * Configurado con URL Absoluta para el túnel del profesor.
 */

import axios from 'axios'
import { useAuthStore } from '@/store/auth.js'

// URL Base Absoluta (Extraída del .env o fallback al túnel activo)
// Ahora siempre incluimos /api en la base para simplificar los servicios.
const RAW_URL = (import.meta.env.VITE_API_URL || 'https://pj01pdf1-3005.use2.devtunnels.ms').replace(/\/$/, '')
const BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL}/api`

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Tunnel-Skip-Anti-Phishing-Page': 'true',
    'Bypass-Tunnel-Reminder': 'true'
  }
})

// Interceptor para inyectar Token en cada petición
axiosInstance.interceptors.request.use(config => {
  const authS = useAuthStore()
  if (authS.token) {
    // 🛡️ REFUERZO DE IDENTIDAD: Enviamos ambos formatos para asegurar compatibilidad
    config.headers['x-token'] = authS.token
    config.headers['Authorization'] = `Bearer ${authS.token}`
  } else {
    console.warn("⚠️ ALERTA DE SEGURIDAD: Intentando petición sin Token JWT.");
  }
  return config
})

// Interceptor de respuesta para Depuración Avanzada (Debug 400)
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.group('%c 🔥 ERROR DEL BACKEND ', 'background: #ff4444; color: #fff; border-radius: 4px; padding: 2px;')
      console.log('Status:', error.response.status)
      console.log('Endpoint:', error.config.url)
      console.log('Detalle:', error.response.data)
      console.groupEnd()
    }
    return Promise.reject(error)
  }
)

// Métodos de conveniencia que devuelven data directamente
export const http = {
  get: (endpoint, auth = false) => axiosInstance.get(endpoint, { authRequired: auth }).then(r => r.data),
  post: (endpoint, body, auth = false) => axiosInstance.post(endpoint, body, { authRequired: auth }).then(r => r.data),
  put: (endpoint, body, auth = false) => axiosInstance.put(endpoint, body, { authRequired: auth }).then(r => r.data),
  delete: (endpoint, auth = false) => axiosInstance.delete(endpoint, { authRequired: auth }).then(r => r.data),
}

export const httpClient = http // Alias para compatibilidad con código existente
export const httpClientUnificado = http 
export default http
