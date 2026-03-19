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
import { notificationsService } from '../services/api.js'


// ─── Estado privado reactivo ────────────────────────────────
const _state = reactive({
  /** Token JWT del usuario autenticado */
  token: localStorage.getItem('token') || null,

  /** Objeto del usuario: { nombre, email, fecha_nacimiento, role } */
  user: (() => {
    try {
      const stored = localStorage.getItem('user')
      if (!stored) return null
      const userData = JSON.parse(stored)
      // Apply override on initialization for the admin email
      if (userData && (userData.email === 'santiagocisneros046@gmail.com' || userData.email === 'santiagocisneros046@gamil.com')) {
        userData.id_rol = 2
      }
      return userData
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

/** true si el usuario tiene rol de Guía (Admin) */
export const isAdmin = computed(() => {
  if (!_state.user) return false
  // Check by id_rol (2 for admin) or by the specific developer email
  return _state.user.id_rol === 2 || 
         _state.user.role === 'Guía' || 
         _state.user.email === 'santiagocisneros046@gmail.com' ||
         _state.user.email === 'santiagocisneros046@gamil.com'
})

/** true si el usuario es admin o tiene un plan activo (no 'Ninguno') */
export const isSubscribed = computed(() => {
  if (isAdmin.value) return true
  if (!_state.user) return false
  
  const plan = (_state.user.plan || 'Ninguno').toLowerCase()
  return plan !== 'ninguno' && plan !== 'none' && plan !== ''
})


// ─── Acciones ───────────────────────────────────────────────

/**
 * Verifica si la suscripción del usuario vence en 10 días 
 * y envía un correo de recordatorio si es necesario.
 */
export function checkExpirationReminder() {
  if (!_state.user || !_state.user.vencimiento) return

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const expDate = new Date(_state.user.vencimiento)
    expDate.setHours(0, 0, 0, 0)

    const diffTime = expDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // REGRA: Si faltan exactamente 10 días, enviar correo
    if (diffDays === 10) {
      const lastSentKey = `reminder_sent_10d_${_state.user.email}`
      const lastSentDate = localStorage.getItem(lastSentKey)

      // Evitar enviar múltiples veces el mismo día
      if (lastSentDate !== today.toISOString().split('T')[0]) {
        notificationsService.sendExpirationReminder(
          _state.user.email, 
          _state.user.plan || 'Suscripción', 
          10
        ).then(() => {
          localStorage.setItem(lastSentKey, today.toISOString().split('T')[0])
          console.log('Recordatorio de 10 días enviado con éxito.')
        }).catch(err => console.error('Error al enviar recordatorio:', err))
      }
    }
  } catch (err) {
    console.error('Error en checkExpirationReminder:', err)
  }
}

/**
 * Guardar sesión tras login exitoso.
 * @param {string} tokenValue - JWT recibido del backend
 * @param {object} userData   - Objeto usuario (data.user[0] del backend)
 */
export function setSession(tokenValue, userData) {
  // Override role for the specific admin email provided by the user
  if (userData && (userData.email === 'santiagocisneros046@gmail.com' || userData.email === 'santiagocisneros046@gamil.com')) {
    userData.id_rol = 2; // Ensure they have the admin (Guía) role
  }

  _state.token = tokenValue
  _state.user  = userData

  // Persistir en localStorage
  localStorage.setItem('token', tokenValue)
  localStorage.setItem('user', JSON.stringify(userData))

  // Al "ingresar", verificar si hay que mandar recordatorio
  checkExpirationReminder()
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

// Inicialización automática
if (isAuthenticated.value) {
  checkExpirationReminder()
}

// ─── Exportar como objeto para uso conveniente ───────────────
export const authStore = {
  // Getters
  isAuthenticated,
  userName,
  firstName,
  token,
  currentUser,
  isAdmin,
  isSubscribed,
  // Acciones
  setSession,
  clearSession,
  hasValidToken,
  checkExpirationReminder,
}

export default authStore

