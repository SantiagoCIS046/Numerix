<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedPlanLocal = ref(null)
const showNotification = ref(false)
const bootstrapAlert = ref({ show: false, message: '', type: 'info' })

function showAlert(message, type = 'info') {
  bootstrapAlert.value = { show: true, message, type }
  setTimeout(() => {
    bootstrapAlert.value.show = false
  }, 4000)
}

const plans = [
  {
    id: 'lunar',
    name: 'NIVEL LUNAR',
    code: '(LUNAR)',
    price: '$12',
    period: '/LUNA',
    description: 'Primer reflejo: Trabajo de sombras y ciclos lunares básicos para el buscador naciente.',
    features: [
      'TRÁNSITOS DIARIOS',
      'FASE LUNAR PERSONAL',
      'CARTOGRAFÍA BÁSICA'
    ],
    buttonClass: 'btn-outline',
    icon: '🌙'
  },
  {
    id: 'planetario',
    name: 'NIVEL PLANETARIO',
    code: '(PLANETARIO)',
    price: '$34',
    period: '/LUNA',
    description: 'Conciencia orbital: Alineación avanzada con las estrellas errantes de nuestro sistema.',
    features: [
      'CHAT IA ILIMITADO',
      'SINASTRÍA DETALLADA',
      'HORAS PLANETARIAS',
      'ARCHIVOS VITALES'
    ],
    buttonClass: 'btn-blue',
    icon: '🪐',
    highlight: false
  },
  {
    id: 'supernova',
    name: 'NIVEL SUPERNOVA',
    code: '(SUPERNOVA)',
    price: '$88',
    period: '/LUNA',
    description: 'Comunión directa con la fuente. Integración astral total y expansión estelar.',
    features: [
      'CONSULTORÍA ASTRAL DIRECTA',
      'CHAT IA ILIMITADO',
      'GEOMETRÍA PERSONALIZADA',
      'EVENTOS ASTRAL VIP'
    ],
    buttonClass: 'btn-gold',
    icon: '⭐',
    highlight: true,
    tag: 'MÁS RADIANTE'
  }
]

function goBack() {
  router.back()
}

function navigateTo(path) {
  router.push(path)
}

function selectPlan(plan) {
  // Store selected plan temporarily for the payment page
  localStorage.setItem('selectedPlanTemp', JSON.stringify(plan))
  
  // Navigate to Terminal Cósmica (Payments)
  router.push('/pagos')
}
</script>

<template>
  <div class="subscription-page">
    <div class="stars-overlay"></div>
    <div class="nebula-glow"></div>

    <!-- Notification -->
    <div v-if="showNotification" class="notification-astral">
      <div class="notif-content">
        <span class="notif-icon">🌟</span>
        <div>
          <p class="notif-title">ALINEACIÓN EXISTOSA</p>
          <p class="notif-desc">Has ascendido al {{ selectedPlanLocal?.name }}. Reiniciando parámetros cósmicos...</p>
        </div>
      </div>
      <div class="notif-progress"></div>
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

    <header class="sub-header">
      <div class="brand" @click="navigateTo('/home')" style="cursor: pointer;">
        <span class="logo-spark">✦</span>
        <h1 class="brand-name">ASTRA<span>NUMEROLOGY</span></h1>
      </div>
      <nav class="sub-nav">
        <a href="#" @click.prevent="navigateTo('/horoscopo')">HORÓSCOPO</a>
        <a href="#" @click.prevent="navigateTo('/lecturas')">MAPAS</a>
        <a href="#" class="active" @click.prevent="navigateTo('/suscripcion')">DIMENSIONES</a>
        <a href="#" @click.prevent="navigateTo('/revelacion')">EL VACÍO</a>
      </nav>
      <button class="btn-action" @click="goBack">VINCULAR ALMA</button>
    </header>

    <main class="sub-content">
      <p class="section-tag">SUSCRIPCIÓN CELESTIAL</p>
      <h2 class="section-title">DIMENSIONES <span>CÓSMICAS</span></h2>
      <p class="section-desc">
        Alinea tu frecuencia con los cuerpos celestes. Cada dimensión desbloquea<br>
        capas profundas de la geometría astral que rige tu destino.
      </p>

      <div class="plans-grid">
        <div 
          v-for="plan in plans" 
          :key="plan.name" 
          :class="['plan-card', { 'plan-highlight': plan.highlight }]"
        >
          <div v-if="plan.tag" class="plan-tag">{{ plan.tag }}</div>
          
          <div class="plan-header">
            <div class="plan-icon">
              <span class="icon">{{ plan.icon }}</span>
              <div class="icon-ring"></div>
            </div>
            <h3 class="plan-name">{{ plan.name }}</h3>
            <p class="plan-code">{{ plan.code }}</p>
          </div>

          <p class="plan-description">{{ plan.description }}</p>

          <div class="plan-price">
            <span class="currency">{{ plan.price }}</span>
            <span class="period">{{ plan.period }}</span>
          </div>

          <ul class="plan-features">
            <li v-for="feature in plan.features" :key="feature">
              <span class="feature-icon">✨</span>
              {{ feature }}
            </li>
          </ul>

          <button :class="['btn-plan', plan.buttonClass]" @click="selectPlan(plan)">
            ASCENDER AHORA
          </button>
        </div>
      </div>
    </main>

    <footer class="sub-footer">
      <div class="footer-grid">
        <div class="footer-item">
          <span class="footer-icon">🏰</span>
          <h4>SABIDURÍA ANCESTRAL</h4>
          <p>ALGORITMOS BASADOS EN 4.000 AÑOS DE CIENCIA CALDEA.</p>
        </div>
        <div class="footer-item">
          <span class="footer-icon">🛡️</span>
          <h4>PROTECCIÓN DEL ALMA</h4>
          <p>BÓVEDAS DE DATOS ESPIRITUALES ENCRIPTADOS.</p>
        </div>
        <div class="footer-item">
          <span class="footer-icon">📡</span>
          <h4>EFEMÉRIDES DIARIAS</h4>
          <p>FLUJOS DE DATOS PRECISOS DE OBSERVATORIOS GLOBALES.</p>
        </div>
        <div class="footer-item">
          <span class="footer-icon">📑</span>
          <h4>SINCRONÍA ETÉREA</h4>
          <p>ALERTAS EN TIEMPO REAL DE CAMBIOS ASTRALES.</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 ASTRA SYSTEMS // COORDENADAS 34.0522° N, 118.2437° W</p>
        <div class="footer-links">
          <a href="#" @click.prevent="showAlert('Protocolos de cifrado cuántico activos.', 'info')">PROTOCOLOS DEL VACÍO</a>
          <a href="#" @click.prevent="showAlert('Términos regidos por la ley galáctica de 2024.', 'info')">TÉRMINOS ASTRALES</a>
          <a href="#" @click.prevent="showAlert('Cookies residuales del Big Bang aceptadas.', 'info')">COOKIES NEURALES</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&display=swap');

.subscription-page {
  min-height: 100vh;
  background-color: #050508;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.stars-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 100px 150px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 200px 80px, #fff, rgba(0,0,0,0));
  background-size: 300px 300px;
  opacity: 0.15;
  pointer-events: none;
}

.nebula-glow {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 150vw; height: 150vh;
  background: radial-gradient(circle, rgba(20, 25, 60, 0.4) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* Notification */
.notification-astral {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  background: rgba(15, 20, 35, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(251, 191, 36, 0.3);
  padding: 1.5rem 2rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(251, 191, 36, 0.1);
  animation: slideInNotif 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notif-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notif-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 10px #fbbf24);
}

.notif-title {
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  letter-spacing: 2px;
  color: #fbbf24;
  margin-bottom: 0.3rem;
  font-weight: 700;
}

.notif-desc {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.7);
}

.notif-progress {
  height: 2px;
  background: #fbbf24;
  width: 0%;
  animation: progressNotif 4s linear;
}

@keyframes slideInNotif {
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes progressNotif {
  from { width: 0%; }
  to { width: 100%; }
}

/* Header */
.sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 5%;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-spark {
  font-size: 1.5rem;
  color: #fff;
  text-shadow: 0 0 10px rgba(255,255,255,0.5);
}

.brand-name {
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  letter-spacing: 4px;
  font-weight: 400;
}

.brand-name span {
  font-weight: 700;
  color: rgba(255,255,255,0.6);
}

.sub-nav {
  display: flex;
  gap: 3rem;
}

.sub-nav a {
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  font-size: 0.75rem;
  letter-spacing: 3px;
  font-weight: 600;
  transition: color 0.3s;
  padding-bottom: 5px;
  position: relative;
}

.sub-nav a:hover, .sub-nav a.active {
  color: #fff;
}

.sub-nav a.active::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 1px;
  background: #fff;
}

.btn-action {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 0.75rem 2rem;
  color: #fff;
  font-size: 0.7rem;
  letter-spacing: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-action:hover {
  background: #fff;
  color: #000;
}

/* Main Content */
.sub-content {
  text-align: center;
  padding: 4rem 5% 8rem;
  z-index: 5;
}

.section-tag {
  color: #6366f1;
  font-size: 0.7rem;
  letter-spacing: 5px;
  margin-bottom: 2rem;
  font-weight: 600;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 5rem;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  font-weight: 400;
}

.section-title span {
  font-style: italic;
  font-weight: 700;
  opacity: 0.9;
}

.section-desc {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 6rem;
}

/* Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.plan-card {
  background: rgba(15, 20, 35, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 4px;
  padding: 4rem 3rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.4s;
}

.plan-card:hover {
  border-color: rgba(255,255,255,0.2);
  transform: translateY(-10px);
  background: rgba(20, 25, 45, 0.6);
}

.plan-tag {
  position: absolute;
  top: 2rem; right: 2rem;
  font-size: 0.6rem;
  color: #fbbf24;
  letter-spacing: 2px;
  font-weight: 700;
}

.plan-icon {
  width: 60px; height: 60px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2.5rem;
  position: relative;
}

.icon { font-size: 1.5rem; }

.icon-ring {
  position: absolute;
  width: 140%; height: 140%;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 50%;
}

.plan-name {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.plan-code {
  font-size: 0.65rem;
  color: #6366f1;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  font-weight: 600;
}

.plan-description {
  font-size: 0.95rem;
  font-style: italic;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
  margin-bottom: 3rem;
  min-height: 4.8rem;
}

.plan-price {
  margin-bottom: 4rem;
}

.currency {
  font-family: 'Cinzel', serif;
  font-size: 3.5rem;
  font-weight: bold;
}

.period {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 2px;
  margin-left: 0.5rem;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 5rem 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.plan-features li {
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.feature-icon { font-size: 0.8rem; opacity: 0.4; }

.btn-plan {
  margin-top: auto;
  padding: 1.2rem;
  border-radius: 4px;
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  letter-spacing: 3px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
}

.plan-highlight {
  background: rgba(20, 25, 45, 0.6);
  border: 1px solid rgba(251, 191, 36, 0.2);
  box-shadow: 0 0 60px rgba(251, 191, 36, 0.05);
}

.plan-highlight .plan-icon {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
}

.btn-blue {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.3);
}

.btn-blue:hover {
  background: #6366f1;
  color: #fff;
}

.btn-gold {
  background: #fbbf24;
  color: #000;
  border: none;
}

.btn-gold:hover {
  background: #f59e0b;
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.4);
}

/* Footer */
.sub-footer {
  margin-top: auto;
  padding: 6rem 5% 4rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4rem;
  margin-bottom: 6rem;
}

.footer-item {
  text-align: left;
}

.footer-icon {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.footer-item h4 {
  font-size: 0.8rem;
  letter-spacing: 2px;
  margin-bottom: 1rem;
}

.footer-item p {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.4);
  line-height: 1.6;
  letter-spacing: 1px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.02);
  font-size: 0.65rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 1px;
}

.footer-links {
  display: flex;
  gap: 3rem;
}

.footer-links a {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover { color: #fff; }

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

@media (max-width: 1200px) {
  .plans-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .section-title { font-size: 3rem; }
  .plans-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; }
  .sub-nav { display: none; }
}
</style>
