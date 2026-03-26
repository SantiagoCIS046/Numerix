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
// En desarrollo usamos el proxy /api de Vite.
// En producción se usa VITE_API_URL.
const VITE_API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_BASE = VITE_API_URL ? `${VITE_API_URL}/api` : "/api";

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

    // ─── MOCK LOGIC (Modo Frontend Exclusivo) ─────────────────
    if (import.meta.env.DEV) {
      console.log(`[MOCK HTTP] ${method} ${endpoint}`, body ?? '')
    }

    // Simulamos un retraso de red
    await new Promise(resolve => setTimeout(resolve, 800))

    // MOCK RESPONSES
    if (endpoint === '/usuarios/login') {
      return { 
        token: 'mock-jwt-token-' + Date.now(), 
        user: { 
          id: 'mock-user-123', 
          nombre: 'Viajero Astral', 
          email: body.email, 
          id_rol: 1, 
          plan: 'Ninguno' 
        } 
      }
    }

    if (endpoint === '/usuarios/register') {
      return { msg: 'Usuario registrado (MOCK)' }
    }

    // Default mock response
    return { status: 'ok', message: 'Respuesta simulada', data: [] }

  } catch (err) {
    throw err
  } finally {
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
