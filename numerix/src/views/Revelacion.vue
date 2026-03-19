<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import LightPillar from '@/components/LightPillar.vue'
import SubscriptionOverlay from '../components/SubscriptionOverlay.vue'
import { isSubscribed } from '@/store/auth.js'


const { t } = useI18n()

const router = useRouter()

// --- DATA POOLS ---
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const lunarPool = [
  { value: '🌙', sub: t('revelation.pools.lunar.creciente') },
  { value: '🌑', sub: t('revelation.pools.lunar.nueva') },
  { value: '🌕', sub: t('revelation.pools.lunar.llena') },
  { value: '🌓', sub: t('revelation.pools.lunar.cuartoCreciente') },
  { value: '🌗', sub: t('revelation.pools.lunar.cuartoMenguante') }
]
const energyPool = [
  { value: t('revelation.pools.energy.alta'), sub: t('revelation.pools.energy.radiante') },
  { value: t('revelation.pools.energy.densa'), sub: t('revelation.pools.energy.enraizada') },
  { value: t('revelation.pools.energy.fluida'), sub: t('revelation.pools.energy.enFlujo') },
  { value: t('revelation.pools.energy.sutil'), sub: t('revelation.pools.energy.eterea') }
]
const freqPool = [
  { value: '528Hz', sub: t('revelation.pools.freq.sana') },
  { value: '432Hz', sub: t('revelation.pools.freq.cosmica') },
  { value: '639Hz', sub: t('revelation.pools.freq.conexion') },
  { value: '852Hz', sub: t('revelation.pools.freq.intuicion') }
]

const synthPool = [
  { id: 11, ...t('revelation.pools.synth.soul'), color: '#6366f1' },
  { id: 5, ...t('revelation.pools.synth.personality'), color: '#3b82f6' },
  { id: 9, ...t('revelation.pools.synth.mission'), color: '#4f46e5' },
  { id: 22, ...t('revelation.pools.synth.builder'), color: '#8b5cf6' },
  { id: 7, ...t('revelation.pools.synth.wisdom'), color: '#06b6d4' }
]

const nodesPool = [
  { label: t('revelation.pools.nodes.finance.label'), statusPool: t('revelation.pools.nodes.finance.statuses'), color: '#10b981' },
  { label: t('revelation.pools.nodes.love.label'), statusPool: t('revelation.pools.nodes.love.statuses'), color: '#ef4444' },
  { label: t('revelation.pools.nodes.career.label'), statusPool: t('revelation.pools.nodes.career.statuses'), color: '#3b82f6' },
  { label: t('revelation.pools.nodes.health.label'), statusPool: t('revelation.pools.nodes.health.statuses'), color: '#8b5cf6' }
]

const oraclePool = t('revelation.pools.oracle')

// --- STATE ---
const stats = ref([])
const numericalSynthesis = ref([])
const powerNodes = ref([])
const oracleText = ref('')
const zoomScale = ref(1)

// Dynamic user data
const user = computed(() => {
  const stored = localStorage.getItem('user')
  const alignment = localStorage.getItem('alignmentProfile')
  const userData = stored ? JSON.parse(stored) : null
  const alignmentData = alignment ? JSON.parse(alignment) : null
  
  return {
    nombre: alignmentData?.fullName || userData?.nombre || userData?.name || 'VIAJERO ASTRAL',
    role: userData?.role || 'BUSCADOR CÓSMICO',
    alignmentStatus: alignmentData ? t('revelation.statusComplete') : t('revelation.statusPending')
  }
})

// Interactive Insights
const satellites = computed(() => [
  { id: 1, label: t('revelation.sats.expansion.label'), message: t('revelation.sats.expansion.message'), class: 's-1' },
  { id: 2, label: t('revelation.sats.balance.label'), message: t('revelation.sats.balance.message'), class: 's-2' },
  { id: 3, label: t('revelation.sats.energy.label'), message: t('revelation.sats.energy.message'), class: 's-3' },
  { id: 4, label: t('revelation.sats.vision.label'), message: t('revelation.sats.vision.message'), class: 's-4' }
])

const activeSatellite = ref(null)
const isLoaded = ref(false)

function generateNewReading() {
  stats.value = [
    { label: 'FASE LUNAR', ...pick(lunarPool) },
    { label: 'ENERGÍA', ...pick(energyPool) },
    { label: 'FRECUENCIA', ...pick(freqPool) }
  ]
  
  // Pick 3 unique random synthesis items
  const shuffledSynth = [...synthPool].sort(() => 0.5 - Math.random())
  numericalSynthesis.value = shuffledSynth.slice(0, 3)
  
  // Pick 2 random nodes
  const shuffledNodes = [...nodesPool].sort(() => 0.5 - Math.random())
  powerNodes.value = shuffledNodes.slice(0, 2).map(n => ({
    label: n.label,
    status: pick(n.statusPool),
    color: n.color
  }))
  
  oracleText.value = pick(oraclePool)
}

onMounted(() => {
  setTimeout(() => { isLoaded.value = true }, 100)
  generateNewReading()
  activeSatellite.value = satellites.value[0]
})

function setSatellite(sat) {
  activeSatellite.value = sat
}

function adjustZoom(delta) {
  zoomScale.value = Math.min(Math.max(zoomScale.value + delta, 0.5), 2)
}

const starsIntensity = computed(() => {
  // Increases as zoomScale increases
  return Math.min(Math.max((zoomScale.value - 1) * 2, 0), 1)
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
</script>

<template>
  <div class="revelation-container">
    <div class="stars-bg"></div>
    <SubscriptionOverlay v-if="!isSubscribed" />
    <div class="dynamic-stars" :style="{ opacity: starsIntensity }"></div>
    <div class="background-effects">
      <LightPillar
        topColor="#48FF28"
        bottomColor="#9EF19E"
        :intensity="0.6 * zoomScale"
        :rotationSpeed="0.2"
        :glowAmount="0.005"
        :pillarWidth="3.0"
        :pillarHeight="0.4"
        :noiseIntensity="0.3"
        :pillarRotation="0"
        :interactive="false"
        mixBlendMode="screen"
      />
    </div>

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
    
    <!-- Header -->
    <header class="rev-header">
      <div class="header-titles">
        <p class="module-tag">{{ t('revelation.moduleTag') }}</p>
        <h1 class="main-title">{{ t('revelation.title') }} <span class="highlight">{{ t('revelation.subtitle') }}</span></h1>
      </div>
      <div class="header-actions">
        <button class="back-btn" @click="goBack">
          <span class="btn-icon">←</span> {{ t('revelation.backBtn') }}
        </button>
        <button class="icon-btn" @click="goBack"><span class="icon">⚙️</span></button>
        <button class="icon-btn" @click="showAlert(t('revelation.sintonizando'), 'info')"><span class="icon">❓</span></button>
      </div>
    </header>

    <div class="content-grid">
      <!-- Main Interactive Chart Area -->
      <main class="chart-area">
        <div class="interactive-chart" :style="{ transform: `scale(${zoomScale})` }">
          <!-- Background Geometry -->
          <div class="geometry-overlay">
            <div class="diamond"></div>
          </div>

          <!-- Pulsing Rings -->
          <div class="rings-container">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
            <div class="ring ring-4"></div>
          </div>

          <!-- Interactive Orbs -->
          <div class="orbs-container" :class="{ 'is-active': isLoaded }">
            <div class="orb center-orb" @mouseenter="activeSatellite = { message: t('revelation.essence') }">
              <span class="orb-val">7</span>
              <div class="orb-glow"></div>
            </div>
            
            <div 
              v-for="sat in satellites" 
              :key="sat.id"
              class="orb satellite"
              :class="[sat.class, { 'active-sat': activeSatellite?.id === sat.id }]"
              @mouseenter="setSatellite(sat)"
            >
              <div class="sat-inner"></div>
            </div>
            
            <!-- Message Tag (Tooltip) -->
            <div v-if="activeSatellite" class="message-tag" :class="activeSatellite.class || 'center-tag'">
              {{ activeSatellite.message }}
              <div class="tag-pointer"></div>
            </div>
          </div>
        </div>

        <!-- Footer Legend -->
        <footer class="chart-footer">
          <div class="vibration-info">
            <span class="vibration-icon">✨</span>
            <div class="vibration-text">
              <p class="vibration-label">{{ t('revelation.vibrationLabel') }}</p>
              <p class="vibration-desc">{{ t('revelation.vibrationDesc') }}</p>
            </div>
          </div>
          <div class="zoom-controls">
            <button class="zoom-btn" @click="adjustZoom(0.1)" :title="t('revelation.zoomIn') || '+'">+</button>
            <button class="zoom-btn" @click="adjustZoom(-0.1)" :title="t('revelation.zoomOut') || '-'">-</button>
          </div>
        </footer>
      </main>

      <!-- Sidebar Results Area -->
      <aside class="results-sidebar">
        <!-- Profile User -->
        <div class="profile-card">
          <div class="profile-avatar">
            <img :src="`https://ui-avatars.com/api/?name=${user.nombre}&background=fff&color=0f172a`" alt="User">
          </div>
          <div class="profile-info">
            <h3 class="user-name">{{ user.nombre }}</h3>
            <p class="user-status">{{ user.alignmentStatus }}</p>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-card">
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-value" :class="{ 'lunar-icon': stat.label === 'FASE LUNAR' }">{{ stat.value }}</span>
            <span class="stat-sub-text">{{ stat.sub }}</span>
          </div>
        </div>

        <!-- Synthesis Section -->
        <section class="synthesis-section">
          <h4 class="section-divider">{{ t('revelation.synthTitle') }}</h4>
          <div class="synthesis-cards">
            <div v-for="item in numericalSynthesis" :key="item.title" class="synth-card">
              <div class="synth-header">
                <div>
                  <p class="synth-label">{{ item.title }}</p>
                  <p class="synth-title" :style="{ color: item.color }">{{ item.id }} <span class="synth-sub">{{ item.subtitle }}</span></p>
                </div>
                <div class="synth-bg-num">{{ item.id }}</div>
              </div>
              <p class="synth-desc">{{ item.desc }}</p>
            </div>
          </div>
        </section>

        <!-- Power Nodes -->
        <section class="nodes-section">
          <h4 class="section-divider">{{ t('revelation.nodesTitle') }}</h4>
          <div class="nodes-grid">
            <div v-for="node in powerNodes" :key="node.label" class="node-card">
              <span class="node-label">{{ node.label }}</span>
              <span class="node-status" :style="{ color: node.color }">{{ node.status }}</span>
            </div>
          </div>
        </section>

        <!-- Oracle Action -->
        <section class="oracle-section">
          <div class="oracle-card">
            <p class="oracle-label">{{ t('revelation.oracleLabel') }}</p>
            <p class="oracle-text">"{{ oracleText }}"</p>
          </div>
          <button class="generate-btn" @click="generateNewReading">
            <span class="btn-icon">🪄</span> {{ t('revelation.generateBtn') }}
          </button>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&family=Cinzel:wght@400;700&display=swap');

.revelation-container {
  min-height: 100vh;
  background-color: #050508;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  padding: 1rem 1.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Cosmic Alert Top Responsive Fix */
.cosmic-alert-top {
  width: 90%;
  max-width: 450px;
  min-width: auto;
  transition: all 0.3s ease;
}

.alert-icon {
  font-size: 1.2rem;
}

.btn-close-white {
  filter: invert(1);
}

.stars-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)), 
                    radial-gradient(1.5px 1.5px at 100px 100px, #fff, rgba(0,0,0,0));
  background-size: 200px 200px;
  opacity: 0.1;
  pointer-events: none;
}

.dynamic-stars {
  position: absolute;
  top: -100px; left: -100px; right: -100px; bottom: -100px;
  background-image: 
    radial-gradient(2px 2px at 40px 60px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 150px 180px, #fbbf24, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 280px 40px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 350px 300px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 450px 120px, #fbbf24, rgba(0,0,0,0));
  background-size: 500px 500px;
  opacity: 0;
  transition: opacity 0.8s ease-out;
  pointer-events: none;
  z-index: 1;
}

.background-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.5;
}

/* Header */
.rev-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  z-index: 10;
}

.module-tag {
  font-size: 0.65rem;
  letter-spacing: 4px;
  color: #6366f1;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-weight: 600;
}

.main-title {
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  margin: 0;
}

.highlight {
  color: #fbbf24;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.back-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.6rem 1.2rem;
  border-radius: 100px;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s;
  margin-right: 1rem;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateX(-5px);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
}

/* Layout Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
  flex: 1;
  z-index: 5;
}

/* Chart Area */
.chart-area {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, rgba(30, 41, 59, 0.1) 0%, transparent 70%);
}

.interactive-chart {
  position: relative;
  width: 450px;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.geometry-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.2;
}

.diamond {
  width: 320px;
  height: 320px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transform: rotate(45deg);
}

.rings-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring {
  position: absolute;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  transition: all 1s ease-out;
}

.ring-1 { width: 80px; height: 80px; border-width: 2px; border-color: rgba(99, 102, 241, 0.4); }
.ring-2 { width: 180px; height: 180px; }
.ring-3 { width: 300px; height: 300px; }
.ring-4 { width: 420px; height: 420px; opacity: 0.5; }

.orbs-container {
  position: relative;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s;
}

.orbs-container.is-active {
  opacity: 1;
}

.orb {
  position: absolute;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.center-orb {
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 80px; height: 80px;
  background: linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%);
  border: 4px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 0 30px rgba(79, 70, 229, 0.5);
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  font-weight: bold;
}

.orb-glow {
  position: absolute;
  width: 150%; height: 150%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  animation: pulse 3s infinite ease-in-out;
}

.satellite {
  width: 14px; height: 14px;
  background: #fbbf24;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.4);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.satellite:hover, .active-sat {
  transform: scale(1.5);
  background: #fff;
  box-shadow: 0 0 20px #fbbf24;
  z-index: 10;
}

.sat-inner {
  width: 100%; height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  transform: scale(0.8);
}

.s-1 { top: 30%; left: 35%; }
.s-2 { top: 45%; left: 65%; }
.s-3 { top: 70%; left: 55%; }
.s-4 { top: 55%; left: 20%; }

.message-tag {
  position: absolute;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid #fbbf24;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.7rem;
  letter-spacing: 2px;
  font-weight: 600;
  color: #fbbf24;
  pointer-events: none;
  transition: all 0.3s ease-out;
  white-space: nowrap;
  z-index: 20;
}

/* Dynamic Positioning for Tooltip */
.s-1.message-tag { top: 20%; left: 35%; transform: translate(-50%, -130%); }
.s-2.message-tag { top: 40%; left: 70%; transform: translate(-50%, -130%); }
.s-3.message-tag { top: 65%; left: 60%; transform: translate(-50%, -130%); }
.s-4.message-tag { top: 50%; left: 15%; transform: translate(-50%, -130%); }
.center-tag.message-tag { top: 40%; left: 50%; transform: translate(-50%, -130%); }

.tag-pointer {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px; height: 10px;
  background: rgba(15, 23, 42, 0.8);
  border-right: 1px solid #fbbf24;
  border-bottom: 1px solid #fbbf24;
}

/* Chart Footer */
.chart-footer {
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
}

.vibration-info {
  display: flex;
  gap: 1.5rem;
  background: rgba(15, 23, 42, 0.6);
  padding: 1.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  max-width: 500px;
}

.vibration-icon {
  font-size: 1.5rem;
  color: #fbbf24;
}

.vibration-label {
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: #6366f1;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.vibration-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  line-height: 1.4;
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.zoom-btn {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.zoom-btn:hover { background: rgba(255, 255, 255, 0.1); }

/* Sidebar */
.results-sidebar {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(30px);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  width: 60px; height: 60px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }

.user-name {
  font-size: 1.2rem;
  margin: 0 0 0.2rem 0;
}

.user-status {
  font-size: 0.65rem;
  letter-spacing: 1px;
  color: #fbbf24;
  font-weight: 600;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 1.2rem 0.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  min-height: 140px;
}

.stat-label { 
  font-size: 0.6rem; 
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4); 
  margin-bottom: auto;
  text-transform: uppercase;
}

.stat-value { 
  font-size: 1.4rem; 
  font-weight: bold; 
  margin: 1rem 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-sub-text { 
  font-size: 0.7rem; 
  color: #6366f1; 
  font-weight: 600;
  margin-top: auto;
}

.lunar-icon { 
  font-size: 2.2rem; 
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.4));
  line-height: 1;
}

/* Synthesis */
.section-divider {
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 1.5rem;
}

.section-divider::before {
  content: '';
  width: 20px;
  height: 2px;
  background: #6366f1;
  margin-right: 1rem;
}

.synthesis-cards {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.synth-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.synth-card:hover { border-color: rgba(99, 102, 241, 0.3); transform: translateX(5px); }

.synth-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
}

.synth-label { font-size: 0.55rem; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.3rem; }
.synth-title { font-size: 2rem; font-family: 'Cinzel', serif; font-weight: bold; line-height: 1; }
.synth-sub { font-family: 'Outfit', sans-serif; font-size: 0.7rem; color: #fff; margin-left: 0.5rem; }

.synth-bg-num {
  position: absolute;
  right: -10px; top: -10px;
  font-size: 5rem;
  font-family: 'Cinzel', serif;
  opacity: 0.05;
  pointer-events: none;
}

.synth-desc { font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); line-height: 1.4; }

/* Nodes */
.nodes-grid {
  display: flex;
  gap: 0.8rem;
}

.node-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  padding: 1.2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.node-label { font-size: 0.7rem; color: rgba(255, 255, 255, 0.4); }
.node-status { font-size: 0.9rem; font-weight: 600; }

/* Oracle */
.oracle-section {
  margin-top: auto;
  padding-top: 1rem;
}

.oracle-card {
  background: rgba(99, 102, 241, 0.05);
  border-left: 3px solid #6366f1;
  padding: 1.2rem;
  border-radius: 0 12px 12px 0;
  margin-bottom: 1.5rem;
}

.oracle-label { font-size: 0.6rem; color: #6366f1; font-weight: bold; margin-bottom: 0.5rem; }
.oracle-text { font-size: 0.9rem; font-style: italic; color: rgba(255, 255, 255, 0.8); }

.generate-btn {
  width: 100%;
  padding: 1.2rem;
  border-radius: 12px;
  background: #4f46e5;
  border: none;
  color: #fff;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  transition: all 0.3s;
}

.generate-btn:hover { background: #4338ca; transform: translateY(-2px); box-shadow: 0 5px 20px rgba(79, 70, 229, 0.4); }

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.1); opacity: 0.4; }
  100% { transform: scale(1); opacity: 0.2; }
}

@media (max-width: 1200px) {
  .content-grid { grid-template-columns: 1fr; }
  .results-sidebar { border-left: none; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 3rem; }
}

@media (max-width: 992px) {
  .revelation-container { padding: 1rem; }
  .rev-header { flex-direction: column; gap: 1.5rem; text-align: center; }
  .header-actions { justify-content: center; }
  .interactive-chart { width: 350px; height: 350px; }
  .ring-4 { width: 320px; height: 320px; }
  .ring-3 { width: 240px; height: 240px; }
  .ring-2 { width: 140px; height: 140px; }
}

@media (max-width: 768px) {
  .main-title { font-size: 1.4rem; }
  .interactive-chart { width: 280px; height: 280px; }
  .ring-4 { width: 260px; height: 260px; }
  .ring-3 { width: 180px; height: 180px; }
  .center-orb { width: 60px; height: 60px; font-size: 1.4rem; }
  .stats-grid { grid-template-columns: 1fr; }
  .nodes-grid { flex-direction: column; }
  .vibration-info { flex-direction: column; text-align: center; align-items: center; }
  .chart-footer { width: 100%; flex-direction: column-reverse; align-items: center; gap: 2rem; }
  .zoom-controls { flex-direction: row; }
}

@media (max-width: 480px) {
  .cosmic-alert-top { top: 1rem; padding: 0.75rem 1rem; font-size: 0.9rem; }
  .message-tag { font-size: 0.6rem; padding: 0.4rem 0.8rem; }
}
</style>
