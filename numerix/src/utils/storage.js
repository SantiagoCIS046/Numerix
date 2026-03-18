/**
 * utils/storage.js — Wrapper tipado para localStorage
 * 
 * Centraliza todas las operaciones de localStorage para:
 * - Evitar errores de JSON.parse dispersos por la app
 * - Tener un solo lugar donde cambiar las claves
 * - Facilitar la migración futura a sessionStorage o IndexedDB
 */

// ─── Claves centralizadas ────────────────────────────────────
export const KEYS = Object.freeze({
  TOKEN:            'token',
  USER:             'user',
  ALIGNMENT:        'alignmentProfile',
  SUBSCRIPTION:     'userSubscription',
  PLAN_TEMP:        'selectedPlanTemp',
  PAYMENT_HISTORY:  'cosmic_history',
  LANGUAGE:         'userLanguage',
})

// ─── Helpers internos ────────────────────────────────────────
function safeParse(value) {
  try {
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

// ─── Token ──────────────────────────────────────────────────
export const tokenStorage = {
  get: ()          => localStorage.getItem(KEYS.TOKEN),
  set: (val)       => localStorage.setItem(KEYS.TOKEN, val),
  remove: ()       => localStorage.removeItem(KEYS.TOKEN),
}

// ─── Usuario ─────────────────────────────────────────────────
export const userStorage = {
  get: ()          => safeParse(localStorage.getItem(KEYS.USER)),
  set: (obj)       => localStorage.setItem(KEYS.USER, JSON.stringify(obj)),
  remove: ()       => localStorage.removeItem(KEYS.USER),
}

// ─── Perfil de Alineación ────────────────────────────────────
export const alignmentStorage = {
  get: ()          => safeParse(localStorage.getItem(KEYS.ALIGNMENT)),
  set: (obj)       => localStorage.setItem(KEYS.ALIGNMENT, JSON.stringify(obj)),
  remove: ()       => localStorage.removeItem(KEYS.ALIGNMENT),
}

// ─── Suscripción ─────────────────────────────────────────────
export const subscriptionStorage = {
  get: ()          => safeParse(localStorage.getItem(KEYS.SUBSCRIPTION)),
  set: (obj)       => localStorage.setItem(KEYS.SUBSCRIPTION, JSON.stringify(obj)),
  remove: ()       => localStorage.removeItem(KEYS.SUBSCRIPTION),
}

// ─── Plan temporal (para pagos) ──────────────────────────────
export const planTempStorage = {
  get: ()          => safeParse(localStorage.getItem(KEYS.PLAN_TEMP)),
  set: (obj)       => localStorage.setItem(KEYS.PLAN_TEMP, JSON.stringify(obj)),
  remove: ()       => localStorage.removeItem(KEYS.PLAN_TEMP),
}

// ─── Historial de pagos ──────────────────────────────────────
export const paymentHistoryStorage = {
  get: ()          => safeParse(localStorage.getItem(KEYS.PAYMENT_HISTORY)) || [],
  add: (transaction) => {
    const history = paymentHistoryStorage.get()
    history.unshift(transaction)
    localStorage.setItem(KEYS.PAYMENT_HISTORY, JSON.stringify(history))
  },
  remove: ()       => localStorage.removeItem(KEYS.PAYMENT_HISTORY),
}

// ─── Idioma ──────────────────────────────────────────────────
export const languageStorage = {
  get: ()          => localStorage.getItem(KEYS.LANGUAGE) || 'es',
  set: (lang)      => localStorage.setItem(KEYS.LANGUAGE, lang),
}

// ─── Limpiar sesión completa ─────────────────────────────────
export function clearAllSession() {
  tokenStorage.remove()
  userStorage.remove()
  alignmentStorage.remove()
  subscriptionStorage.remove()
  planTempStorage.remove()
}
