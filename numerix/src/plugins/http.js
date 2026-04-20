/**
 * plugins/http.js — Cliente HTTP basado en Axios (Unificado)
 *
 * Reemplaza al anterior axios.js y al cliente fetch temporal.
 * Configurado con URL Absoluta para el túnel del profesor.
 *
 * ─── CORS con DevTunnel ───────────────────────────────────────────────────
 * Los DevTunnels de VS Code muestran una página anti-phishing al primer
 * acceso desde un dominio externo. Para solucionarlo:
 *   1. Abre el túnel directamente en el navegador y acepta la página.
 *   2. O usa la extensión "Dev Tunnels" de VS Code con visibilidad "Public".
 * ─────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios'
import { useAuthStore } from '@/store/auth.js'

// ─── URL Base ────────────────────────────────────────────────────────────────
// En desarrollo: VITE_API_URL = /api  → Vite proxy reenvía al DevTunnel
// En produción:  VITE_API_URL = https://mi-backend.com/api → Direct
const CONFIGURED_URL = import.meta.env.VITE_API_URL || '/api'

// Si ya es una URL completa (http/https), usarla directamente.
// Si es relativa (/api), axios la completará con el origin de la página (localhost:5173)
// y el proxy de Vite se encarga de enrutarla al backend real.
const BASE_URL = CONFIGURED_URL.startsWith('http') 
  ? CONFIGURED_URL.replace(/\/$/, '') 
  : CONFIGURED_URL

// Rutas que NO requieren autenticación (token JWT)
const PUBLIC_ENDPOINTS = [
  '/usuarios/login',
  '/usuarios/register',
  '/usuarios/request-reset-password',
  '/usuarios/reset-password',
  '/usuarios/ether-login',
]

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Headers requeridos para saltar la página anti-phishing de DevTunnel
    'X-Tunnel-Skip-Anti-Phishing-Page': 'true',
    'Bypass-Tunnel-Reminder': 'true',
  }
})

// Interceptor de REQUEST: inyectar Token solo en rutas privadas
axiosInstance.interceptors.request.use(config => {
  const authS = useAuthStore()

  // Verificar si el endpoint actual es público
  const isPublic = PUBLIC_ENDPOINTS.some(pub => config.url?.endsWith(pub))

  if (authS.token) {
    // 🛡️ Enviamos ambos formatos para asegurar compatibilidad con el backend
    config.headers['x-token'] = authS.token
    config.headers['Authorization'] = `Bearer ${authS.token}`
  } else if (!isPublic) {
    // Solo advertir si la ruta realmente necesita autenticación
    console.warn(`⚠️ Petición a ruta protegida sin Token JWT: ${config.url}`)
  }

  return config
})

// Interceptor de RESPONSE: depuración avanzada de errores
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Sin respuesta = error de red/CORS
      console.group('%c 🌐 ERROR DE RED / CORS ', 'background: #ff8800; color: #fff; border-radius: 4px; padding: 2px;')
      console.error('No se recibió respuesta del servidor. Posibles causas:')
      console.info('  1. El servidor del backend está apagado.')
      console.info('  2. El DevTunnel ha caducado o cambiado de URL.')
      console.info('  3. CORS: abre la URL del túnel en el navegador y acepta la página anti-phishing.')
      console.info('  URL intentada:', error.config?.baseURL + error.config?.url)
      console.groupEnd()
    } else {
      console.group('%c 🔥 ERROR DEL BACKEND ', 'background: #ff4444; color: #fff; border-radius: 4px; padding: 2px;')
      console.log('Status:  ', error.response.status)
      console.log('Endpoint:', error.config.url)
      console.log('Detalle: ', error.response.data)
      console.groupEnd()
    }
    return Promise.reject(error)
  }
)

// Métodos de conveniencia que devuelven data directamente
export const http = {
  get:    (endpoint, auth = false) => axiosInstance.get(endpoint,         { authRequired: auth }).then(r => r.data),
  post:   (endpoint, body, auth = false) => axiosInstance.post(endpoint, body, { authRequired: auth }).then(r => r.data),
  put:    (endpoint, body, auth = false) => axiosInstance.put(endpoint,  body, { authRequired: auth }).then(r => r.data),
  delete: (endpoint, auth = false) => axiosInstance.delete(endpoint,      { authRequired: auth }).then(r => r.data),
}

export const httpClient = http          // Alias para compatibilidad con código existente
export const httpClientUnificado = http
export default http
