<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- STATE ---
const cardHolder = ref('')
const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const paymentMethod = ref('card') // 'card' or 'digital'
const isSyncing = ref(false)
const bootstrapAlert = ref({ show: false, message: '', type: 'danger' })
const selectedPlan = ref(null)

const availablePlans = [
  { id: 'lunar', name: 'NIVEL LUNAR', priceUSD: 12, icon: '🌙' },
  { id: 'planetario', name: 'NIVEL PLANETARIO', priceUSD: 34, icon: '🪐' },
  { id: 'supernova', name: 'NIVEL SUPERNOVA', priceUSD: 88, icon: '⭐' }
]

const exchangeRates = {
  'CO': { rate: 3950, symbol: 'COL$', name: 'PESOS COLOMBIANOS' },
  'ES': { rate: 0.92, symbol: '€', name: 'EUROS' },
  'EU': { rate: 0.92, symbol: '€', name: 'EUROS' },
  'MX': { rate: 17.10, symbol: 'MX$', name: 'PESOS MEXICANOS' },
  'AR': { rate: 840, symbol: 'ARS$', name: 'PESOS ARGENTINOS' },
  'CL': { rate: 940, symbol: 'CLP$', name: 'PESOS CHILENOS' },
  'PE': { rate: 3.80, symbol: 'PEN$', name: 'SOLES' },
  'US': { rate: 1, symbol: 'USD$', name: 'DÓLARES' }
}

const userAlignment = ref({ country: 'CO' })

function loadUserAlignment() {
  const stored = localStorage.getItem('alignmentProfile')
  if (stored) {
    userAlignment.value = JSON.parse(stored)
  }
}

const userCurrency = computed(() => {
  return exchangeRates[userAlignment.value.country] || exchangeRates['US']
})

const currentPlan = ref(null)

function loadCurrentPlan() {
  const stored = localStorage.getItem('selectedPlanTemp')
  if (stored) {
    currentPlan.value = JSON.parse(stored)
  } else {
    currentPlan.value = null
  }
}

// Initial load
loadUserAlignment()
loadCurrentPlan()

const convertedDetails = computed(() => {
  if (!currentPlan.value) return null
  const usdPrice = typeof currentPlan.value.price === 'string' 
    ? parseFloat(currentPlan.value.price.replace('$', '')) 
    : (currentPlan.value.priceUSD || 0)
  
  const converted = usdPrice * userCurrency.value.rate
  return {
    usd: usdPrice,
    local: converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }),
    symbol: userCurrency.value.symbol,
    currencyName: userCurrency.value.name
  }
})

function selectManualPlan(plan) {
  currentPlan.value = plan
  localStorage.setItem('selectedPlanTemp', JSON.stringify(plan))
}

function changePlan() {
  currentPlan.value = null
  localStorage.removeItem('selectedPlanTemp')
}

function updateCountry(countryCode) {
  userAlignment.value.country = countryCode
  // Optionally update alignment profile too
  const stored = localStorage.getItem('alignmentProfile')
  const profile = stored ? JSON.parse(stored) : {}
  profile.country = countryCode
  localStorage.setItem('alignmentProfile', JSON.stringify(profile))
}

// --- FORMATTERS ---
const formattedCardNumber = computed(() => {
  if (!cardNumber.value) return 'XXXX XXXX XXXX XXXX'
  const cleaned = cardNumber.value.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(' ') : cleaned
})

const displayCardHolder = computed(() => cardHolder.value || 'NOMBRE DEL NAVEGANTE')

// --- ACTIONS ---
function showAlert(message, type = 'danger') {
  bootstrapAlert.value = { show: true, message, type }
  setTimeout(() => {
    bootstrapAlert.value.show = false
  }, 5000)
}

function handleSync() {
  if (!cardHolder.value || !cardNumber.value) {
    showAlert('Por favor, complete los campos de sincronización astral.')
    return
  }
  
  isSyncing.value = true
  
  // Simulation of cosmic transaction
  setTimeout(() => {
    const finalPlan = selectedPlan.value
    localStorage.setItem('userSubscription', JSON.stringify({
      id: finalPlan.id,
      name: finalPlan.name,
      date: new Date().toISOString(),
      status: 'active'
    }))
    
    isSyncing.value = false
    showAlert('¡Sincronización Exitosa! Tu alma ha ascendido.', 'success')
    
    setTimeout(() => {
      router.push('/home')
    }, 2000)
  }, 3000)
}

function navigateBack() {
  router.push('/suscripcion')
}
function goHome() {
  router.push('/home')
}
</script>

<template>
  <div class="terminal-page">
    <div class="stars-bg"></div>
    <div class="scanline"></div>

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

    <header class="terminal-header">
      <div class="nav-actions-left">
        <button class="back-btn-minimal" @click="navigateBack">
          <span class="arrow">←</span> VOLVER A PLANES
        </button>
      </div>
      <div class="logo" @click="goHome" style="cursor: pointer;">
        <span class="logo-icon">✨</span>
        <div class="logo-text">
          <h1>TERMINAL CÓSMICA</h1>
          <p>TRANSACCIÓN ASTRAL ASEGURADA</p>
        </div>
      </div>
      <div class="status">
        <span class="status-label">ORIGEN_DETECTADO</span>
        <span class="status-val">{{ userAlignment.country }} // {{ userCurrency.name }} <span class="dot"></span></span>
      </div>
    </header>

    <main class="terminal-grid">
      <!-- Left: Form or Plan Selection -->
      <section class="payment-form">
        <!-- PLAN SELECTION IF NONE -->
        <div v-if="!currentPlan" class="plan-picker-overlay">
          <h3 class="picker-title">SELECCIONA TU DIMENSIÓN</h3>
          <div class="plan-mini-grid">
            <div 
              v-for="plan in availablePlans" 
              :key="plan.id"
              class="plan-mini-card"
              @click="selectManualPlan(plan)"
            >
              <span class="mini-icon">{{ plan.icon }}</span>
              <p class="mini-name">{{ plan.name }}</p>
              <p class="mini-price">${{ plan.priceUSD }}</p>
            </div>
          </div>
        </div>

        <div v-else class="order-summary-box">
          <div class="summary-header">
            <span class="header-tag">RESUMEN DE ORDEN</span>
            <button class="change-plan-btn" @click="changePlan">CAMBIAR</button>
          </div>
          <div class="summary-content">
            <div class="plan-info-row">
              <span class="plan-main-name">{{ currentPlan.name }}</span>
              <span class="plan-usd-val">${{ convertedDetails.usd }} USD</span>
            </div>
            <div class="currency-conversion-row">
              <span class="conv-label">VALOR EN TU MONEDA:</span>
              <div class="conv-val-box">
                <span class="conv-val">{{ convertedDetails.symbol }} {{ convertedDetails.local }}</span>
                <select 
                  class="country-mini-select" 
                  :value="userAlignment.country" 
                  @change="updateCountry($event.target.value)"
                >
                  <option v-for="(info, code) in exchangeRates" :key="code" :value="code">
                    {{ code }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="tabs">
          <button 
            :class="['tab', { active: paymentMethod === 'card' }]"
            @click="paymentMethod = 'card'"
          >
            💳 Tarjeta Astral
          </button>
          <button 
            :class="['tab', { active: paymentMethod === 'digital' }]"
            @click="paymentMethod = 'digital'"
          >
            📱 Billetera Digital
          </button>
        </div>

        <div class="form-content">
          <div class="input-group">
            <label>NOMBRE DE AUTORIDAD DEL NAVEGANTE</label>
            <div class="input-wrapper">
              <input type="text" v-model="cardHolder" placeholder="ELARA VANCE" maxlength="25">
              <span class="input-icon">👤</span>
            </div>
          </div>

          <div class="input-group">
            <label>ID DE SECUENCIA INTERESTELAR</label>
            <div class="input-wrapper">
              <input type="text" v-model="cardNumber" placeholder="XXXX XXXX XXXX XXXX" maxlength="16">
              <span class="input-icon">🔑</span>
            </div>
          </div>

          <div class="form-row">
            <div class="input-group">
              <label>LÍMITE TEMPORAL</label>
              <div class="input-wrapper">
                <input type="text" v-model="expiryDate" placeholder="MM/YY" maxlength="5">
                <span class="input-icon">📅</span>
              </div>
            </div>
            <div class="input-group">
              <label>CIFRADO DE ACCESO</label>
              <div class="input-wrapper">
                <input type="password" v-model="cvv" placeholder="***" maxlength="3">
                <span class="input-icon">🔒</span>
              </div>
            </div>
          </div>

          <button class="sync-btn" @click="handleSync" :disabled="isSyncing">
            <span v-if="!isSyncing">⚡ SINCRONIZAR ACTIVOS</span>
            <span v-else class="loader">SINCRONIZANDO CON LA RED VESTA...</span>
          </button>

          <div class="alternative-payments">
            <p class="alt-label">O VINCULAR VÍA NODO DIGITAL</p>
            <div class="alt-grid">
              <div class="alt-item" @click="showAlert('Apple Pay se está sincronizando con tu ID Estelar.', 'info')"><span>🍎</span> APPLE PAY</div>
              <div class="alt-item" @click="showAlert('Billetera Universal en fase de acoplamiento.', 'info')"><span>💳</span> BILLETERA</div>
              <div class="alt-item" @click="showAlert('Protocolo Cripto Leya-7 activándose.', 'info')"><span>₿</span> CRIPTO</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Right: Card Preview -->
      <section class="preview-panel">
        <div class="astral-card" :class="{ 'card-syncing': isSyncing }">
          <div class="card-glass"></div>
          <div class="card-chip"></div>
          <div class="card-shimmer"></div>
          
          <div class="card-header">
             <span class="rocket">🚀</span>
          </div>

          <div class="card-number">{{ formattedCardNumber }}</div>

          <div class="card-footer">
            <div class="info-block">
              <p class="label">NOMBRE DE AUTORIDAD</p>
              <p class="val">{{ displayCardHolder }}</p>
            </div>
            <div class="info-block">
              <p class="label">VÁLIDO HASTA</p>
              <p class="val">{{ expiryDate || '12 / 29' }}</p>
            </div>
          </div>
        </div>

        <div class="security-info">
          <div class="sec-item">
            <p class="sec-label">ÍNDICE DE ACTIVOS</p>
            <p class="sec-val">#A9-Z02</p>
          </div>
          <div class="sec-item">
            <p class="sec-label">NIVEL DE SEGURIDAD</p>
            <p class="sec-val highlight">QUANTUM_L5</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="terminal-footer">
      <p>IMPULSADO POR EL PROTOCOLO LEDGER CÓSMICO</p>
      <div class="footer-icons">🛡️ 🔒 ✔️</div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&family=Space+Mono&display=swap');

.terminal-page {
  min-height: 100vh;
  background-color: #050510;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.stars-bg {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: 
    radial-gradient(1px 1px at 10% 20%, #fff 100%, transparent),
    radial-gradient(1px 1px at 50% 50%, #fff 100%, transparent),
    radial-gradient(1.5px 1.5px at 80% 30%, #fff 100%, transparent);
  background-size: 300px 300px;
  opacity: 0.1;
  z-index: 0;
}

.scanline {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(130, 80, 255, 0.05) 50%, transparent 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 10;
  opacity: 0.3;
}

/* Header */
.terminal-header {
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: rgba(5, 5, 16, 0.8);
  backdrop-filter: blur(10px);
  z-index: 20;
}

.logo { display: flex; align-items: center; gap: 1rem; }
.logo-icon { font-size: 1.5rem; }
.logo-text h1 { font-family: 'Cinzel', serif; font-size: 1rem; letter-spacing: 3px; margin: 0; }
.logo-text p { font-size: 0.6rem; letter-spacing: 2px; color: #8257ff; margin: 0; font-weight: 700; }

.status { text-align: right; }
.status-label { font-size: 0.6rem; color: rgba(255,255,255,0.4); display: block; letter-spacing: 2px; margin-bottom: 0.3rem; }
.status-val { font-family: 'Space Mono', monospace; font-size: 0.75rem; color: #8257ff; }
.dot { display: inline-block; width: 6px; height: 6px; background: #8257ff; border-radius: 50%; margin-left: 0.5rem; animation: blink 1s infinite; }

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* Nav Actions */
.nav-actions-left {
  display: flex;
  align-items: center;
}

.back-btn-minimal {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-size: 0.7rem;
  letter-spacing: 2px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn-minimal:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

.settings-btn { background: transparent; border: none; font-size: 1.2rem; cursor: pointer; color: rgba(255,255,255,0.4); transition: 0.3s; }
.settings-btn:hover { color: #fff; transform: rotate(45deg); }

/* Grid Layout */
.terminal-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4rem 8%;
  gap: 6rem;
  align-items: center;
  z-index: 5;
}

/* Form Styles */
.payment-form {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 3rem;
  width: 100%;
  max-width: 550px;
  position: relative;
  box-sizing: border-box;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Plan Picker */
.plan-picker-overlay {
  text-align: center;
  margin-bottom: 2rem;
}

.picker-title {
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  letter-spacing: 3px;
  color: #8257ff;
  margin-bottom: 1.5rem;
}

.plan-mini-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.plan-mini-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.plan-mini-card:hover {
  background: rgba(130, 87, 255, 0.1);
  border-color: #8257ff;
  transform: translateY(-3px);
}

.mini-icon { font-size: 1.5rem; display: block; margin-bottom: 0.5rem; }
.mini-name { font-size: 0.6rem; letter-spacing: 1px; color: rgba(255,255,255,0.6); margin: 0; }
.mini-price { font-weight: bold; font-size: 1rem; margin: 0.5rem 0 0; }

/* Order Summary */
.order-summary-box {
  background: rgba(130, 87, 255, 0.05);
  border: 1px dashed rgba(130, 87, 255, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-tag {
  font-size: 0.6rem;
  letter-spacing: 2px;
  font-weight: 700;
  color: #8257ff;
}

.change-plan-btn {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 0.6rem;
  letter-spacing: 1px;
  cursor: pointer;
  text-decoration: underline;
}

.plan-info-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.plan-main-name {
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Cinzel', serif;
}

.plan-usd-val {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
}

.currency-conversion-row {
  border-top: 1px solid rgba(255,255,255,0.05);
  padding-top: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conv-label {
  font-size: 0.65rem;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.4);
}

.conv-val-box {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.country-mini-select {
  background: rgba(130, 80, 255, 0.1);
  border: 1px solid rgba(130, 80, 255, 0.3);
  color: #8257ff;
  font-size: 0.6rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
}

.country-mini-select:hover {
  background: rgba(130, 80, 255, 0.2);
}

.conv-val {
  font-size: 1.2rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 0 10px rgba(130, 80, 255, 0.4);
}

.tabs {
  display: flex;
  background: rgba(0,0,0,0.3);
  padding: 0.4rem;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.tab {
  flex: 1;
  padding: 1rem;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  border-radius: 6px;
  transition: 0.3s;
}

.tab.active {
  background: #582acc;
  color: #fff;
  box-shadow: 0 4px 15px rgba(88, 42, 204, 0.3);
}

.input-group { 
  margin-bottom: 2rem; 
  width: 100%;
  display: flex;
  flex-direction: column;
}

.input-group label { 
  display: block; 
  font-size: 0.65rem; 
  letter-spacing: 2px; 
  color: rgba(255,255,255,0.4); 
  margin-bottom: 0.8rem; 
  text-transform: uppercase;
}

.input-wrapper { 
  position: relative; 
  width: 100%;
}

.input-wrapper input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1.2rem 1.5rem;
  padding-right: 3.5rem;
  border-radius: 8px;
  color: #fff;
  font-family: 'Space Mono', monospace;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-wrapper input:focus { 
  border-color: #8257ff; 
  background: rgba(130, 87, 255, 0.08); 
  outline: none;
  box-shadow: 0 0 15px rgba(130, 80, 255, 0.2);
}

.input-icon { 
  position: absolute; 
  right: 1.5rem; 
  top: 50%; 
  transform: translateY(-50%); 
  opacity: 0.4; 
  font-size: 1.1rem;
  pointer-events: none;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }

.sync-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 1.5rem;
  background: #582acc;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-weight: bold;
  letter-spacing: 3px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.3s;
}
.sync-btn:hover:not(:disabled) { background: #6a34eb; box-shadow: 0 0 30px rgba(88, 42, 204, 0.4); transform: translateY(-2px); }
.sync-btn:disabled { opacity: 0.7; cursor: wait; }

.alternative-payments { margin-top: 4rem; text-align: center; }
.alt-label { font-size: 0.6rem; color: rgba(255,255,255,0.3); letter-spacing: 2px; margin-bottom: 2rem; }
.alt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.alt-item {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 1.5rem 0.5rem;
  border-radius: 8px;
  font-size: 0.6rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.3s;
  color: rgba(255,255,255,0.5);
}
.alt-item:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #fff; }
.alt-item span { display: block; font-size: 1.2rem; margin-bottom: 0.5rem; }

/* Card Preview */
.preview-panel { display: flex; flex-direction: column; align-items: center; }

.astral-card {
  width: 500px;
  height: 300px;
  background: linear-gradient(135deg, #1a1a3a 0%, #050510 100%);
  border: 1px solid rgba(130, 80, 255, 0.4);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(88, 42, 204, 0.2);
  transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.astral-card:hover { transform: translateY(-10px) rotateX(5deg) rotateY(-5deg); border-color: #8257ff; }

.card-syncing { animation: cardPulse 1.5s infinite alternate; }
@keyframes cardPulse { from { box-shadow: 0 0 20px rgba(130, 80, 255, 0.2); } to { box-shadow: 0 0 60px rgba(130, 80, 255, 0.6); transform: scale(1.02); } }

.card-glass { position: absolute; inset: 0; background: radial-gradient(circle at 0% 0%, rgba(255,255,255,0.05) 0%, transparent 100%); }
.card-chip { width: 45px; height: 35px; background: linear-gradient(135deg, #fcd34d 0%, #b45309 100%); border-radius: 6px; position: relative; }
.card-shimmer { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.05) 50%, transparent 55%); animation: shimmer 8s infinite; }

@keyframes shimmer { 0% { transform: translateX(-30%) translateY(-30%); } 100% { transform: translateX(30%) translateY(30%); } }

.rocket { position: absolute; top: 2.5rem; right: 2.5rem; font-size: 1.5rem; opacity: 0.3; }

.card-number {
  font-family: 'Space Mono', monospace;
  font-size: 1.8rem;
  letter-spacing: 4px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  margin-top: 2rem;
}

.card-footer { display: flex; justify-content: space-between; align-items: flex-end; }
.info-block .label { font-size: 0.5rem; letter-spacing: 2px; color: rgba(255,255,255,0.4); margin-bottom: 0.3rem;}
.info-block .val { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

.security-info { margin-top: 4rem; display: flex; gap: 4rem; text-align: center; }
.sec-label { font-size: 0.6rem; color: rgba(255,255,255,0.3); letter-spacing: 1px; margin-bottom: 0.5rem; }
.sec-val { font-family: 'Space Mono', monospace; font-size: 0.8rem; }
.highlight { color: #8257ff; font-weight: bold; }

.terminal-footer {
  padding: 2rem;
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.05);
  font-size: 0.6rem;
  color: rgba(255,255,255,0.2);
  letter-spacing: 3px;
}
.footer-icons { margin-top: 0.8rem; font-size: 1rem; opacity: 0.4; }

@media (max-width: 1200px) {
  .terminal-grid { grid-template-columns: 1fr; gap: 4rem; }
  .astral-card { width: 100%; max-width: 500px; }
}

.loader { display: flex; align-items: center; justify-content: center; gap: 1rem; }
.loader::after { content: ''; width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
