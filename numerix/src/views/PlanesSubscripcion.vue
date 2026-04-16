<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

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

const plans = computed(() => {
  return [
    {
      id: 'lunar',
      _id: '69c4a1de947a181d05f503f8', // 🆔 ID Real MongoDB
      name: 'NIVEL LUNAR',
      code: t('subscriptions.plans.lunar.code'),
      price: '$12',
      period: '/LUNA',
      description: t('subscriptions.plans.lunar.description'),
      features: t('subscriptions.plans.lunar.features'),
      buttonClass: 'btn-outline',
      icon: '🌙'
    },
    {
      id: 'planetario',
      _id: '69c4a1de947a181d05f503f9', // 🆔 ID Real MongoDB
      name: 'NIVEL PLANETARIO',
      code: t('subscriptions.plans.planetario.code'),
      price: '$34',
      period: '/LUNA',
      description: t('subscriptions.plans.planetario.description'),
      features: t('subscriptions.plans.planetario.features'),
      buttonClass: 'btn-blue',
      icon: '🪐',
      highlight: false
    },
    {
      id: 'supernova',
      _id: '69c4a1de947a181d05f503fa', // 🆔 ID Real MongoDB
      name: 'NIVEL SUPERNOVA',
      code: t('subscriptions.plans.supernova.code'),
      price: '$88',
      period: '/LUNA',
      description: t('subscriptions.plans.supernova.description'),
      features: t('subscriptions.plans.supernova.features'),
      buttonClass: 'btn-gold',
      icon: '⭐',
      highlight: true,
      tag: t('subscriptions.plans.supernova.tag')
    }
  ]
})


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
          <p class="notif-title">{{ t('subscriptions.notifTitle') }}</p>
          <p class="notif-desc">{{ t('subscriptions.notifDesc', { plan: selectedPlanLocal?.name }) }}</p>
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
        <a href="#" @click.prevent="navigateTo('/horoscopo')">{{ t('horoscope.title') }}</a>
        <a href="#" @click.prevent="navigateTo('/lecturas')">{{ t('history.nav.arcana') }}</a>
        <a href="#" class="active" @click.prevent="navigateTo('/suscripcion')">{{ t('subscriptions.title') }}</a>
        <a href="#" @click.prevent="navigateTo('/revelacion')">{{ t('nav.history') }}</a>
      </nav>
      <div class="header-actions">
        <button class="btn-action-alt" @click="navigateTo('/home')">{{ t('nav.back') }}</button>
        <button class="btn-action" @click="navigateTo('/historial-pagos')">{{ t('subscriptions.historyBtn') }}</button>
      </div>
    </header>

    <main class="sub-content">
      <p class="section-tag">{{ t('subscriptions.heroTag') }}</p>
      <h2 class="section-title">{{ t('subscriptions.title') }}</h2>
      <p class="section-desc">
        {{ t('subscriptions.desc') }}
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
            {{ t('subscriptions.ascendBtn') }}
          </button>
        </div>
      </div>
    </main>

    <footer class="sub-footer">
      <div class="footer-grid">
        <div class="footer-item">
          <span class="footer-icon">🏰</span>
          <h4>{{ t('subscriptions.footer.wisdom') }}</h4>
          <p>{{ t('subscriptions.footer.wisdomDesc') }}</p>
        </div>
        <div class="footer-item">
          <span class="footer-icon">🛡️</span>
          <h4>{{ t('subscriptions.footer.protection') }}</h4>
          <p>{{ t('subscriptions.footer.protectionDesc') }}</p>
        </div>
        <div class="footer-item">
          <span class="footer-icon">📡</span>
          <h4>{{ t('subscriptions.footer.ephemeris') }}</h4>
          <p>{{ t('subscriptions.footer.ephemerisDesc') }}</p>
        </div>
        <div class="footer-item">
          <span class="footer-icon">📑</span>
          <h4>{{ t('subscriptions.footer.sync') }}</h4>
          <p>{{ t('subscriptions.footer.syncDesc') }}</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 ASTRA SYSTEMS // COORDENADAS 34.0522° N, 118.2437° W</p>
        <div class="footer-links">
          <a href="#" @click.prevent="showAlert(t('subscriptions.footer.voidAlert'), 'info')">{{ t('subscriptions.footer.voidProt') }}</a>
          <a href="#" @click.prevent="showAlert(t('subscriptions.footer.termsAlert'), 'info')">{{ t('subscriptions.footer.astralTerms') }}</a>
          <a href="#" @click.prevent="showAlert(t('subscriptions.footer.cookiesAlert'), 'info')">{{ t('subscriptions.footer.cookies') }}</a>
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
  font-size: 1rem;
  letter-spacing: 3px;
  font-weight: 400;
}


.brand-name span {
  font-weight: 700;
  color: rgba(255,255,255,0.6);
}

.sub-nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}


.sub-nav a {
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  font-size: 0.7rem;
  letter-spacing: 2px;
  font-weight: 600;
  transition: color 0.3s;
  padding-bottom: 8px;
  position: relative;
  text-transform: uppercase;
  white-space: nowrap;
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

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-action-alt {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.75rem 2rem;
  color: rgba(255,255,255,0.7);
  font-size: 0.7rem;
  letter-spacing: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-action-alt:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255,255,255,0.5);
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
  padding: 1.5rem 5% 4rem;
  z-index: 5;
}



.section-tag {
  color: #6366f1;
  font-size: 0.65rem;
  letter-spacing: 4px;
  margin-bottom: 1rem;
  font-weight: 600;
}


.section-title {
  font-family: 'Cinzel', serif;
  font-size: 2.8rem;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  font-weight: 400;
}



.section-title span {
  font-style: italic;
  font-weight: 700;
  opacity: 0.9;
}

.section-desc {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto 3rem;
}



/* Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}


.plan-card {
  background: rgba(15, 20, 35, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 4px;
  padding: 2rem 1.5rem;
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
  width: 45px; height: 45px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.2rem;
  position: relative;
}

.icon { font-size: 1.2rem; }

.icon-ring {
  position: absolute;
  width: 140%; height: 140%;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 50%;
}

.plan-name {
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  letter-spacing: 2px;
  margin-bottom: 0.3rem;
}



.plan-code {
  font-size: 0.65rem;
  color: #6366f1;
  letter-spacing: 2px;
  margin-bottom: 0.8rem;
  font-weight: 600;
}


.plan-description {
  font-size: 0.85rem;
  font-style: italic;
  color: rgba(255,255,255,0.5);
  line-height: 1.5;
  margin-bottom: 1rem;
  min-height: 3.5rem;
}


.plan-price {
  margin-bottom: 2rem;

}

.currency {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
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
  margin: 0 0 1.5rem 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}




.plan-features li {
  font-size: 0.65rem;
  letter-spacing: 1.2px;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;

  display: flex;
  align-items: center;
  gap: 1rem;
}

.feature-icon { font-size: 0.8rem; opacity: 0.4; }

.btn-plan {
  margin-top: auto;
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  letter-spacing: 2px;
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
  gap: 2rem;
  text-transform: uppercase;
  font-size: 0.6rem;
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
