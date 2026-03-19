<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import Galaxy from '../components/Galaxy.vue'
import SubscriptionOverlay from '../components/SubscriptionOverlay.vue'
import { isSubscribed } from '@/store/auth.js'


const { t } = useI18n()

const router = useRouter()
const loading = ref(true)

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

const natalData = ref({
  sol: { signo: t('natal.signs.tauro'), grado: '24°', casa: 'Casa IX', desc: 'Tu núcleo de identidad y vitalidad.' },
  luna: { signo: t('natal.signs.escorpio'), grado: '12°', casa: 'Casa III', desc: 'Tu mundo emocional y subconsciente.' },
  ascendente: { signo: t('natal.signs.leo'), grado: '05°', casa: 'Casa I', desc: 'La máscara que muestras al mundo.' },
  planetas: [
    { nombre: t('natal.planets.mercurio'), signo: t('natal.signs.geminis'), casa: 'Casa X', icon: '☿' },
    { nombre: t('natal.planets.venus'), signo: t('natal.signs.cancer'), casa: 'Casa XI', icon: '♀' },
    { nombre: t('natal.planets.marte'), signo: t('natal.signs.aries'), casa: 'Casa VIII', icon: '♂' },
    { nombre: t('natal.planets.jupiter'), signo: t('natal.signs.sagitario'), casa: 'Casa IV', icon: '♃' },
  ],
  elementos: [
    { nombre: t('natal.elements.fuego'), porcentaje: 35, color: '#ff4d4d' },
    { nombre: t('natal.elements.tierra'), porcentaje: 25, color: '#c9a96e' },
    { nombre: t('natal.elements.aire'), porcentaje: 20, color: '#4da6ff' },
    { nombre: t('natal.elements.agua'), porcentaje: 20, color: '#4dffdb' },
  ]
})

const navLinks = computed(() => [
  { label: t('nav.predictions'), path: '/lecturas', active: false },
  { label: t('nav.chart'), path: '/carta-natal', active: true },
  { label: t('nav.compat'), path: '/compatibilidad', active: false },
  { label: 'Horóscopo', path: '/horoscopo', active: false },
])

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1200)
})

function goBack() {
  router.push('/home')
}

const bootstrapAlert = ref({ show: false, message: '', type: 'info' })

function showAlert(message, type = 'info') {
  bootstrapAlert.value = { show: true, message, type }
  setTimeout(() => {
    bootstrapAlert.value.show = false
  }, 4000)
}

function goTo(path) {
  router.push(path)
}
</script>

<template>
  <div class="natal-container">
    <Galaxy 
      :density="1.8"
      :glow-intensity="0.3"
      :hue-shift="280"
      class="galaxy-bg"
    />

    <SubscriptionOverlay v-if="!isSubscribed" />

    <!-- Bootstrap Alert -->
    <div 
      v-if="bootstrapAlert.show" 
      :class="['alert', `alert-${bootstrapAlert.type}`, 'alert-dismissible', 'fade', 'show', 'cosmic-alert-top']" 
      role="alert"
    >
      <span class="alert-icon">✨</span>
      {{ bootstrapAlert.message }}
      <button type="button" class="btn-close btn-close-white" @click="bootstrapAlert.show = false" aria-label="Close"></button>
    </div>
    <!-- NAV BAR -->
    <header class="navbar">
      <div class="nav-left">
        <button class="nav-back-btn" @click="goBack">
          <span class="back-arrow">←</span>
          <span class="back-text">{{ t('nav.back') }}</span>
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
            <img :src="`https://ui-avatars.com/api/?name=${user?.nombre || 'User'}&background=fff&color=6366f1`" alt="User" />
          </div>
          <span class="user-name-mini">{{ user?.nombre }}</span>
        </div>
        <button class="premium-btn" @click="goTo('/suscripcion')">{{ t('nav.premium') }}</button>
      </div>
    </header>

    <main class="page-content">
      <div v-if="loading" class="loading-overlay">
        <div class="lds-hourglass"></div>
        <p>{{ t('natal.loading') }}</p>
      </div>

      <div v-else class="content-fade-in">
        <!-- HERO: THE TRIAD -->
        <section class="natal-hero">
          <div class="hero-bg-glow"></div>
          <p class="hero-tag">{{ t('natal.heroTag') }}</p>
          <h1 class="hero-title">{{ t('natal.title') }}</h1>
          <p class="hero-subtitle">{{ t('natal.subtitle') }}</p>

          <div class="triad-grid">
            <div class="triad-card sun">
              <div class="card-icon">☀️</div>
              <h3>{{ natalData.sol.signo }}</h3>
              <p class="triad-label">{{ t('natal.triad.sol') }}</p>
              <div class="triad-divider"></div>
              <p class="triad-desc">{{ natalData.sol.desc }}</p>
              <span class="degree">{{ natalData.sol.grado }} - {{ natalData.sol.casa }}</span>
            </div>
            <div class="triad-card moon">
              <div class="card-icon">🌙</div>
              <h3>{{ natalData.luna.signo }}</h3>
              <p class="triad-label">{{ t('natal.triad.luna') }}</p>
              <div class="triad-divider"></div>
              <p class="triad-desc">{{ natalData.luna.desc }}</p>
              <span class="degree">{{ natalData.luna.grado }} - {{ natalData.luna.casa }}</span>
            </div>
            <div class="triad-card asc">
              <div class="card-icon">🏹</div>
              <h3>{{ natalData.ascendente.signo }}</h3>
              <p class="triad-label">{{ t('natal.triad.asc') }}</p>
              <div class="triad-divider"></div>
              <p class="triad-desc">{{ natalData.ascendente.desc }}</p>
              <span class="degree">{{ natalData.ascendente.grado }} - {{ natalData.ascendente.casa }}</span>
            </div>
          </div>
        </section>

        <!-- ELEMENTS & PLANETS -->
        <div class="details-grid">
          <!-- Elements Section -->
          <section class="elements-card">
            <h2 class="section-title">{{ t('natal.sections.elements') }}</h2>
            <div class="elements-list">
              <div v-for="elem in natalData.elementos" :key="elem.nombre" class="element-item">
                <div class="element-header">
                  <span class="element-name">{{ elem.nombre }}</span>
                  <span class="element-value">{{ elem.porcentaje }}%</span>
                </div>
                <div class="progress-bg">
                  <div class="progress-fill" :style="{ width: elem.porcentaje + '%', background: elem.color }"></div>
                </div>
              </div>
            </div>
          </section>

          <!-- Planets Section -->
          <section class="planets-card">
            <h2 class="section-title">{{ t('natal.sections.planets') }}</h2>
            <div class="planets-table">
              <div v-for="planet in natalData.planetas" :key="planet.nombre" class="planet-row">
                <span class="planet-icon">{{ planet.icon }}</span>
                <span class="planet-name">{{ planet.nombre }}</span>
                <span class="planet-sign">{{ planet.signo }}</span>
                <span class="planet-casa">{{ planet.casa }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- CALL TO ACTION -->
        <section class="evolution-cta">
          <div class="cta-content">
            <h2>{{ t('natal.cta.title') }}</h2>
            <p>{{ t('natal.cta.desc') }}</p>
            <button class="btn-unlock-full" @click="goTo('/suscripcion')">{{ t('natal.cta.btn') }}</button>
          </div>
        </section>
      </div>
    </main>

    <footer class="page-footer">
      <div class="footer-left">© 2024 {{ t('natal.footer') }}</div>
      <div class="footer-right">
        <a href="#" @click.prevent="showAlert(t('natal.privacyAlert') || 'Privacy', 'info')">{{ t('natal.privacy') }}</a>
        <a href="#" @click.prevent="showAlert(t('natal.ethicsAlert') || 'Ethics', 'info')">{{ t('natal.ethics') }}</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

.natal-container {
  background-color: #020205;
  color: #fff;
  min-height: 100vh;
  font-family: 'Outfit', sans-serif;
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
  opacity: 0.5;
}

/* NAVBAR (Same as Lecturas) */
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

.nav-left { display: flex; align-items: center; gap: 1.5rem; }
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
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 0.3s;
}
.nav-back-btn:hover { transform: translateX(-3px); color: #fff; background: rgba(255, 255, 255, 0.1); }

.nav-logo { display: flex; align-items: center; gap: 0.8rem; cursor: pointer; }
.logo-icon { font-size: 1.5rem; }
.logo-text { font-size: 1.2rem; font-weight: 800; letter-spacing: 4px; }

.nav-center {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.nav-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.8rem;
  padding: 0.5rem 1.2rem;
  transition: all 0.3s;
  border-radius: 50px;
}
.nav-link.active { background: rgba(99, 102, 241, 0.15); color: #fff; }

.nav-right { display: flex; align-items: center; gap: 1.5rem; }

.user-nav-profile {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.user-avatar-mini { width: 26px; height: 26px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
.user-avatar-mini img { width: 100%; height: 100%; object-fit: cover; }
.user-name-mini { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }

.premium-btn {
  background: #6366f1;
  border: none;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.75rem;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
}

/* CONTENT */
.page-content { 
  flex: 1; 
  padding: 10rem 2rem 4rem; 
  max-width: 1200px; 
  margin: 0 auto; 
  width: 100%; 
  position: relative;
  z-index: 1;
}

.content-fade-in { animation: fadeIn 1s ease-out; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.natal-hero { text-align: center; margin-bottom: 6rem; position: relative; }
.hero-bg-glow { 
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 600px; height: 300px; background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
    z-index: -1;
}

.hero-tag { color: #6366f1; font-weight: 800; letter-spacing: 4px; font-size: 0.75rem; margin-bottom: 1rem; }
.hero-title { font-size: 3.5rem; font-weight: 800; margin: 0; letter-spacing: -1px; }
.hero-subtitle { color: rgba(255, 255, 255, 0.5); font-size: 1.1rem; margin-top: 1rem; }

.triad-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem; }
.triad-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  padding: 3rem 2rem;
  backdrop-filter: blur(20px);
  transition: all 0.4s;
}
.triad-card:hover { transform: translateY(-10px); border-color: #6366f1; background: rgba(99, 102, 241, 0.02); }

.card-icon { font-size: 2.5rem; margin-bottom: 1.5rem; }
.triad-card h3 { font-size: 2rem; font-weight: 800; margin: 0; }
.triad-label { font-size: 0.65rem; font-weight: 800; color: #6366f1; letter-spacing: 2px; margin: 0.5rem 0 1.5rem; }
.triad-divider { height: 1px; width: 40px; background: rgba(255, 255, 255, 0.1); margin: 0 auto 1.5rem; }
.triad-desc { font-size: 0.85rem; color: rgba(255, 255, 255, 0.5); line-height: 1.6; min-height: 3.2rem; }
.degree { display: block; margin-top: 1.5rem; font-weight: 700; font-size: 0.8rem; color: #fff; }

/* DETAILS GRID */
.details-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 2rem; margin-bottom: 4rem; }
.elements-card, .planets-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2rem;
}

.section-title { font-size: 1.2rem; font-weight: 800; margin-bottom: 2rem; letter-spacing: 1px; }

.element-item { margin-bottom: 1.5rem; }
.element-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; font-weight: 600; }
.progress-bg { height: 6px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 10px; transition: width 1s cubic-bezier(0.19, 1, 0.22, 1); }

.planets-table { display: flex; flex-direction: column; gap: 1rem; }
.planet-row {
  display: grid; grid-template-columns: 40px 1fr 1fr 1fr; align-items: center;
  padding: 1rem; background: rgba(255, 255, 255, 0.02); border-radius: 12px;
  font-size: 0.9rem;
}
.planet-icon { font-size: 1.2rem; }
.planet-name { font-weight: 700; }
.planet-sign { color: #6366f1; font-weight: 600; }
.planet-casa { text-align: right; color: rgba(255, 255, 255, 0.4); font-size: 0.75rem; }

/* CTAs */
.evolution-cta {
  background: linear-gradient(135deg, #1b1b3a 0%, #050508 100%);
  border-radius: 32px;
  padding: 4rem;
  text-align: center;
  border: 1px solid rgba(99, 102, 241, 0.2);
  margin-top: 4rem;
}
.cta-content h2 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; }
.cta-content p { color: rgba(255, 255, 255, 0.5); max-width: 600px; margin: 0 auto 2.5rem; }
.btn-unlock-full {
  background: #fff; color: #000; border: none; padding: 1.2rem 2.5rem; border-radius: 50px;
  font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: transform 0.3s;
}
.btn-unlock-full:hover { transform: scale(1.05); }

/* FOOTER */
.page-footer {
  margin-top: auto; padding: 3rem 4rem; border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: rgba(255, 255, 255, 0.3);
}
.footer-right { display: flex; gap: 2rem; }
.footer-right a { color: inherit; text-decoration: none; }

/* Cosmic Alert Top */
.cosmic-alert-top {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  background: rgba(15, 12, 41, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  backdrop-filter: blur(15px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255, 255, 255, 0.1);
  font-family: 'Outfit', sans-serif;
  letter-spacing: 1px;
  min-width: 400px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
}

.alert-icon {
  font-size: 1.2rem;
}

.btn-close-white {
  filter: invert(1);
}

/* LOADING */
.loading-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; gap: 2rem; }
.loading-overlay p { color: #6366f1; font-weight: 600; letter-spacing: 2px; animation: pulse 2s infinite; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.lds-hourglass { display: inline-block; position: relative; width: 64px; height: 64px; }
.lds-hourglass:after {
  content: " "; display: block; border-radius: 50%; width: 0; height: 0; margin: 4px; box-sizing: border-box;
  border: 28px solid #6366f1; border-color: #6366f1 transparent #6366f1 transparent; animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass { 0% { transform: rotate(0); } 100% { transform: rotate(1800deg); } }

@media (max-width: 900px) {
  .triad-grid { grid-template-columns: 1fr; }
  .details-grid { grid-template-columns: 1fr; }
  .navbar { padding: 1rem 2rem; }
  .nav-center { display: none; }
}
</style>
