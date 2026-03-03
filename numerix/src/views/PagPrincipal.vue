<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SistemaSolar from '@/components/SistemaSolar.vue'

const router = useRouter()
const route = useRoute()

const user = computed(() => {
  const stored = localStorage.getItem('user')
  const alignment = localStorage.getItem('alignmentProfile')
  const userData = stored ? JSON.parse(stored) : null
  const alignmentData = alignment ? JSON.parse(alignment) : null
  
  return {
    nombre: alignmentData?.fullName || userData?.nombre || userData?.name || 'VIAJERO ASTRAL',
    role: userData?.role || 'BUSCADOR CÓSMICO'
  }
})

const menuItems = ref([
  { icon: '🪄', label: 'INICIO', route: '/home' },
  { icon: '✨', label: 'LECTURAS', route: '/lecturas' },
  { icon: '🌍', label: 'COMUNIDAD' },
  { icon: '✨', label: 'ALINEACIÓN', route: '/alineacion' },
  { icon: '🎯', label: 'REVELACIÓN', route: '/revelacion' },
  { icon: '⚙️', label: 'CONFIGURACIÓN' },
])

// Update active state based on current route
watch(() => route.path, (newPath) => {
  menuItems.value.forEach(item => {
    item.active = item.route === newPath
  })
}, { immediate: true })

// Alignment profile saved from Alineacion page
const alignmentProfile = computed(() => {
  const stored = localStorage.getItem('alignmentProfile')
  return stored ? JSON.parse(stored) : null
})

const astronomicalData = computed(() => [
  {
    label: 'CAMINO CELESTIAL',
    value: alignmentProfile.value?.path === 'lunar' ? 'CAMINO_LUNAR' : 'CAMINO_SOLAR',
    icon: alignmentProfile.value?.path === 'lunar' ? '🌙' : '☀️'
  },
  {
    label: 'DENSIDAD DEL AURA',
    value: (alignmentProfile.value?.auraDensity || 'FLUIDA').toUpperCase(),
    icon: { eterea: '☁️', fluida: '🌊', cristalina: '💎', nebulosa: '🌫️' }[alignmentProfile.value?.auraDensity] || '✨'
  },
  {
    label: 'FECHA DE NACIMIENTO',
    value: alignmentProfile.value?.birthDate || 'NO_REGISTRADA',
    icon: '📅'
  },
])

// --- Random data pools ---
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const vibracionPool = [
  { desc: 'Intensidad vibratoria al 92%. El campo áurico se expande hacia frecuencias de creación pura. Momento ideal para iniciar proyectos de alto impacto.', detail: 'Tu número vibracional maestro resuena en 33 Hz de la escala cósmica. La energía de Marte potencia tu voluntad en las próximas 72 horas. Canaliza esta fuerza hacia metas que trasciendan lo cotidiano. El universo amplifica todo lo que emitas hoy.' },
  { desc: 'Vibración en 78%. El sol transita por tu casa de la creatividad. Las sincronías aumentan: presta atención a las señales numéricas del día.', detail: 'La resonancia de Schumann coincide con tu frecuencia natal, creando una ventana de manifestación excepcional. Números guía del día: 11, 22, 7. Colores que amplifican: violeta y dorado. Actividad recomendada: escritura automática al amanecer.' },
  { desc: 'Campo vibracional elevado al 85%. Mercurio retrógrado finaliza su ciclo, liberando bloqueos mentales acumulados. Tu intuición está en máximos históricos.', detail: 'La escala vibracional indica una alineación entre tu chakra coronario y el campo magnético terrestre. Este fenómeno ocurre solo 3 veces por año. Úsalo para hacer peticiones al cosmos o tomar decisiones trascendentales.' },
]

const misionPool = [
  { desc: 'Camino de Vida 11: El Maestro Intuitivo. Tus receptores extrasensoriales operan al límite máximo del potencial humano.', detail: 'Tu misión de alma está vinculada a la enseñanza y la transmutación de energías densas en luz. El número 11 te conecta con el plano angelical. Las personas que conoces hoy no son casualidad: son almas con las que tienes contratos kármicos pendientes. Tu presencia sana aunque no lo notes.' },
  { desc: 'Número de Expresión 7: El Buscador de Verdad. Esta semana la energía lunar activa tu tercer ojo, amplificando la percepción más allá de lo visible.', detail: 'El 7 te confiere acceso a conocimiento akásico. Tus sueños de los últimos días contienen mensajes codificados: busca símbolos de agua, espirales o puertas. Tu misión en esta vida involucra revelar verdades ocultas a través del arte, la ciencia o la espiritualidad.' },
  { desc: 'Alma solar tipo Arquitecto Cósmico. Tu número de alma es el 22, el constructor del puente entre dimensiones.', detail: 'El 22 es el número más poderoso de todos los caminos de vida. Fuiste encarnado con la misión de materializar grandes visiones para el beneficio colectivo. Mercurio directo potencia tu capacidad de comunicar estos planos al mundo. El cosmos pide que confíes en tus ideas más audaces.' },
]

const compatPool = [
  { desc: 'Nodos lunares en armonía máxima. Nuevas conexiones de alto potencial vibran en tu campo en radio de 48 horas.', detail: 'Venus en trígono con tu Luna natal eleva los índices de resonancia social al 94%. Las almas con Número de Vida 3, 6 y 9 son tus complementos perfectos en este ciclo. Evita dinámicas con energías del número 4 en los próximos 7 días: generan fricciones kármicas sin resolución inmediata.' },
  { desc: 'Compatibilidad profesional en alza. Júpiter expande tu red de influencia hacia sectores de alto impacto colectivo.', detail: 'La configuración astral actual favorece alianzas con personas nacidas en meses de tierra (Tauro, Virgo, Capricornio). El nodo norte en tu casa 11 abre portales de colaboración creativa. Una persona con el mismo camino de vida que tú está por cruzar tu camino: reconócela por su energía familiar.' },
  { desc: 'Resonancia afectiva en 88%. La luna llena del ciclo activo amplifica la atracción entre almas de alta vibración.', detail: 'Tu campo electromagnético emite una firma de reconocimiento que activa memorias de vidas pasadas en quienes se acercan. Las relaciones formadas en los próximos 10 días tienen potencial de duración kármica. Coloca intención consciente en cada encuentro: el universo observa y registra.' },
]

const modules = ref([
  {
    title: 'VIBRACIÓN',
    icon: '☀️',
    ...pick(vibracionPool),
    action: 'VER_ÓRBITA',
    delay: '0s',
    id: 'vibracion'
  },
  {
    title: 'MISIÓN DE VIDA',
    icon: '🧠',
    ...pick(misionPool),
    action: 'ESCANEO_PROFUNDO',
    delay: '0.4s',
    id: 'mision'
  },
  {
    title: 'COMPATIBILIDAD',
    icon: '👥',
    ...pick(compatPool),
    action: 'VER_SINCRO',
    delay: '0.8s',
    id: 'compat'
  },
])

// --- Modal ---
const activeModal = ref(null)
function openModal(mod) { activeModal.value = mod }
function closeModal() { activeModal.value = null }

const auraLabels = {
  eterea:     { label: 'ETÉREA',     icon: '☁️' },
  fluida:     { label: 'FLUIDA',     icon: '🌊' },
  cristalina: { label: 'CRISTALINA', icon: '💎' },
  nebulosa:   { label: 'NEBULOSA',   icon: '🌫️' },
}

const pathLabels = {
  solar: { label: 'CAMINO SOLAR',  icon: '☀️' },
  lunar: { label: 'CAMINO LUNAR',  icon: '🌙' },
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/auth')
}

// --- Live cosmic clock ---
const now = ref(new Date())
let clockInterval = null
onMounted(() => { clockInterval = setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => clearInterval(clockInterval))

const clockTime = computed(() => {
  const h = String(now.value.getHours()).padStart(2, '0')
  const m = String(now.value.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
})

// Determine cosmic label from hour
const zenithLabel = computed(() => {
  const h = now.value.getHours()
  if (h >= 5 && h < 12) return 'AMANECER'
  if (h >= 12 && h < 17) return 'CÉNIT'
  if (h >= 17 && h < 21) return 'OCASO'
  return 'NADIR'
})

// Astral items
const astralItems = [
  {
    icon: '👁',
    title: 'COCIENTE_DE_VISIÓN',
    desc: 'Mapea las trayectorias invisibles de tu progreso espiritual a través del análisis de nodos geométricos.',
    detail: 'El cociente de visión mide la distancia entre tu alma actual y tu potencial máximo expresado. En este ciclo tu índice es 8.3/10 — indica que estás cerca del umbral de una activación mayor. Los nodos geométricos revelan tres bloqueos inconscientes que, una vez liberados, acelerarán tu evolución exponencialmente.',
  },
  {
    icon: '⏳',
    title: 'FLUJO_TEMPORAL',
    desc: 'Analiza el karma histórico para predecir futuros puntos de resonancia y ventanas óptimas de manifestación.',
    detail: 'El análisis kármico de tus vidas anteriores indica una deuda de creatividad no expresada. La ventana temporal más potente del próximo ciclo ocurrirá durante la luna nueva del mes entrante. Las próximas 3 semanas son un período de siembra: cada intención plantada ahora germinará con fuerza multiplicada.',
  },
]
const activeAstral = ref(null)
</script>

<template>
  <div class="dashboard-layout">
    <!-- Sistema solar 3D en canvas -->
    <SistemaSolar />

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-inner">
            <span class="logo-spark">✨</span>
          </div>
        </div>
        <h1 class="sidebar-brand">ASTRA</h1>
        <p class="sidebar-tagline">NODO CELESTIAL</p>
      </div>

      <nav class="sidebar-nav">
        <div 
          v-for="item in menuItems" 
          :key="item.label"
          :class="['nav-item', { active: item.active }]"
          @click="item.route ? router.push(item.route) : null"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="premium-card">
          <p class="premium-title">ACCESO INFINITO</p>
          <p class="premium-desc">Desbloquea el mapa cósmico y los senderos estelares de 2024.</p>
          <button class="btn-premium">SUBIR AL NIVEL PREMIUM</button>
        </div>

        <div class="user-profile" @click="logout">
          <div class="user-avatar">
            <img :src="`https://ui-avatars.com/api/?name=${user?.nombre || 'User'}&background=fff&color=0f0c29`" alt="User" />
            <div class="status-indicator"></div>
          </div>
          <div class="user-info">
            <p class="user-name">{{ user?.nombre }}</p>
            <p class="user-role">{{ user?.role }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <!-- HEADER -->
      <header class="top-header">
        <div class="astro-data">
          <div v-for="data in astronomicalData" :key="data.label" class="astro-item">
            <span class="astro-icon">{{ data.icon }}</span>
            <div class="astro-text">
              <span class="astro-label">{{ data.label }}</span>
              <span class="astro-value">{{ data.value }}</span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-notification">
            <span class="notif-icon">🔔</span>
            <div class="notif-badge"></div>
          </button>
        </div>
      </header>

      <!-- DASHBOARD BODY -->
      <div class="dashboard-body">
        <div class="welcome-section">
          <h2 class="welcome-title">SALUDOS, <span class="highlight">{{ user?.nombre?.split(' ')[0] || 'VIAJERO' }}</span></h2>
          <div class="title-divider">
            <span class="divider-line"></span>
            <p class="welcome-subtitle">Las constelaciones se alinean para tu expansión creativa hoy.</p>
            <span class="divider-line"></span>
          </div>
        </div>

        <!-- FEATURED CARD -->
        <div class="featured-card">
          <div class="card-glow"></div>
          <div class="card-content">
            <span class="card-tag">ILUMINACIÓN DORADA</span>
            <h3 class="card-title">MAPEA LA CONSTELACIÓN COMPLETA DE TU DESTINO</h3>
            <p class="card-desc">
              Desbloquea las cartas de retorno solar avanzadas y los ciclos planetarios que definen tu evolución personal para la próxima década.
            </p>
            <button class="btn-revelar">
              REVELAR DESTINO <span class="btn-icon">🧭</span>
            </button>
          </div>
          <div class="card-visual">
            <div class="galaxy-viz"></div>
          </div>
        </div>

        <!-- MODULES -->
        <div class="modules-section">
          <h4 class="section-title">▲ MÓDULOS CÓSMICOS</h4>
          <div class="modules-grid">
            <div
              v-for="mod in modules"
              :key="mod.title"
              class="module-card"
              :style="{ animationDelay: mod.delay }"
            >
              <div class="module-icon-container">
                <span class="module-icon">{{ mod.icon }}</span>
              </div>
              <h5 class="module-title">{{ mod.title }}</h5>
              <p class="module-desc">{{ mod.desc }}</p>
              <span class="module-action" @click="openModal(mod)">{{ mod.action }}</span>
            </div>
          </div>
        </div>

        <!-- GEOMETRÍA ASTRAL CARD -->
        <div class="geo-card">
          <div class="geo-left">
            <h3 class="geo-title"><span class="geo-bar"></span> GEOMETRÍA_ASTRAL</h3>
            <div class="geo-items">
              <div
                v-for="item in astralItems"
                :key="item.title"
                class="geo-item"
                @click="activeAstral = item"
              >
                <div class="geo-icon-ring">{{ item.icon }}</div>
                <div class="geo-item-body">
                  <p class="geo-item-title">{{ item.title }}</p>
                  <p class="geo-item-desc">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="geo-right">
            <div class="clock-outer">
              <div class="clock-ring-roman">
                <span class="roman r3">III</span>
                <span class="roman r7">VII</span>
                <span class="roman r9">IX</span>
              </div>
              <div class="clock-inner">
                <span class="clock-time">{{ clockTime }}</span>
                <span class="clock-label">{{ zenithLabel }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- COSMIC PROFILE CARD (from Alineacion) -->
        <div v-if="alignmentProfile" class="cosmic-profile-section">
          <h4 class="section-title">✨ PERFIL CÓSMICO</h4>
          <div class="cosmic-profile-card">
            <div class="profile-grid">
              <div class="profile-item">
                <span class="profile-label">NOMBRE</span>
                <span class="profile-value">{{ alignmentProfile.fullName }}</span>
              </div>
              <div class="profile-item">
                <span class="profile-label">FECHA DE NACIMIENTO</span>
                <span class="profile-value">{{ alignmentProfile.birthDate }}</span>
              </div>
              <div v-if="alignmentProfile.birthTime" class="profile-item">
                <span class="profile-label">HORA DE NACIMIENTO</span>
                <span class="profile-value">{{ alignmentProfile.birthTime }}</span>
              </div>
              <div class="profile-item">
                <span class="profile-label">CAMINO CELESTIAL</span>
                <span class="profile-value path-badge">
                  {{ pathLabels[alignmentProfile.path]?.icon }}
                  {{ pathLabels[alignmentProfile.path]?.label }}
                </span>
              </div>
              <div class="profile-item">
                <span class="profile-label">DENSIDAD DEL AURA</span>
                <span class="profile-value aura-badge">
                  {{ auraLabels[alignmentProfile.auraDensity]?.icon }}
                  {{ auraLabels[alignmentProfile.auraDensity]?.label }}
                </span>
              </div>
            </div>
            <div v-if="alignmentProfile.cosmicVision" class="vision-block">
              <span class="profile-label">VISIÓN CÓSMICA</span>
              <p class="vision-text">{{ alignmentProfile.cosmicVision }}</p>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- MODULE MODAL OVERLAY -->
    <Transition name="modal">
      <div v-if="activeModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-panel">
          <div class="modal-header">
            <div class="modal-icon-ring">
              <span class="modal-icon">{{ activeModal.icon }}</span>
            </div>
            <div>
              <p class="modal-tag">MÓDULO CÓSMICO</p>
              <h2 class="modal-title">{{ activeModal.title }}</h2>
            </div>
          </div>
          <div class="modal-divider"></div>
          <p class="modal-body">{{ activeModal.detail }}</p>
          <div class="modal-divider"></div>
          <div class="modal-footer">
            <span class="modal-action-label">{{ activeModal.action }}</span>
            <button class="modal-close-btn" @click="closeModal">
              ✕ CERRAR
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

.dashboard-layout {
  display: flex;
  height: 100vh;
  background: transparent;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  overflow: hidden;
  position: relative;
}

/* SIDEBAR */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: rgba(15, 12, 41, 0.15);
  border-right: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  padding: 2.5rem 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

.sidebar-header {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-container {
  width: 70px;
  height: 70px;
  background: radial-gradient(circle, #c9a96e 0%, #a07840 100%);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  box-shadow: 0 0 30px rgba(201, 169, 110, 0.4);
}

.logo-inner {
  width: 100%;
  height: 100%;
  background: #0f0c29;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-spark {
  font-size: 1.8rem;
  color: #c9a96e;
}

.sidebar-brand {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 6px;
  margin: 0;
  color: #fff;
}

.sidebar-tagline {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-top: 0.4rem;
}

.sidebar-nav {
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.5rem;
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0.5rem;
}

.nav-item.active {
  background: rgba(201, 169, 110, 0.05);
  color: #c9a96e;
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-label {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1.5px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  transform: translateX(5px);
}

.sidebar-footer {
  margin-top: auto;
  padding: 0 1.5rem;
}

.premium-card {
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.1) 0%, rgba(201, 169, 110, 0.02) 100%);
  border: 1px solid rgba(201, 169, 110, 0.1);
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
}

.premium-title {
  color: #c9a96e;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin: 0 0 0.5rem;
}

.premium-desc {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
  margin-bottom: 1.2rem;
}

.btn-premium {
  width: 100%;
  padding: 0.75rem;
  background: #c9a96e;
  border: none;
  border-radius: 50px;
  color: #0f0c29;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.user-avatar {
  position: relative;
  width: 45px;
  height: 45px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(201, 169, 110, 0.3);
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #4ade80;
  border: 2px solid #0f0c29;
  border-radius: 50%;
}

.user-info p {
  margin: 0;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.user-role {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  margin-left: 280px;
}

.top-header {
  position: fixed;
  top: 0;
  right: 0;
  width: calc(100% - 280px);
  z-index: 50;
  padding: 1.5rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(15, 12, 41, 0.2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-sizing: border-box;
}

.astro-data {
  display: flex;
  gap: 3rem;
}

.astro-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.astro-icon {
  font-size: 1.2rem;
  color: #c9a96e;
}

.astro-label {
  display: block;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
}

.astro-value {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: #fff;
}

.btn-notification {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notif-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: #c9a96e;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(201, 169, 110, 0.8);
}

/* BODY */
.dashboard-body {
  padding: 10rem 4rem 3rem;
  max-width: 1200px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 4rem;
}

.welcome-title {
  font-size: 2.8rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: 2px;
}

.welcome-title .highlight {
  color: #c9a96e;
  font-weight: 800;
}

.title-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.divider-line {
  height: 1px;
  width: 100px;
  background: linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.3), transparent);
}

.welcome-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  margin: 0;
}

/* FEATURED CARD */
.featured-card {
  position: relative;
  background: linear-gradient(135deg, rgba(20, 30, 80, 0.6) 0%, rgba(10, 15, 30, 0.8) 100%);
  border-radius: 40px;
  padding: 4rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  margin-bottom: 5rem;
}

.card-glow {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 80%;
  height: 150%;
  background: radial-gradient(circle, rgba(65, 105, 225, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

.card-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.card-tag {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: rgba(201, 169, 110, 0.1);
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: 50px;
  color: #c9a96e;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 2rem;
}

.card-title {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1.5rem;
  max-width: 600px;
}

.card-desc {
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
  font-size: 1rem;
  margin-bottom: 2.5rem;
  max-width: 500px;
}

.btn-revelar {
  padding: 1.2rem 2.5rem;
  background: #c9a96e;
  border: none;
  border-radius: 50px;
  color: #0f0c29;
  font-weight: 800;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
}

.btn-revelar:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(201, 169, 110, 0.3);
}

.card-visual {
  position: absolute;
  right: -5%;
  top: 0;
  bottom: 0;
  width: 45%;
  background: url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022&auto=format&fit=crop') center/cover;
  opacity: 0.4;
  mask-image: linear-gradient(to left, black, transparent);
}

/* MODULES */
.modules-section {
  padding-bottom: 4rem;
}

.section-title {
  color: #c9a96e;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 3px;
  margin-bottom: 3rem;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@keyframes cosmicFloat {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-14px); }
  100% { transform: translateY(0px); }
}

.module-card {
  background: rgba(10, 8, 30, 0.6);
  border: 1px solid rgba(201, 169, 110, 0.35);
  border-radius: 50% / 40%;
  padding: 3.5rem 2rem 2.5rem;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: cosmicFloat 4s ease-in-out infinite;
  transition: border-color 0.3s, box-shadow 0.3s;
  min-height: 340px;
  justify-content: center;
}

.module-card:hover {
  border-color: rgba(201, 169, 110, 0.7);
  box-shadow: 0 0 40px rgba(201, 169, 110, 0.15);
}

.module-icon-container {
  width: 64px;
  height: 64px;
  margin: 0 auto;
  background: rgba(201, 169, 110, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(201, 169, 110, 0.3);
}

.module-icon {
  font-size: 1.6rem;
}

.module-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  color: #fff;
}

.module-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.6;
  margin: 0;
  max-width: 200px;
}

.module-action {
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: rgba(201, 169, 110, 0.6);
  text-transform: uppercase;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.module-action:hover {
  color: #c9a96e;
}

/* ── GEOMETRÍA ASTRAL ── */
.geo-card {
  display: flex;
  gap: 3rem;
  background: rgba(10, 8, 30, 0.55);
  border: 1px solid rgba(201, 169, 110, 0.18);
  border-radius: 32px;
  padding: 3rem;
  margin-bottom: 4rem;
  overflow: hidden;
  position: relative;
}

.geo-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.geo-title {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.geo-bar {
  display: inline-block;
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #c9a96e, #a07840);
  border-radius: 4px;
}

.geo-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.geo-item {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1.2rem 1.5rem;
  border-radius: 16px;
  background: rgba(201, 169, 110, 0.03);
  border: 1px solid rgba(201, 169, 110, 0.08);
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s, transform 0.3s;
}

.geo-item:hover {
  background: rgba(201, 169, 110, 0.07);
  border-color: rgba(201, 169, 110, 0.25);
  transform: translateX(6px);
}

.geo-icon-ring {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  background: rgba(201, 169, 110, 0.08);
  border: 1px solid rgba(201, 169, 110, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.geo-item-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.geo-item-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #c9a96e;
  margin: 0;
}

.geo-item-desc {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
  margin: 0;
}

/* ── RELOJ CÓSMICO ── */
.geo-right {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
}

.clock-outer {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 1px solid rgba(201, 169, 110, 0.25);
  background: radial-gradient(circle, rgba(201, 169, 110, 0.06) 0%, transparent 70%);
  box-shadow: 0 0 40px rgba(201, 169, 110, 0.08), inset 0 0 30px rgba(201, 169, 110, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.clock-ring-roman {
  position: absolute;
  inset: 0;
}

.roman {
  position: absolute;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: rgba(201, 169, 110, 0.45);
}

.r3  { top: 50%; right: 10px; transform: translateY(-50%); }
.r7  { bottom: 18px; left: 50%; transform: translateX(-50%); }
.r9  { top: 50%; left: 10px;  transform: translateY(-50%); }

.clock-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  z-index: 1;
}

.clock-time {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 3px;
  color: #fff;
  text-shadow: 0 0 20px rgba(201, 169, 110, 0.4);
}

.clock-label {
  font-size: 0.55rem;
  letter-spacing: 4px;
  color: rgba(201, 169, 110, 0.6);
  text-transform: uppercase;
}

/* RESPONSIVENESS */
@media (max-width: 1200px) {
  .astro-data { display: none; }
  .modules-grid { grid-template-columns: 1fr; }
  .featured-card { flex-direction: column; padding: 2.5rem; }
  .card-visual { position: relative; width: 100%; height: 200px; margin-top: 2rem; }
}

@media (max-width: 768px) {
  .sidebar { position: fixed; transform: translateX(-100%); transition: 0.3s; }
  .main-content { padding-left: 0; }
  .top-header, .dashboard-body { padding: 1.5rem; }
}

/* ── MODULE MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(5, 4, 18, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-panel {
  background: rgba(15, 12, 41, 0.85);
  border: 1px solid rgba(201, 169, 110, 0.25);
  border-radius: 28px;
  padding: 3rem 3.5rem;
  max-width: 560px;
  width: 100%;
  box-shadow: 0 0 80px rgba(201, 169, 110, 0.08);
  backdrop-filter: blur(20px);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.modal-icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(201, 169, 110, 0.08);
  border: 1px solid rgba(201, 169, 110, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
}

.modal-tag {
  font-size: 0.6rem;
  letter-spacing: 3px;
  color: #c9a96e;
  margin: 0 0 0.4rem;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  color: #fff;
}

.modal-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 1.5rem 0;
}

.modal-body {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-action-label {
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: rgba(201, 169, 110, 0.5);
}

.modal-close-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  font-size: 0.75rem;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.25s;
}

.modal-close-btn:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: #fff;
}

/* Transition */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.94);
}
/* COSMIC PROFILE */
.cosmic-profile-section {
  margin-top: 3rem;
}

.cosmic-profile-card {
  background: rgba(201, 169, 110, 0.04);
  border: 1px solid rgba(201, 169, 110, 0.15);
  border-radius: 20px;
  padding: 2rem 2.5rem;
  backdrop-filter: blur(10px);
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.profile-label {
  font-size: 0.6rem;
  letter-spacing: 2px;
  color: rgba(201, 169, 110, 0.6);
  text-transform: uppercase;
}

.profile-value {
  font-size: 0.95rem;
  color: #fff;
  font-weight: 300;
}

.path-badge, .aura-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.vision-block {
  border-top: 1px solid rgba(201, 169, 110, 0.1);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.vision-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin: 0;
  font-style: italic;
}

/* ══════════════════════════════════════
   🌌 SISTEMA SOLAR — FONDO ANIMADO
══════════════════════════════════════ */
.solar-system-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Perspectiva inclinada: vista desde arriba, sistema "acostado" */
  perspective: 900px;
  opacity: 0.65;
}

/* El plano del sistema solar inclinado */
.solar-system-bg > * {
  transform-style: preserve-3d;
}

/* Wrapper interno que rota el plano */
.solar-system-bg .solar-plane {
  position: relative;
  width: 700px;
  height: 700px;
  transform: rotateX(65deg);
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

/* SOL */
.solar-sun {
  position: absolute;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sun-core {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: radial-gradient(circle, #fffbe6 0%, #ffe566 30%, #ffaa00 65%, #ff6600 100%);
  box-shadow:
    0 0 30px #ffaa00,
    0 0 70px #ff880070,
    0 0 120px #ff440040;
  animation: sunPulse 4s ease-in-out infinite;
  z-index: 2;
}

.sun-corona {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,180,0,0.2) 0%, transparent 70%);
  animation: coronaPulse 3s ease-in-out infinite alternate;
}

.sun-flare {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 200, 0, 0.15);
  animation: flareExpand 4s ease-in-out infinite;
}
.sun-flare.f1 { width: 130px; height: 130px; animation-delay: 0s; }
.sun-flare.f2 { width: 180px; height: 180px; animation-delay: 1.3s; }
.sun-flare.f3 { width: 230px; height: 230px; animation-delay: 2.6s; }

@keyframes sunPulse {
  0%, 100% { box-shadow: 0 0 30px #ffaa00, 0 0 70px #ff880070, 0 0 120px #ff440040; }
  50%       { box-shadow: 0 0 50px #ffcc00, 0 0 100px #ff880090, 0 0 180px #ff440060; }
}
@keyframes coronaPulse {
  from { transform: scale(1);    opacity: 0.6; }
  to   { transform: scale(1.25); opacity: 0.15; }
}
@keyframes flareExpand {
  0%, 100% { transform: scale(1);   opacity: 0.15; }
  50%       { transform: scale(1.1); opacity: 0.05; }
}

/* ÓRBITAS */
.solar-orbit {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  animation: orbitSpin linear infinite;
  transform-origin: center center;
}

.orbit-1 { width: 110px;  height: 110px;  animation-duration: 4s; }
.orbit-2 { width: 175px;  height: 175px;  animation-duration: 10s; }
.orbit-3 { width: 250px;  height: 250px;  animation-duration: 16s; }
.orbit-4 { width: 320px;  height: 320px;  animation-duration: 30s; }
.orbit-5 { width: 430px;  height: 430px;  animation-duration: 55s; }
.orbit-6 { width: 540px;  height: 540px;  animation-duration: 90s; }
.orbit-7 { width: 640px;  height: 640px;  animation-duration: 140s; }

@keyframes orbitSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* PLANETAS — base */
.solar-planet {
  position: relative;
  border-radius: 50%;
  /* Contra-rotación para que el planeta no gire sobre sí mismo */
  animation: counterSpin linear infinite;
}

/* Heredar la misma duración desde el padre */
.orbit-1 .solar-planet { animation-duration: 4s; }
.orbit-2 .solar-planet { animation-duration: 10s; }
.orbit-3 .solar-planet { animation-duration: 16s; }
.orbit-4 .solar-planet { animation-duration: 30s; }
.orbit-5 .solar-planet { animation-duration: 55s; }
.orbit-6 .solar-planet { animation-duration: 90s; }
.orbit-7 .solar-planet { animation-duration: 140s; }

@keyframes counterSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}

/* Mercurio */
.planet-mercury {
  width: 9px; height: 9px;
  background: radial-gradient(circle, #d0cec5, #8c8680);
  margin-top: 2px;
  box-shadow: 0 0 6px rgba(200,190,180,0.6);
}

/* Venus */
.planet-venus {
  width: 14px; height: 14px;
  background: radial-gradient(circle, #f5deb3, #e8a83a);
  margin-top: 2px;
  box-shadow: 0 0 10px rgba(245,210,100,0.6);
}

/* Tierra */
.planet-earth {
  width: 16px; height: 16px;
  background: radial-gradient(circle at 35% 35%, #6ec6ff 0%, #2a8cff 30%, #1a5c8a 60%, #0e3a54 100%);
  margin-top: 2px;
  box-shadow: 0 0 12px rgba(100,180,255,0.7);
}

/* Luna de la Tierra */
.planet-moon {
  position: absolute;
  width: 5px; height: 5px;
  background: #d0d0d0;
  border-radius: 50%;
  top: -8px; left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 4px rgba(210,210,210,0.5);
}

/* Marte */
.planet-mars {
  width: 13px; height: 13px;
  background: radial-gradient(circle, #ff7c55, #c1440e);
  margin-top: 2px;
  box-shadow: 0 0 10px rgba(255,80,30,0.6);
}

/* Júpiter */
.planet-jupiter {
  width: 36px; height: 36px;
  background: repeating-linear-gradient(
    160deg,
    #c9a97a 0px, #c9a97a 5px,
    #a07040 5px, #a07040 8px,
    #e0c89a 8px, #e0c89a 12px,
    #c9a97a 12px, #c9a97a 16px
  );
  border-radius: 50%;
  margin-top: 2px;
  box-shadow: 0 0 20px rgba(200,160,80,0.5);
}

/* Saturno */
.planet-saturn {
  width: 28px; height: 28px;
  background: radial-gradient(circle, #f2dcaf, #c9a96e, #9a7244);
  margin-top: 2px;
  box-shadow: 0 0 16px rgba(200,170,100,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.saturn-ring {
  position: absolute;
  width: 54px; height: 12px;
  border-radius: 50%;
  border: 3px solid rgba(201,169,110,0.55);
  box-shadow: 0 0 8px rgba(201,169,110,0.3);
  transform: rotateX(70deg);
  pointer-events: none;
}

/* Urano */
.planet-uranus {
  width: 20px; height: 20px;
  background: radial-gradient(circle, #9ff0f0, #4dd0e1, #00838f);
  margin-top: 2px;
  box-shadow: 0 0 14px rgba(80,220,220,0.6);
}

/* Cinturón de asteroides */
.asteroid-belt {
  position: absolute;
  width: 375px; height: 375px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    rgba(200,190,180,0.04) 5%,
    rgba(200,190,180,0.10) 10%,
    rgba(200,190,180,0.04) 15%,
    transparent 20%,
    rgba(200,190,180,0.07) 30%,
    transparent 35%,
    rgba(200,190,180,0.05) 50%,
    transparent 55%,
    rgba(200,190,180,0.09) 70%,
    transparent 75%,
    rgba(200,190,180,0.04) 90%,
    transparent 100%
  );
  border: 1px dashed rgba(200,190,180,0.08);
  animation: orbitSpin 200s linear infinite;
}
</style>
