/**
 * utils/formatters.js — Formateadores reutilizables
 * 
 * Funciones puras para formatear fechas, monedas,
 * texto y otros datos para mostrar en la UI.
 */

// ─── FECHAS ─────────────────────────────────────────────────

/**
 * Formatear fecha a formato legible en español.
 * @param {string|Date} date - Fecha ISO o Date object
 * @param {'short'|'long'|'numeric'} style - Estilo del formato
 * @returns {string} Ej: "17 de marzo de 2026" | "17 MAR, 2026"
 */
export function formatDate(date, style = 'long') {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d)) return '—'

  if (style === 'short') {
    // "17 MAR, 2026"
    const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]}, ${d.getUTCFullYear()}`
  }

  if (style === 'numeric') {
    // "2026-03-17"
    return d.toISOString().split('T')[0]
  }

  // Long: "17 de marzo de 2026"
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Calcular edad a partir de una fecha de nacimiento.
 * @param {string|Date} birthDate 
 * @returns {number} Edad en años
 */
export function calcAge(birthDate) {
  if (!birthDate) return 0
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getUTCFullYear()
  const monthDiff = today.getMonth() - birth.getUTCMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getUTCDate())) age--
  return age
}

/**
 * Formatear una fecha ISO para usar en <input type="date">
 * @param {string} isoDate - Ej: "2000-01-15T00:00:00.000Z"
 * @returns {string} "2000-01-15"
 */
export function toInputDate(isoDate) {
  if (!isoDate) return ''
  return isoDate.split('T')[0]
}

// ─── MONEDA ─────────────────────────────────────────────────

/**
 * Formatear un monto como moneda.
 * @param {number} amount 
 * @param {string} currency - Código ISO 4217 (USD, COP, EUR...)
 * @param {string} locale   - Locale (default: 'es-CO')
 * @returns {string} Ej: "$ 12.000" | "USD 12.00"
 */
export function formatCurrency(amount, currency = 'USD', locale = 'es-CO') {
  if (typeof amount !== 'number') return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Convertir precio de USD a moneda local usando tasa de cambio.
 * @param {number} usdPrice
 * @param {number} rate - Tasa de conversión
 * @returns {string} Monto convertido formateado
 */
export function convertPrice(usdPrice, rate) {
  if (!usdPrice || !rate) return '0'
  const converted = usdPrice * rate
  return converted.toLocaleString('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

// ─── TEXTO ──────────────────────────────────────────────────

/**
 * Capitalizar primera letra de cada palabra.
 * @param {string} text 
 * @returns {string} "juan pablo" → "Juan Pablo"
 */
export function capitalize(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Truncar texto largo con elipsis.
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncate(text, maxLength = 80) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

/**
 * Obtener iniciales del nombre para avatares.
 * @param {string} name - Nombre completo
 * @returns {string} Ej: "Juan Pablo" → "JP"
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
}

/**
 * Formatear número de tarjeta de crédito en grupos de 4.
 * @param {string} cardNumber - Solo dígitos
 * @returns {string} "1234 5678 9012 3456"
 */
export function formatCardNumber(cardNumber) {
  if (!cardNumber) return 'XXXX XXXX XXXX XXXX'
  const cleaned = cardNumber.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(' ') : cleaned
}
