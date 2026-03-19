/**
 * plugins/http.js — Cliente HTTP con interceptores
 * 
 * Reemplaza al anterior axios.js.
 * Integra el store de auth para tokens y el store de UI para loading.
 * 
 * USO:
 *   import { httpClient } from '@/plugins/http.js'
 *   const data = await httpClient.post('/usuarios/login', { email, password })
 */

import { authStore } from '@/store/auth.js'
import { uiStore } from '@/store/ui.js'

// ─── Base URL ────────────────────────────────────────────────
const API_BASE = import.meta.env.DEV
  ? '/api'
  : `${import.meta.env.VITE_API_URL}/api`

// ─── Cliente central ─────────────────────────────────────────

/**
 * @param {string}  endpoint  - Ruta relativa (ej: "/usuarios/login")
 * @param {string}  method    - Verbo HTTP
 * @param {object}  [body]    - Cuerpo de la petición
 * @param {boolean} [auth]    - Si true, adjunta el token JWT
 */
async function request(endpoint, method = 'GET', body = null, auth = false) {
  // Interceptor de REQUEST: agregar headers estándar
  const headers = {
    'Content-Type': 'application/json',
    'X-Tunnel-Skip-AntiCsrf': 'true',
    'X-Requested-With': 'XMLHttpRequest',
  }

  if (auth) {
    const token = authStore.token.value
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const config = { method, headers }
  if (body) config.body = JSON.stringify(body)

  // Iniciar indicador de carga
  uiStore.startLoading()

  try {
    const fullUrl = `${API_BASE}${endpoint}`

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[HTTP] ${method} ${fullUrl}`, body ?? '')
    }

    const response = await fetch(fullUrl, config)

    if (import.meta.env.DEV) {
      console.log(`[HTTP] ${response.status} ${fullUrl}`)
    }

    // Interceptor de RESPONSE: parsear JSON
    let data
    try {
      data = await response.json()
    } catch {
      throw new Error(`El servidor respondió con un formato inesperado (${response.status})`)
    }

    // Interceptor de RESPONSE: manejar errores HTTP
    if (!response.ok) {
      // Si el backend devuelve 401, limpiar la sesión automáticamente
      // EXCEPCIÓN: No redirigir si es el Administrador (Guía) para permitir modo offline/mock
      const user = authStore.currentUser.value
      const isGuidance = (user?.id_rol || user?.role_id) === 2

      if (response.status === 401 && !isGuidance) {
        authStore.clearSession()
        window.location.href = '/auth'
      }

      const message =
        data?.errors || data?.msg || data?.message || `Error ${response.status}`
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message))
    }

    return data

  } catch (err) {
    // Interceptor de ERROR: detectar problemas de red
    if (err.name === 'TypeError') {
      throw new Error('No se pudo conectar al servidor. Verifica que el backend esté activo.')
    }
    throw err
  } finally {
    // Siempre detener el loading, incluso si hay error
    uiStore.stopLoading()
  }
}

// ─── Métodos de conveniencia ─────────────────────────────────
export const httpClient = {
  get: (endpoint, auth = false) => request(endpoint, 'GET', null, auth),
  post: (endpoint, body, auth = false) => request(endpoint, 'POST', body, auth),
  put: (endpoint, body, auth = false) => request(endpoint, 'PUT', body, auth),
  delete: (endpoint, auth = false) => request(endpoint, 'DELETE', null, auth),
}

export default httpClient
