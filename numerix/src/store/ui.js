/**
 * store/ui.js — Estado global de interfaz de usuario
 * 
 * Maneja estados de carga, alertas globales y
 * cualquier condición de UI compartida entre componentes.
 */

import { reactive, computed } from 'vue'

// ─── Estado privado reactivo ────────────────────────────────
const _state = reactive({
  /** Contador de peticiones activas (para mostrar loading global) */
  loadingCount: 0,

  /** Alerta global en la parte superior de la app */
  alert: {
    show:    false,
    message: '',
    type:    'info', // 'info' | 'success' | 'danger' | 'warning'
  },
})

// ─── Getters ────────────────────────────────────────────────

/** true si hay alguna petición en curso */
export const isLoading = computed(() => _state.loadingCount > 0)

/** Estado de la alerta global */
export const globalAlert = computed(() => _state.alert)

// ─── Acciones ───────────────────────────────────────────────

/** Iniciar estado de carga (incrementa contador) */
export function startLoading() {
  _state.loadingCount++
}

/** Finalizar estado de carga (decrementa contador, nunca baja de 0) */
export function stopLoading() {
  if (_state.loadingCount > 0) _state.loadingCount--
}

/**
 * Mostrar una alerta global auto-dismissible.
 * @param {string} message - Mensaje a mostrar
 * @param {'info'|'success'|'danger'|'warning'} type - Tipo de alerta
 * @param {number} duration - Ms antes de ocultarse (default: 4000)
 */
export function showAlert(message, type = 'info', duration = 4000) {
  _state.alert = { show: true, message, type }
  if (duration > 0) {
    setTimeout(() => hideAlert(), duration)
  }
}

/** Ocultar la alerta global */
export function hideAlert() {
  _state.alert.show = false
}

// ─── Exportar como objeto para uso conveniente ───────────────
export const uiStore = {
  isLoading,
  globalAlert,
  startLoading,
  stopLoading,
  showAlert,
  hideAlert,
}

export default uiStore
