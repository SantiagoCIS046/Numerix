/**
 * utils/helpers.js — Funciones auxiliares de dominio
 * 
 * Lógica de negocio reutilizable que no depende de Vue ni del DOM.
 * Incluye cálculos astrológicos, numerológicos y otros helpers.
 */

// ─── ASTROLOGÍA ─────────────────────────────────────────────

/**
 * Obtener el signo zodiacal a partir de una fecha de nacimiento.
 * @param {string|Date} dateStr 
 * @returns {string} Nombre del signo zodiacal
 */
export function getZodiacSign(dateStr) {
  if (!dateStr) return 'Desconocido'
  const date  = new Date(dateStr)
  const day   = date.getUTCDate()
  const month = date.getUTCMonth() + 1

  if ((month === 1  && day >= 20) || (month === 2  && day <= 18)) return 'Acuario'
  if ((month === 2  && day >= 19) || (month === 3  && day <= 20)) return 'Piscis'
  if ((month === 3  && day >= 21) || (month === 4  && day <= 19)) return 'Aries'
  if ((month === 4  && day >= 20) || (month === 5  && day <= 20)) return 'Tauro'
  if ((month === 5  && day >= 21) || (month === 6  && day <= 20)) return 'Géminis'
  if ((month === 6  && day >= 21) || (month === 7  && day <= 22)) return 'Cáncer'
  if ((month === 7  && day >= 23) || (month === 8  && day <= 22)) return 'Leo'
  if ((month === 8  && day >= 23) || (month === 9  && day <= 22)) return 'Virgo'
  if ((month === 9  && day >= 23) || (month === 10 && day <= 22)) return 'Libra'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpio'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitario'
  return 'Capricornio'
}

/**
 * Obtener el elemento asociado a un signo zodiacal.
 * @param {string} sign - Nombre del signo
 * @returns {{ name: string, icon: string }} 
 */
export function getZodiacElement(sign) {
  const elements = {
    Fuego: { signs: ['Aries', 'Leo', 'Sagitario'],       name: 'Fuego',  icon: '🔥' },
    Tierra: { signs: ['Tauro', 'Virgo', 'Capricornio'],   name: 'Tierra', icon: '🌿' },
    Aire:  { signs: ['Géminis', 'Libra', 'Acuario'],      name: 'Aire',   icon: '💨' },
    Agua:  { signs: ['Cáncer', 'Escorpio', 'Piscis'],     name: 'Agua',   icon: '💧' },
  }
  for (const el of Object.values(elements)) {
    if (el.signs.includes(sign)) return el
  }
  return { name: 'Éter', icon: '✨' }
}

// ─── NUMEROLOGÍA ─────────────────────────────────────────────

/**
 * Calcular el número de vida a partir de la fecha de nacimiento.
 * Suma todos los dígitos hasta obtener un número del 1 al 9
 * (o número maestro: 11, 22, 33).
 * @param {string} dateStr - Formato YYYY-MM-DD
 * @returns {number} Número de vida
 */
export function calcLifeNumber(dateStr) {
  if (!dateStr) return 0
  const digits = dateStr.replace(/\D/g, '').split('').map(Number)
  let sum = digits.reduce((a, b) => a + b, 0)

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0)
  }
  return sum
}

/**
 * Calcular el número de expresión a partir de un nombre.
 * Usa la tabla pitagórica de numerología.
 * @param {string} name - Nombre completo
 * @returns {number} Número de expresión
 */
export function calcExpressionNumber(name) {
  if (!name) return 0
  const table = {
    a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
    j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
    s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8,
  }
  const letters = name.toLowerCase().replace(/[^a-z]/g, '').split('')
  let sum = letters.reduce((acc, l) => acc + (table[l] || 0), 0)

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0)
  }
  return sum
}

// ─── AVATAR ─────────────────────────────────────────────────

/**
 * Generar URL del avatar con ui-avatars.com.
 * @param {string} name       - Nombre del usuario
 * @param {string} background - Color hexadecimal sin # (default: 6366f1)
 * @param {string} color      - Color del texto (default: fff)
 * @returns {string} URL del avatar
 */
export function avatarUrl(name = 'User', background = '6366f1', color = 'fff') {
  const encoded = encodeURIComponent(name)
  return `https://ui-avatars.com/api/?name=${encoded}&background=${background}&color=${color}`
}

// ─── MISCELÁNEA ─────────────────────────────────────────────

/**
 * Elegir un elemento aleatorio de un array.
 * @param {Array} arr
 * @returns {*} Elemento aleatorio
 */
export function pickRandom(arr) {
  if (!arr || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Generar un ID único corto (para listas, transacciones locales, etc.)
 * @returns {string} ID único
 */
export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)
}

/**
 * Esperar N milisegundos (útil para simular delays en dev).
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
