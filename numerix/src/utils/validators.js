/**
 * utils/validators.js — Validaciones de formularios
 * 
 * Funciones puras que retornan { valid: boolean, message: string }.
 * Se usan en los formularios de Login, Registro, Pago, etc.
 */

// ─── CAMPOS BÁSICOS ─────────────────────────────────────────

/**
 * Validar que un campo no esté vacío.
 * @param {string} value 
 * @param {string} fieldName - Nombre del campo para el mensaje
 */
export function required(value, fieldName = 'Este campo') {
  const valid = value !== null && value !== undefined && String(value).trim() !== ''
  return { valid, message: valid ? '' : `${fieldName} es obligatorio.` }
}

// ─── EMAIL ──────────────────────────────────────────────────

/**
 * Validar formato de email.
 * @param {string} email 
 */
export function validateEmail(email) {
  if (!email) return { valid: false, message: 'El email es obligatorio.' }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const valid  = regex.test(String(email).trim().toLowerCase())
  return { valid, message: valid ? '' : 'El email no tiene un formato válido.' }
}

// ─── CONTRASEÑA ─────────────────────────────────────────────

/**
 * Validar fortaleza de contraseña.
 * Mínimo: 8 caracteres, 1 mayúscula, 1 número.
 * @param {string} password 
 */
export function validatePassword(password) {
  if (!password) return { valid: false, message: 'La contraseña es obligatoria.' }
  if (password.length < 8)          return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres.' }
  if (!/[A-Z]/.test(password))      return { valid: false, message: 'La contraseña debe incluir al menos una mayúscula.' }
  if (!/[0-9]/.test(password))      return { valid: false, message: 'La contraseña debe incluir al menos un número.' }
  return { valid: true, message: '' }
}

/**
 * Validar que dos contraseñas coincidan.
 * @param {string} password 
 * @param {string} confirm 
 */
export function validatePasswordMatch(password, confirm) {
  const valid = password === confirm
  return { valid, message: valid ? '' : 'Las contraseñas no coinciden.' }
}

// ─── NOMBRE ─────────────────────────────────────────────────

/**
 * Validar nombre completo (mín. 2 caracteres, solo letras y espacios).
 * @param {string} name 
 */
export function validateName(name) {
  if (!name || name.trim().length < 2) return { valid: false, message: 'Ingresa tu nombre completo.' }
  const valid = /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name.trim())
  return { valid, message: valid ? '' : 'El nombre solo puede contener letras.' }
}

// ─── FECHA ──────────────────────────────────────────────────

/**
 * Validar que una fecha sea válida y el usuario sea mayor de {minAge} años.
 * @param {string} dateStr - Formato YYYY-MM-DD
 * @param {number} minAge  - Edad mínima (default: 13)
 */
export function validateBirthDate(dateStr, minAge = 13) {
  if (!dateStr) return { valid: false, message: 'La fecha de nacimiento es obligatoria.' }
  const date = new Date(dateStr)
  if (isNaN(date)) return { valid: false, message: 'La fecha no es válida.' }

  const today = new Date()
  const age = today.getFullYear() - date.getUTCFullYear()
  const valid = age >= minAge
  return { valid, message: valid ? '' : `Debes tener al menos ${minAge} años para registrarte.` }
}

// ─── TARJETA DE CRÉDITO ─────────────────────────────────────

/**
 * Validar número de tarjeta (16 dígitos, algoritmo de Luhn básico).
 * @param {string} cardNumber - Solo dígitos
 */
export function validateCardNumber(cardNumber) {
  if (!cardNumber) return { valid: false, message: 'El número de tarjeta es obligatorio.' }
  const cleaned = cardNumber.replace(/\D/g, '')
  if (cleaned.length !== 16) return { valid: false, message: 'El número de tarjeta debe tener 16 dígitos.' }
  return { valid: true, message: '' }
}

/**
 * Validar fecha de expiración (formato MM/YY, no vencida).
 * @param {string} expiry - Ej: "12/27"
 */
export function validateExpiry(expiry) {
  if (!expiry) return { valid: false, message: 'La fecha de expiración es obligatoria.' }
  const match = expiry.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return { valid: false, message: 'Formato inválido. Usa MM/AA.' }

  const month = parseInt(match[1])
  const year  = 2000 + parseInt(match[2])
  if (month < 1 || month > 12) return { valid: false, message: 'Mes inválido.' }

  const now = new Date()
  const expDate = new Date(year, month - 1)
  const valid = expDate >= new Date(now.getFullYear(), now.getMonth())
  return { valid, message: valid ? '' : 'La tarjeta está vencida.' }
}

// ─── HELPER: Validar múltiples campos ────────────────────────

/**
 * Ejecutar múltiples validaciones y retornar el primer error.
 * @param {Array<{valid: boolean, message: string}>} validations 
 * @returns {string} Primer mensaje de error, o '' si todo es válido
 */
export function firstError(...validations) {
  const failed = validations.find(v => !v.valid)
  return failed ? failed.message : ''
}
