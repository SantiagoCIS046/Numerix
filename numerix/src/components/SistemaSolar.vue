<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animId = null
let lastTime = 0
let elapsed = 0

// ── Configuración de vista 3D ──────────────────────────────
const TILT  = Math.PI * 0.30   // ~54° inclinación del plano orbital
const FOV   = 700               // campo visual (perspectiva)
const DEPTH = 400               // distancia del observador al sol

// ── Definición de planetas ────────────────────────────────
const PLANETS = [
  {
    name: 'Mercurio', r: 70, speed: 4.1, size: 4,
    light: '#e8e0d0', mid: '#a09585', dark: '#3a3028',
  },
  {
    name: 'Venus', r: 115, speed: 1.62, size: 7,
    light: '#faf0c0', mid: '#e8c870', dark: '#7a5c10',
  },
  {
    name: 'Tierra', r: 160, speed: 1.0, size: 8,
    light: '#90d8f8', mid: '#2a80d8', dark: '#082844',
    moon: true,
  },
  {
    name: 'Marte', r: 215, speed: 0.53, size: 6,
    light: '#f08060', mid: '#c84010', dark: '#501800',
  },
  {
    name: 'Júpiter', r: 310, speed: 0.084, size: 24,
    light: '#e8d4a8', mid: '#c09060', dark: '#604020',
    bands: true,
  },
  {
    name: 'Saturno', r: 410, speed: 0.034, size: 19,
    light: '#f8ecc0', mid: '#d4aa60', dark: '#7a5820',
    rings: true,
  },
  {
    name: 'Urano', r: 500, speed: 0.012, size: 13,
    light: '#b0f4f4', mid: '#50c8c8', dark: '#106060',
  },
]

// ── Estrellas precalculadas ──────────────────────────────
const STARS = Array.from({ length: 250 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.4 + 0.3,
  alpha: Math.random() * 0.6 + 0.4,
  twinkle: Math.random() * Math.PI * 2,
  twinkleSpeed: 0.5 + Math.random() * 1.5,
}))

// ── Cinturón de asteroides ───────────────────────────────
const ASTEROIDS = Array.from({ length: 180 }, () => {
  const angle = Math.random() * Math.PI * 2
  const r = 255 + Math.random() * 40
  return { angle, r, size: Math.random() * 1.2 + 0.3, alpha: 0.3 + Math.random() * 0.5 }
})

// ── Proyección 3D → 2D ──────────────────────────────────
function project(x, y, z, cx, cy) {
  const scale = FOV / (FOV + z + DEPTH)
  return {
    sx: cx + x * scale,
    sy: cy + y * scale,
    scale,
    z,
  }
}

// ── Posición de un planeta en el tiempo ─────────────────
function getPlanetData(planet, t) {
  const angle  = t * planet.speed * 0.0008
  const xFlat  = planet.r * Math.cos(angle)
  const zFlat  = planet.r * Math.sin(angle)
  const y3d    = -zFlat * Math.sin(TILT)
  const z3d    =  zFlat * Math.cos(TILT)
  return { xFlat, y3d, z3d, angle }
}

// ── Dibujar esfera con iluminación ─────────────────────
function drawSphere(ctx, px, py, r, planet) {
  if (r < 0.5) return
  const offsetX = -r * 0.35
  const offsetY = -r * 0.35
  const grd = ctx.createRadialGradient(
    px + offsetX, py + offsetY, r * 0.05,
    px, py, r
  )
  grd.addColorStop(0,   planet.light)
  grd.addColorStop(0.45, planet.mid)
  grd.addColorStop(1,   planet.dark)

  ctx.beginPath()
  ctx.arc(px, py, r, 0, Math.PI * 2)
  ctx.fillStyle = grd
  ctx.fill()

  // Brillo especular
  const spec = ctx.createRadialGradient(
    px + offsetX * 0.8, py + offsetY * 0.8, 0,
    px + offsetX * 0.8, py + offsetY * 0.8, r * 0.5
  )
  spec.addColorStop(0, 'rgba(255,255,255,0.45)')
  spec.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(px, py, r, 0, Math.PI * 2)
  ctx.fillStyle = spec
  ctx.fill()

  // Contorno oscuro
  ctx.beginPath()
  ctx.arc(px, py, r, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'
  ctx.lineWidth = 0.5
  ctx.stroke()
}

// ── Dibujar bandas de Júpiter ────────────────────────
function drawBands(ctx, px, py, r) {
  const bandColors = [
    'rgba(160,100,50,0.25)', 'rgba(220,180,120,0.2)',
    'rgba(140,80,40,0.28)',  'rgba(200,160,90,0.18)',
  ]
  bandColors.forEach((color, i) => {
    const yOff = (i - 1.5) * r * 0.38
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(px, py, r, r * 0.9, 0, 0, Math.PI * 2)
    ctx.clip()
    ctx.beginPath()
    ctx.ellipse(px, py + yOff, r, r * 0.11, 0, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.restore()
  })
}

// ── Dibujar anillos de Saturno ──────────────────────
function drawRings(ctx, px, py, r, scale) {
  const rx  = r * 2.5
  const ry  = r * 0.7
  const ringColors = [
    { r: rx * 0.95, w: rx * 0.12, color: 'rgba(210,170,90,0.65)' },
    { r: rx * 0.78, w: rx * 0.18, color: 'rgba(180,140,70,0.5)' },
    { r: rx * 0.60, w: rx * 0.10, color: 'rgba(220,190,110,0.35)' },
  ]
  // Parte trasera (z negativo)
  ringColors.forEach(({ r: rr, w, color }) => {
    ctx.beginPath()
    ctx.ellipse(px, py, rr, ry * (rr / rx), 0, Math.PI, Math.PI * 2)
    ctx.strokeStyle = color
    ctx.lineWidth = w * scale
    ctx.stroke()
  })
}

function drawRingsFront(ctx, px, py, r, scale) {
  const rx  = r * 2.5
  const ry  = r * 0.7
  const ringColors = [
    { r: rx * 0.95, w: rx * 0.12, color: 'rgba(210,170,90,0.65)' },
    { r: rx * 0.78, w: rx * 0.18, color: 'rgba(180,140,70,0.5)' },
    { r: rx * 0.60, w: rx * 0.10, color: 'rgba(220,190,110,0.35)' },
  ]
  // Parte delantera
  ringColors.forEach(({ r: rr, w, color }) => {
    ctx.beginPath()
    ctx.ellipse(px, py, rr, ry * (rr / rx), 0, 0, Math.PI)
    ctx.strokeStyle = color
    ctx.lineWidth = w * scale
    ctx.stroke()
  })
}

// ── Órbita (puntos proyectados) ──────────────────────
function drawOrbit(ctx, planet, cx, cy) {
  const steps = 120
  ctx.beginPath()
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2
    const xFlat = planet.r * Math.cos(angle)
    const zFlat = planet.r * Math.sin(angle)
    const y3d   = -zFlat * Math.sin(TILT)
    const z3d   =  zFlat * Math.cos(TILT)
    const { sx, sy } = project(xFlat, y3d, z3d, cx, cy)
    if (i === 0) ctx.moveTo(sx, sy)
    else ctx.lineTo(sx, sy)
  }
  ctx.closePath()
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 0.8
  ctx.stroke()
}

// ── Loop principal ───────────────────────────────────
function draw(ts) {
  const dt  = Math.min(ts - lastTime, 100)
  lastTime  = ts
  elapsed  += dt

  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W   = canvas.width
  const H   = canvas.height
  const cx  = W * 0.52
  const cy  = H * 0.54

  ctx.clearRect(0, 0, W, H)

  // ─ Fondo ────────────────────────────────────────────
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H))
  bg.addColorStop(0,   '#0c0820')
  bg.addColorStop(0.5, '#07040f')
  bg.addColorStop(1,   '#020108')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // ─ Estrellas ─────────────────────────────────────────
  STARS.forEach(s => {
    const flicker = 0.5 + 0.5 * Math.sin(elapsed * 0.001 * s.twinkleSpeed + s.twinkle)
    ctx.beginPath()
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${(s.alpha * 0.6 + flicker * 0.4).toFixed(2)})`
    ctx.fill()
  })

  // ─ Órbitas ───────────────────────────────────────────
  PLANETS.forEach(p => drawOrbit(ctx, p, cx, cy))

  // ─ Cinturón de asteroides ─────────────────────────────
  ASTEROIDS.forEach(a => {
    const angle = a.angle + elapsed * 0.00005
    const xFlat = a.r * Math.cos(angle)
    const zFlat = a.r * Math.sin(angle)
    const y3d   = -zFlat * Math.sin(TILT)
    const z3d   =  zFlat * Math.cos(TILT)
    const { sx, sy, scale } = project(xFlat, y3d, z3d, cx, cy)
    ctx.beginPath()
    ctx.arc(sx, sy, a.size * scale, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(160,150,140,${a.alpha})`
    ctx.fill()
  })

  // ─ Sol ───────────────────────────────────────────────
  const pulse = 1 + 0.04 * Math.sin(elapsed * 0.002)
  // Halo exterior
  for (let i = 3; i > 0; i--) {
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 42 * i * pulse)
    halo.addColorStop(0, `rgba(255,180,0,${0.06 / i})`)
    halo.addColorStop(1, 'rgba(255,100,0,0)')
    ctx.beginPath()
    ctx.arc(cx, cy, 42 * i * pulse, 0, Math.PI * 2)
    ctx.fillStyle = halo
    ctx.fill()
  }
  // Núcleo del sol
  const sunGrd = ctx.createRadialGradient(cx - 10, cy - 10, 2, cx, cy, 30 * pulse)
  sunGrd.addColorStop(0, '#ffffff')
  sunGrd.addColorStop(0.15, '#fff7a0')
  sunGrd.addColorStop(0.5, '#ffcc00')
  sunGrd.addColorStop(0.8, '#ff8800')
  sunGrd.addColorStop(1, '#ff4400')
  ctx.beginPath()
  ctx.arc(cx, cy, 30 * pulse, 0, Math.PI * 2)
  ctx.fillStyle = sunGrd
  ctx.fill()

  // ─ Planetas (ordenados por profundidad) ─────────────
  const rendered = PLANETS.map(planet => {
    const { xFlat, y3d, z3d } = getPlanetData(planet, elapsed)
    const proj = project(xFlat, y3d, z3d, cx, cy)
    return { planet, proj, xFlat, y3d, z3d }
  })
  // De más lejano a más cercano
  rendered.sort((a, b) => b.proj.z - a.proj.z)

  rendered.forEach(({ planet, proj }) => {
    const { sx, sy, scale } = proj
    const r = planet.size * scale * 1.1

    // Anillos traseros de Saturno
    if (planet.rings) drawRings(ctx, sx, sy, r, scale)

    // Esfera
    drawSphere(ctx, sx, sy, r, planet)

    // Bandas de Júpiter
    if (planet.bands) drawBands(ctx, sx, sy, r)

    // Anillos delanteros de Saturno
    if (planet.rings) drawRingsFront(ctx, sx, sy, r, scale)

    // Luna de la Tierra
    if (planet.moon) {
      const moonAngle = elapsed * 0.005
      const moonDist  = r * 2.8
      const mx = sx + moonDist * Math.cos(moonAngle)
      const my = sy + moonDist * Math.sin(moonAngle) * 0.35
      const moonR = r * 0.28
      const moonGrd = ctx.createRadialGradient(
        mx - moonR * 0.3, my - moonR * 0.3, 0,
        mx, my, moonR
      )
      moonGrd.addColorStop(0, '#e8e4dc')
      moonGrd.addColorStop(0.6, '#b0aaA0')
      moonGrd.addColorStop(1, '#383430')
      ctx.beginPath()
      ctx.arc(mx, my, moonR, 0, Math.PI * 2)
      ctx.fillStyle = moonGrd
      ctx.fill()
    }

    // Etiqueta (opcional - pequeña)
    if (scale > 0.6) {
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, (scale - 0.6) * 3) * 0.45})`
      ctx.font = `${Math.round(9 * scale)}px Outfit, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText(planet.name, sx, sy + r + 12 * scale)
    }
  })

  animId = requestAnimationFrame(draw)
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width  = canvas.parentElement.offsetWidth
  canvas.height = canvas.parentElement.offsetHeight
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  animId = requestAnimationFrame(ts => {
    lastTime = ts
    draw(ts)
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvasRef" class="solar-canvas" aria-hidden="true"></canvas>
</template>

<style scoped>
.solar-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  display: block;
}
</style>
