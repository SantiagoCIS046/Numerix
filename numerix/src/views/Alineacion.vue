<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const router = useRouter()
const isFromHome = ref(false)

onMounted(() => {
  // history.state is populated by vue-router when using push with state
  if (history.state && history.state.fromHome) {
    isFromHome.value = true
  }
})

function goBackToHome() {
  router.push('/home')
}


// Pre-fill name and birth date from logged-in user
const storedUser = localStorage.getItem('user')
const loggedUser = storedUser ? JSON.parse(storedUser) : null

// Also check for previously saved alignment profile
const storedAlignment = localStorage.getItem('alignmentProfile')
const savedAlignment = storedAlignment ? JSON.parse(storedAlignment) : null

// Format fecha_nacimiento (YYYY-MM-DD) if it exists
const rawFecha = loggedUser?.fecha_nacimiento || ''
const preFillDate = rawFecha
  ? rawFecha.split('T')[0] // Handle ISO strings like "2000-01-15T00:00:00.000Z"
  : (savedAlignment?.birthDate || '')

const formData = ref({
  fullName: savedAlignment?.fullName || loggedUser?.nombre || loggedUser?.name || '',
  birthDate: preFillDate,
  birthTime: savedAlignment?.birthTime || '',
  path: savedAlignment?.path || 'solar',      // 'solar' | 'lunar'
  auraDensity: savedAlignment?.auraDensity || 'fluida',
  cosmicVision: savedAlignment?.cosmicVision || '',
  country: savedAlignment?.country || 'CO'    // Default to Colombia
})

const countries = [
  { code: 'CO', name: 'COLOMBIA', currency: 'COP', flag: '🇨🇴' },
  { code: 'ES', name: 'ESPAÑA', currency: 'EUR', flag: '🇪🇸' },
  { code: 'US', name: 'ESTADOS UNIDOS', currency: 'USD', flag: '🇺🇸' },
  { code: 'MX', name: 'MÉXICO', currency: 'MXN', flag: '🇲🇽' },
  { code: 'AR', name: 'ARGENTINA', currency: 'ARS', flag: '🇦🇷' },
  { code: 'CL', name: 'CHILE', currency: 'CLP', flag: '🇨🇱' },
  { code: 'PE', name: 'PERÚ', currency: 'PEN', flag: '🇵🇪' },
  { code: 'EU', name: 'EUROPA (OTRO)', currency: 'EUR', flag: '🇪🇺' }
]

const auraOptions = [
  { id: 'eterea',    label: 'ETÉREA',     icon: '☁️' },
  { id: 'fluida',    label: 'FLUIDA',     icon: '🌊' },
  { id: 'cristalina',label: 'CRISTALINA', icon: '💎' },
  { id: 'nebulosa',  label: 'NEBULOSA',   icon: '🌫️' }
]

const bootstrapAlert = ref({ show: false, message: '', type: 'danger' })

function showAlert(message, type = 'danger') {
  bootstrapAlert.value = { show: true, message, type }
  setTimeout(() => {
    bootstrapAlert.value.show = false
  }, 5000)
}

// Dynamic status based on completion
const formStatus = computed(() => {
  const d = formData.value
  if (!d.fullName || !d.birthDate) return 'DATOS INCOMPLETOS'
  if (!d.cosmicVision) return 'CALIBRACIÓN EN PROGRESO'
  return 'CALIBRACIÓN COMPLETA'
})

const statusClass = computed(() => ({
  'status-complete': formStatus.value === 'CALIBRACIÓN COMPLETA',
  'status-progress': formStatus.value === 'CALIBRACIÓN EN PROGRESO',
  'status-incomplete': formStatus.value === 'DATOS INCOMPLETOS',
}))

function handleSubmit() {
  if (!formData.value.fullName) {
    showAlert('Por favor ingresa tu nombre completo.')
    return
  }
  if (!formData.value.birthDate) {
    showAlert('La fecha de nacimiento es requerida.')
    return
  }

  // Save alignment profile to localStorage
  localStorage.setItem('alignmentProfile', JSON.stringify({
    ...formData.value,
    savedAt: new Date().toISOString()
  }))

  showAlert('¡Alineación exitosa! Sincronizando con el Nodo Principal...', 'success')
  
  setTimeout(() => {
    router.push('/home')
  }, 2000)
}

const showCountryDropdown = ref(false)
const selectedCountryObj = computed(() => {
  return countries.find(c => c.code === formData.value.country) || countries[0]
})

function toggleCountryDropdown() {
  showCountryDropdown.value = !showCountryDropdown.value
}

function selectCountry(code) {
  formData.value.country = code
  showCountryDropdown.value = false
}

function resetForm() {
  formData.value = {
    fullName: savedAlignment?.fullName || loggedUser?.nombre || loggedUser?.name || '',
    birthDate: preFillDate,
    birthTime: savedAlignment?.birthTime || '',
    path: savedAlignment?.path || 'solar',
    auraDensity: savedAlignment?.auraDensity || 'fluida',
    cosmicVision: savedAlignment?.cosmicVision || '',
    country: savedAlignment?.country || 'CO'
  }
  showCountryDropdown.value = false
}
</script>

<template>
  <div class="alignment-page">
    <div class="stars-bg"></div>
    <div class="radial-glow"></div>

    <!-- UI HEADERS -->
    <header class="alignment-header">
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

      <div class="header-left">
        <div class="logo-circle">
          <span class="logo-icon">✨</span>
        </div>
        <div class="brand-info">
          <h1 class="brand-title">{{ t('alignment.title') }}</h1>
          <p class="brand-subtitle">{{ t('alignment.subtitle') }}</p>
        </div>
      </div>
      <div class="header-right">
        <button v-if="isFromHome" class="btn-return-home" @click="goBackToHome">
          <span class="return-icon">←</span>VOLVER AL NODO PRINCIPAL
        </button>
        <div class="coord-item">LAT: 34.5522° N</div>
        <div class="coord-item">LONG: 118.2437° W</div>
        <div class="coord-item">ÉPOCA: J2000.0</div>
      </div>
    </header>

    <!-- PROGRESS BAR -->
    <div class="progress-container">
      <span class="progress-label left">PROGRESO_ESTELAR</span>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 75%"></div>
        <div class="progress-thumb" style="left: 75%"></div>
      </div>
      <span class="progress-label right">CALIBRACIÓN_ACTIVA</span>
    </div>

    <!-- MAIN CONTENT -->
    <main class="alignment-content">
      <div class="form-title-group">
        <h2 class="main-title">{{ t('alignment.mainTitle') }}</h2>
        <p class="main-subtitle">Para alinear tu espíritu con los movimientos astrales, debemos mapear tu posición única en la línea de tiempo universal.</p>
      </div>

      <div class="alignment-card">
        <form @submit.prevent="handleSubmit" class="cosmic-form">
          
          <!-- NAME, DATE, TIME -->
          <div class="input-section grid-3">
            <div class="form-group full-width">
              <label>{{ t('alignment.fullName') }}</label>
              <input
                type="text"
                v-model="formData.fullName"
                placeholder="Tu nombre ante el cosmos"
                class="cosmic-input"
              />
            </div>

            <div class="form-group">
              <label class="field-label">{{ t('alignment.birthDate') }}</label>
              <div class="input-with-icon">
                <input
                  id="birthDate"
                  type="date"
                  v-model="formData.birthDate"
                  class="cosmic-input date-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="field-label">{{ t('alignment.birthTime') }} <span class="optional-tag">(OPCIONAL)</span></label>
              <div class="input-with-icon">
                <input
                  id="birthTime"
                  type="time"
                  v-model="formData.birthTime"
                  class="cosmic-input time-input"
                />
              </div>
            </div>
          </div>


          <!-- SECTION I: PATH -->
          <div class="form-section">
            <h3 class="section-num">I. <span class="section-text">{{ t('alignment.path') }}</span></h3>
            <div class="path-toggle">
              <button 
                type="button"
                :class="['path-btn', { active: formData.path === 'solar' }]"
                @click="formData.path = 'solar'"
              >
                <span class="path-label">{{ t('alignment.pathSolar') }}</span>
                <span class="path-icon">⚙️</span>
              </button>
              <button 
                type="button"
                :class="['path-btn', { active: formData.path === 'lunar' }]"
                @click="formData.path = 'lunar'"
              >
                <span class="path-label">{{ t('alignment.pathLunar') }}</span>
                <span class="path-icon">🌙</span>
              </button>
            </div>
          </div>

          <!-- SECTION II: AURA -->
          <div class="form-section">
            <h3 class="section-num">II. <span class="section-text">{{ t('alignment.aura') }}</span></h3>
            <div class="aura-grid">
              <div 
                v-for="option in auraOptions" 
                :key="option.id"
                :class="['aura-card', { active: formData.auraDensity === option.id }]"
                @click="formData.auraDensity = option.id"
              >
                <div class="aura-icon-box">
                  <span class="aura-icon">{{ option.icon }}</span>
                </div>
                <span class="aura-label">{{ option.label }}</span>
              </div>
            </div>
          </div>
          <!-- SECTION III: VISION -->
          <div class="form-section">
            <h3 class="section-num">III. <span class="section-text">{{ t('alignment.vision') }}</span></h3>
            <div class="textarea-container">
              <textarea 
                v-model="formData.cosmicVision" 
                placeholder="Susurra tus intenciones al campo de estrellas..."
                class="cosmic-textarea"
              ></textarea>
              <div class="corner-accent"></div>
            </div>
          </div>

          <!-- SECTION IV: ORIGEN -->
          <div class="form-section">
            <h3 class="section-num">IV. <span class="section-text">¿Desde qué coordenadas terrestres emite tu alma su señal?</span></h3>
            <div class="country-selection">
              <div class="form-group full-width">
                <label>{{ t('alignment.origin') }}</label>
                <div class="custom-dropdown-container">
                  <button 
                    type="button" 
                    class="cosmic-dropdown-trigger" 
                    @click="toggleCountryDropdown"
                  >
                    <span class="selected-val">
                      <span class="flag">{{ selectedCountryObj.flag }}</span>
                      {{ selectedCountryObj.name }}
                    </span>
                    <span class="arrow" :class="{ rotated: showCountryDropdown }">▼</span>
                  </button>
                  
                  <transition name="slide-up">
                    <div v-if="showCountryDropdown" class="cosmic-options-list">
                      <div 
                        v-for="c in countries" 
                        :key="c.code" 
                        class="cosmic-option"
                        :class="{ active: formData.country === c.code }"
                        @click="selectCountry(c.code)"
                      >
                        <span class="flag">{{ c.flag }}</span>
                        {{ c.name }}
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- FOOTER ACTIONS -->
      <footer class="alignment-footer">
        <div class="status-msg">ESTADO: <span :class="statusClass">{{ formStatus }}</span></div>

        <button class="btn-primary-stellar" @click="handleSubmit">
          <span class="btn-text">{{ t('alignment.alignBtn') }}</span>
          <span class="btn-star-icon">★</span>
        </button>

        <button class="btn-reset" @click="resetForm">
          <span class="reset-icon">↺</span> {{ t('alignment.resetBtn') }}
        </button>
      </footer>
    </main>

    <!-- SITE FOOTER -->
    <footer class="site-nav-footer">
      <div class="nav-links">
        <a href="#">REGISTRO ASTRAL V4.0</a>
        <a href="#">COOPERACIÓN ESTELAR</a>
      </div>
      <div class="nav-links">
        <a href="#">CARTAS ESTELARES</a>
        <a href="#">PRIVACIDAD CELESTIAL</a>
        <a href="#">CONTACTAR AL ORÁCULO</a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&display=swap');

.alignment-page {
  min-height: 100vh;
  background-color: #050508;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow-x: hidden;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stars-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 50px 160px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 160px 120px, #fff, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.3;
  z-index: 0;
}

.radial-glow {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(30, 45, 90, 0.4) 0%, transparent 70%);
  z-index: 1;
  pointer-events: none;
}

/* HEADER */
.alignment-header {
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  margin-bottom: 3rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo-circle {
  width: 50px;
  height: 50px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.logo-circle::after {
  content: '';
  position: absolute;
  width: 120%;
  height: 120%;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.logo-icon {
  font-size: 1.5rem;
}

.brand-title {
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  letter-spacing: 4px;
  margin: 0;
}

.brand-subtitle {
  font-size: 0.7rem;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0.2rem 0 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}

.btn-return-home {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 0.6rem 1.2rem;
  color: #c9a96e;
  font-family: 'Outfit', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-right: 1rem;
}

.btn-return-home:hover {
  background: rgba(201, 169, 110, 0.1);
  border-color: #c9a96e;
  color: #fff;
  transform: translateX(-5px);
  box-shadow: 0 0 15px rgba(201, 169, 110, 0.2);
}

.return-icon {
  font-size: 0.9rem;
}

/* PROGRESS */
.progress-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 5rem;
  z-index: 2;
}

.progress-label {
  font-size: 0.6rem;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.6);
}

.progress-bar {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, transparent, #fff);
  position: absolute;
}

.progress-thumb {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px #fff;
}

/* CONTENT */
.alignment-content {
  width: 100%;
  max-width: 900px;
  z-index: 2;
  text-align: center;
}

.form-title-group {
  margin-bottom: 4rem;
}

.main-title {
  font-family: 'Cinzel', serif;
  font-size: 3rem;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
}

.main-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.alignment-card {
  background: rgba(15, 20, 35, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 40px;
  padding: 4rem;
  margin-bottom: 3rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
}

.cosmic-form {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  text-align: left;
}

/* FORM GROUPS */
.form-group label {
  display: block;
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
}

.cosmic-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1.2rem;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.cosmic-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
}

/* Normalize date and time inputs to match text inputs */
.date-input,
.time-input {
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  min-height: 2.8rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
}

/* CUSTOM DROPDOWN */
.custom-dropdown-container {
  position: relative;
  width: 100%;
  z-index: 20;
}

.cosmic-dropdown-trigger {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.85rem 1.2rem;
  color: #fff;
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Outfit', sans-serif;
}

.cosmic-dropdown-trigger:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
}

.selected-val {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.flag {
  font-size: 1.2rem;
}

.arrow {
  font-size: 0.7rem;
  opacity: 0.5;
  transition: transform 0.3s ease;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.cosmic-options-list {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: rgba(15, 20, 35, 0.98);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  max-height: 250px;
  overflow-y: auto;
  z-index: 2000;
  padding: 0.5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(99, 102, 241, 0.1);
}

.cosmic-option {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.cosmic-option:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.cosmic-option.active {
  background: rgba(99, 102, 241, 0.15);
  color: #fff;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

/* Scrollbar styling for dropdown */
.cosmic-options-list::-webkit-scrollbar {
  width: 4px;
}

.cosmic-options-list::-webkit-scrollbar-track {
  background: transparent;
}

.cosmic-options-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* Transition */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.grid-3 {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
  align-items: end;
}

.full-width {
  grid-column: span 1;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon-btn {
  position: absolute;
  right: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 0.6;
  transition: opacity 0.2s, transform 0.2s;
  padding: 0.25rem;
  z-index: 2;
  line-height: 1;
}

.input-icon-btn:hover {
  opacity: 1;
  transform: scale(1.15);
}

/* Style native browser date/time picker icons to match dark theme */
input[type="date"],
input[type="time"] {
  cursor: pointer;
  color-scheme: dark;
}

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.7);
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  transition: filter 0.2s;
}

input[type="date"]::-webkit-calendar-picker-indicator:hover,
input[type="time"]::-webkit-calendar-picker-indicator:hover {
  filter: invert(1) brightness(1);
}

/* SECTIONS */
.section-num {
  font-size: 1.2rem;
  font-family: 'Cinzel', serif;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-text {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
}

/* PATH TOGGLE */
.path-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.path-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.75rem;
  letter-spacing: 1px;
}

.path-btn.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* AURA GRID */
.aura-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.aura-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.aura-card:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-5px);
}

.aura-card.active {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.aura-icon-box {
  font-size: 2rem;
  opacity: 0.5;
}

.aura-card.active .aura-icon-box {
  opacity: 1;
}

.aura-label {
  font-size: 0.6rem;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.4);
}

.aura-card.active .aura-label {
  color: #fff;
}

/* TEXTAREA */
.textarea-container {
  position: relative;
}

.cosmic-textarea {
  width: 100%;
  min-height: 180px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  resize: none;
}

.corner-accent {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  border-bottom-right-radius: 12px;
}

/* FOOTER ACTIONS */
.alignment-footer {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.status-msg {
  font-size: 0.7rem;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
}

.status-msg span {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 0.5rem;
}

.btn-primary-stellar {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 100px;
  padding: 1.2rem 4rem;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 4px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
}

.btn-primary-stellar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: 0.4s;
}

.btn-primary-stellar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
}

.btn-primary-stellar:hover::before {
  opacity: 1;
}

.btn-star-icon {
  font-size: 1.2rem;
}

.btn-reset {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.65rem;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-reset:hover {
  color: #fff;
}

/* SITE FOOTER */
.site-nav-footer {
  width: 100%;
  max-width: 1400px;
  margin-top: 8rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  z-index: 2;
}

.nav-links {
  display: flex;
  gap: 3rem;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  font-size: 0.65rem;
  letter-spacing: 1px;
  transition: 0.3s;
}

.nav-links a:hover {
  color: #fff;
}

.optional-tag {
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
  margin-left: 0.5rem;
}

.error-msg {
  color: #ff8a80;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-align: center;
}

.status-complete { color: #69ff85; }
.status-progress { color: #c9a96e; }
.status-incomplete { color: rgba(255, 255, 255, 0.4); }

/* Cosmic Alert Top Responsive Fix */
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
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255, 255, 255, 0.1);
  font-family: 'Outfit', sans-serif;
  letter-spacing: 1px;
  width: 90%;
  max-width: 450px;
  min-width: auto;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  transition: all 0.3s ease;
}

@media (max-width: 900px) {
  .alignment-page { padding: 1.5rem; }
  .grid-3 { grid-template-columns: 1fr 1fr; }
  .grid-3 .full-width { grid-column: span 2; }
  .aura-grid { grid-template-columns: 1fr 1fr; }
  .path-toggle { grid-template-columns: 1fr; }
  .alignment-header { flex-direction: column; gap: 1.5rem; text-align: center; }
  .header-left { flex-direction: column; }
  .header-right { flex-wrap: wrap; justify-content: center; gap: 1rem; }
  .main-title { font-size: 2.2rem; }
  .alignment-card { padding: 2.5rem; border-radius: 28px; }
  .progress-container { margin-bottom: 3rem; }
}

@media (max-width: 600px) {
  .cosmic-alert-top { top: 1rem; padding: 0.75rem 1rem; font-size: 0.9rem; }
  .grid-3 { grid-template-columns: 1fr; }
  .grid-3 .full-width { grid-column: span 1; }
  .aura-grid { grid-template-columns: 1fr; }
  .main-title { font-size: 1.8rem; }
  .alignment-card { padding: 1.5rem; border-radius: 20px; }
  .cosmic-form { gap: 2.5rem; }
  .alignment-page { padding: 4rem 1rem 1rem; }
  .site-nav-footer { flex-direction: column; gap: 1.5rem; }
  .nav-links { flex-wrap: wrap; gap: 1rem; justify-content: center; }
  .btn-primary-stellar { padding: 1.2rem 2.5rem; font-size: 0.9rem; width: 100%; }
}
</style>

