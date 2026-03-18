/**
 * store/auth.js — Estado global de autenticación
 * 
 * Gestiona el usuario autenticado, el token JWT y
 * el estado de sesión de forma reactiva en toda la app.
 * 
 * No requiere Pinia ni Vuex: usa reactive() de Vue 3.
 * Se inicializa automáticamente desde localStorage.
 */

import { reactive, computed } from 'vue'

// ─── Estado privado reactivo ────────────────────────────────
const _state = reactive({
  /** Token JWT del usuario autenticado */
  token: localStorage.getItem('token') || null,

  /** Objeto del usuario: { nombre, email, fecha_nacimiento, role } */
  user: (() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })(),
})

// ─── Getters (computed) ─────────────────────────────────────

/** true si hay token y usuario cargados */
export const isAuthenticated = computed(() => !!_state.token && !!_state.user)

/** Nombre del usuario para mostrar en la UI */
export const userName = computed(() => {
  const alignment = (() => {
    try {
      const stored = localStorage.getItem('alignmentProfile')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })()
  return alignment?.fullName || _state.user?.nombre || _state.user?.name || 'VIAJERO ASTRAL'
})

/** Primer nombre (para saludos) */
export const firstName = computed(() => {
  return userName.value.split(' ')[0] || 'VIAJERO'
})

/** Token JWT actual */
export const token = computed(() => _state.token)

/** Objeto usuario completo */
export const currentUser = computed(() => _state.user)

// ─── Acciones ───────────────────────────────────────────────

/**
 * Guardar sesión tras login exitoso.
 * @param {string} tokenValue - JWT recibido del backend
 * @param {object} userData   - Objeto usuario (data.user[0] del backend)
 */
export function setSession(tokenValue, userData) {
  _state.token = tokenValue
  _state.user  = userData

  // Persistir en localStorage
  localStorage.setItem('token', tokenValue)
  localStorage.setItem('user', JSON.stringify(userData))
}

/**
 * Cerrar sesión: limpiar estado y localStorage.
 */
export function clearSession() {
  _state.token = null
  _state.user  = null

  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('alignmentProfile')
  localStorage.removeItem('userSubscription')
  localStorage.removeItem('selectedPlanTemp')
}

/**
 * Verificar si el token existe (para guards de navegación).
 * @returns {boolean}
 */
export function hasValidToken() {
  return !!_state.token
}

// ─── Exportar como objeto para uso conveniente ───────────────
export const authStore = {
  // Getters
  isAuthenticated,
  userName,
  firstName,
  token,
  currentUser,
  // Acciones
  setSession,
  clearSession,
  hasValidToken,
}

export default authStore
