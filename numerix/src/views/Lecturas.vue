<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { lecturasService } from '../services/api.js'
import Galaxy from '../components/Galaxy.vue'

const router = useRouter()
const readings = ref([])
const loading = ref(true)
const error = ref(null)

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

const navLinks = [
  { label: 'Lectura Diaria', path: '/lecturas', active: true },
  { label: 'Carta Natal', path: '/carta-natal', active: false },
  { label: 'Compatibilidad', path: '/compatibilidad', active: false },
  { label: 'Horóscopo', path: '/horoscopo', active: false },
]

function goTo(path) {
  router.push(path)
}

function generateReport() {
  router.push('/informe-personal')
}

// Fallback data in case API fails or is empty
const defaultReading = {
  numero: '7',
  titulo: 'El Buscador de la Verdad',
  descripcion: 'La energía de hoy invita a la introspección, el análisis profundo y una conexión con los reinos invisibles del universo.',
  consejo_texto: 'El número 7 representa el puente entre lo material y lo espiritual. En este día, la alineación cósmica favorece a quienes miran bajo la superficie. No es un día para multitudes ruidosas o actividad bulliciosa, sino para la quietud del alma. Tu mente analítica se agudiza hoy. Problemas complejos que antes parecían insuperables comenzarán a revelar sus patrones. Confía en tu intuición, ya que está vibrando a una frecuencia superior a tu razonamiento lógico.',
  frecuencia: '528HZ',
  frase_guia: '"La verdad no se encuentra en el ruido, sino en el eco de tu propio corazón."',
  fase_lunar: 'GIBOSA MENGUANTE',
  planeta_activo: 'NEPTUNO',
  nivel_suerte: 'EQUILIBRADO',
  influencia_solar: 'MODERADA'
}

const currentReading = ref(defaultReading)

const advisoryChecklist = ref([
  { 
    title: 'Abraza la Soledad', 
    desc: 'Dedica al menos 30 minutos al silencio para escuchar tu brújula interna.', 
    checked: true 
  },
  { 
    title: 'Cuestiona las Suposiciones', 
    desc: 'Una verdad que has sostenido puede estar lista para evolucionar. Observa objetivamente.', 
    checked: true 
  },
  { 
    title: 'Evita las Prisas', 
    desc: 'La energía de hoy es lenta y deliberada. Forzar resultados provocará fricción.', 
    checked: false 
  },
])

onMounted(async () => {
  try {
    const data = await lecturasService.getAll()
    if (data && data.length > 0) {
      readings.value = data
      // Use the first reading or the most recent one
      const apiReading = data[0]
      currentReading.value = {
        numero: apiReading.numero || defaultReading.numero,
        titulo: apiReading.titulo || defaultReading.titulo,
        descripcion: apiReading.descripcion || defaultReading.descripcion,
        consejo_texto: apiReading.consejo || apiReading.consejo_texto || defaultReading.consejo_texto,
        frecuencia: apiReading.frecuencia || defaultReading.frecuencia,
        frase_guia: apiReading.frase || apiReading.frase_guia || defaultReading.frase_guia,
        fase_lunar: apiReading.fase_lunar || defaultReading.fase_lunar,
        planeta_activo: apiReading.planeta_activo || defaultReading.planeta_activo,
        nivel_suerte: apiReading.nivel_suerte || defaultReading.nivel_suerte,
        influencia_solar: apiReading.influencia_solar || defaultReading.influencia_solar
      }
    }
  } catch (err) {
    console.error('Error fetching readings:', err)
    error.value = 'No se pudo cargar la información del servidor. Usando datos locales.'
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push('/home')
}
</script>

<template>
  <div class="lecturas-container">
    <Galaxy 
      :density="1.5"
      :glow-intensity="0.5"
      :hue-shift="240"
      class="galaxy-bg"
    />
    <!-- NAV BAR -->
    <header class="navbar">
      <div class="nav-left">
        <button class="nav-back-btn" @click="goBack">
          <span class="back-arrow">←</span>
          <span class="back-text">VOLVER</span>
        </button>
        <div class="nav-logo" @click="goBack">
          <span class="logo-icon">✨</span>
          <span class="logo-text">ASTRALIS</span>
        </div>
      </div>
      <nav class="nav-center">
        <a 
          v-for="link in navLinks" 
          :key="link.label" 
          href="javascript:void(0)" 
          :class="['nav-link', { active: link.active }]"
          @click="goTo(link.path)"
        >
          {{ link.label }}
        </a>
      </nav>
      <div class="nav-right">
        <div class="user-nav-profile">
          <div class="user-avatar-mini">
            <img :src="`https://ui-avatars.com/api/?name=${user?.nombre || user?.name || 'User'}&background=fff&color=6366f1`" alt="User" />
          </div>
          <span class="user-name-mini">{{ user?.nombre }}</span>
        </div>
        <button class="premium-btn">PREMIUM</button>
      </div>
    </header>

    <!-- CONTENT -->
    <main class="page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-overlay">
        <div class="lds-hourglass"></div>
        <p>Sincronizando con el cosmos...</p>
      </div>

      <div v-else>
        <!-- HERO -->
        <section class="hero-section">
          <div class="hero-glow"></div>
          <p class="hero-tag">LA VIBRACIÓN DEL AHORA</p>
          <div class="hero-number-container">
            <h1 class="hero-number">{{ currentReading.numero }}</h1>
            <div class="number-rings"></div>
          </div>
          <h2 class="hero-title">{{ currentReading.titulo }}</h2>
          <p class="hero-description">{{ currentReading.descripcion }}</p>
        </section>

        <!-- ADVICE CARDS -->
        <section class="advice-grid">
          <!-- Card 1 -->
          <div class="advice-card standard">
            <div class="card-header">
              <div class="icon-box">📱</div>
              <div class="header-text">
                <h3>Consejo Diario</h3>
                <span class="sub-tag">GUÍA ASTRAL</span>
              </div>
            </div>
            <div class="card-body">
              <p>{{ currentReading.consejo_texto }}</p>
            </div>
            <div class="card-footer">
              <span class="footer-stat">FRECUENCIA: {{ currentReading.frecuencia }}</span>
              <a href="#" class="footer-link">Leer análisis completo →</a>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="advice-card checklist">
            <div class="card-header">
              <div class="icon-box light">💡</div>
              <div class="header-text">
                <h3>Consejo Diario</h3>
                <span class="sub-tag">GUÍA ASTRAL</span>
              </div>
            </div>
            <div class="card-body">
              <div 
                v-for="item in advisoryChecklist" 
                :key="item.title" 
                class="check-item"
              >
                <div :class="['check-icon', { 'is-checked': item.checked, 'is-cross': !item.checked }]">
                  {{ item.checked ? '✓' : '✕' }}
                </div>
                <div class="item-content">
                  <p class="item-title">{{ item.title }}</p>
                  <p class="item-desc">{{ item.desc }}</p>
                </div>
              </div>
            </div>
            <div class="card-quote">{{ currentReading.frase_guia }}</div>
          </div>
        </section>

        <!-- ASTRAL STATUS -->
        <section class="astral-status-grid">
          <!-- Fase Lunar -->
          <div class="status-card">
            <span class="status-label">FASE LUNAR</span>
            <div class="standard-status">
              <span class="status-icon">🌙</span>
              <p class="status-value">{{ currentReading.fase_lunar }}</p>
            </div>
          </div>

          <!-- Planeta Activo -->
          <div class="status-card">
            <span class="status-label">PLANETA ACTIVO</span>
            <div class="standard-status">
              <span class="status-icon">🌍</span>
              <p class="status-value">{{ currentReading.planeta_activo }}</p>
            </div>
          </div>

          <!-- Nivel de Suerte -->
          <div class="status-card">
            <span class="status-label">NIVEL DE SUERTE</span>
            <div class="luck-content">
               <div class="luck-dots">
                 <span 
                  v-for="i in 4" 
                  :key="i" 
                  :class="['dot', { active: i === 2 }]"
                 ></span>
               </div>
               <p class="status-value luck-text">{{ currentReading.nivel_suerte }} de Suerte</p>
            </div>
          </div>

          <!-- Influencia Solar -->
          <div class="status-card">
            <span class="status-label">INFLUENCIA SOLAR</span>
            <div class="standard-status">
              <span class="status-icon">☀️</span>
              <p class="status-value">{{ currentReading.influencia_solar }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- CTA -->
      <div class="cta-container">
        <button class="btn-full-report" @click="generateReport">
          GENERAR INFORME PERSONAL COMPLETO <span class="btn-wand">🪄</span>
        </button>
      </div>
    </main>


    <!-- FOOTER -->
    <footer class="page-footer">
      <div class="footer-left">
        © 2024 Colectivo de Numerología Astralis. Todos los derechos reservados.
      </div>
      <div class="footer-right">
        <a href="#">Política de Privacidad</a>
        <a href="#">Términos Cósmicos</a>
        <a href="#">Contacto</a>
        <button class="share-btn">🔗</button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

.lecturas-container {
  background-color: #020205;
  color: #fff;
  min-height: 100vh;
  font-family: 'Outfit', sans-serif;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.galaxy-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
}

/* NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  background: rgba(5, 5, 8, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-sizing: border-box;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-back-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.nav-back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(-3px);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.nav-logo:hover {
  opacity: 0.8;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 4px;
}

.nav-center {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.85rem;
  padding: 0.5rem 1.2rem;
  transition: all 0.3s;
  border-radius: 50px;
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}

.user-nav-profile {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: default;
}

.user-avatar-mini {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
}

.user-avatar-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name-mini {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
}

.premium-btn {
  background: #6366f1;
  border: none;
  color: #fff;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}

/* MAIN CONTENT */
.page-content {
  flex: 1;
  padding: 8rem 4rem 6rem;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* HERO SECTION */
.hero-section {
  text-align: center;
  margin-bottom: 5rem;
  position: relative;
}

.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  z-index: -1;
}

.hero-tag {
  color: #6366f1;
  font-weight: 800;
  letter-spacing: 4px;
  font-size: 0.75rem;
  margin-bottom: 2rem;
}

.hero-number-container {
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.hero-number {
  font-size: 10rem;
  font-weight: 800;
  line-height: 1;
  margin: 0;
  text-shadow: 0 0 50px rgba(99, 102, 241, 0.3);
}

.number-rings {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    z-index: -1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1rem;
}

.hero-description {
  color: rgba(255, 255, 255, 0.5);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ADVICE GRID */
.advice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
}

.advice-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.icon-box {
  width: 48px;
  height: 48px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.icon-box.light {
    background: rgba(255, 255, 0, 0.05);
}

.header-text h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.sub-tag {
  font-size: 0.65rem;
  font-weight: 800;
  color: #6366f1;
  letter-spacing: 1px;
}

.card-body p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-stat {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

.footer-link {
  color: #6366f1;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
}

/* CHECKLIST */
.check-item {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.check-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.is-checked {
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.4);
}

.is-cross {
  background: rgba(255, 99, 99, 0.1);
  color: #ff6363;
  border: 1px solid rgba(255, 99, 99, 0.3);
}

.item-title {
  font-weight: 700;
  font-size: 0.95rem;
  margin: 0;
}

.item-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0.2rem 0 0;
}

.card-quote {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  font-style: italic;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

/* ASTRAL STATUS */
.astral-status-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 5rem;
}

.status-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.status-label {
  display: block;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 1rem;
}

.status-icon {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.status-value {
  font-size: 0.85rem;
  font-weight: 700;
  margin: 0;
}

.luck-dots {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.dot {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.dot.active {
  background: #6366f1;
  box-shadow: 0 0 8px #6366f1;
}

.luck-text {
    font-size: 0.75rem !important;
}

/* CTA */
.cta-container {
  text-align: center;
  margin-bottom: 2rem;
}

.btn-full-report {
  background: #fff;
  color: #000;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s;
}

.btn-full-report:hover {
  transform: scale(1.05);
}

/* FOOTER */
.page-footer {
  margin-top: auto;
  padding: 3rem 4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.footer-right a {
  color: inherit;
  text-decoration: none;
}

.share-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

@media (max-width: 900px) {
  .advice-grid {
    grid-template-columns: 1fr;
  }
  .astral-status-grid {
    grid-template-columns: 1fr 1fr;
  }
  .nav-center {
    display: none;
  }
}

/* LOADING STYLES */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 2rem;
}

.loading-overlay p {
  color: #6366f1;
  font-weight: 600;
  letter-spacing: 2px;
  animation: pulse 2s infinite;
}

.lds-hourglass, .lds-hourglass:after {
  box-sizing: border-box;
}
.lds-hourglass {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-hourglass:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 8px;
  box-sizing: border-box;
  border: 32px solid #6366f1;
  border-color: #6366f1 transparent #6366f1 transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>

