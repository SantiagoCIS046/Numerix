<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
import { useI18n } from '@/composables/useI18n'
import { authStore } from '@/store/auth.js'

const { t, setLanguage, currentLanguage } = useI18n()

// User Data (Sync with localStorage)
const refreshKey = ref(0)
const user = computed(() => {
  refreshKey.value // Dependency to force update
  const stored = localStorage.getItem('user')
  const alignment = localStorage.getItem('alignmentProfile')
  const userData = stored ? JSON.parse(stored) : null
  const alignmentData = alignment ? JSON.parse(alignment) : null
  
  return {
    fullName: alignmentData?.fullName || userData?.nombre || userData?.name || 'Viajero Estelar',
    role: userData?.role || 'Buscador Cósmico',
    level: 'Nivel Cuántico 7',
    galaxyId: alignmentData?.galaxyId || userData?.galaxyId || '#8888-ASTRO',
    sign: alignmentData?.zodiacSign || userData?.zodiacSign || 'Buscando...',
    moonPhase: alignmentData?.moonPhase || userData?.moonPhase || 'Sincronizando...',
    avatar: alignmentData?.avatarUrl || `https://ui-avatars.com/api/?name=${alignmentData?.fullName || userData?.nombre || 'User'}&background=6366f1&color=fff`
  }
})

const getZodiacSign = (dateStr) => {
  if (!dateStr) return 'Desconocido'
  const date = new Date(dateStr)
  const day = date.getUTCDate()
  const month = date.getUTCMonth() + 1
  
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Acuario";
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Piscis";
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Tauro";
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Géminis";
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cáncer";
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Escorpio";
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagitario";
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricornio";
  return 'Cosmo'
}

// Settings State
const notificationFrequency = ref('Diaria')
const showFreqDropdown = ref(false)
const freqOptions = ['Diaria', 'Semanal', 'Mensual', 'Ciclo Lunar']

const horoscopeComplexity = ref('Esotérico Avanzado')
const showCompDropdown = ref(false)
const compOptions = ['Básico', 'Esotérico Avanzado', 'Maestría Galáctica', 'Nivel Dios']

const retrogradeAlerts = ref(true)
const quantumEncryption = ref(true)
const nexusVisibility = ref(true)
const neonBrightness = ref(60)
const deepDarkMode = ref(true)

// Verification State
const isVerifyingEncryption = ref(false)

const verifyEncryption = () => {
  if (isVerifyingEncryption.value) return
  isVerifyingEncryption.value = true
  setTimeout(() => {
    isVerifyingEncryption.value = false
    alert('✨ Escaneo de Nodos Completado: Cifrado Cuántico Íntegro al 100%.')
  }, 3000)
}

const openFAQ = () => {
  alert('🕯️ Accediendo al Oráculo de Ayuda... Consultando registros akáshicos.')
}

const contactGuides = () => {
  alert('💬 Estableciendo conexión con los Guías Astrales... Sincronizando chat cuántico.')
}

const selectFreq = (opt) => {
  notificationFrequency.value = opt
  showFreqDropdown.value = false
}

const selectComp = (opt) => {
  horoscopeComplexity.value = opt
  showCompDropdown.value = false
}

// Notifications Dropdown (Re-using logic from Home)
const unreadNotifs = ref(2)

// Navigation
const menuItems = ref([
  { icon: '⭐', label: 'Inicio Astral', route: '/home' },
  { icon: '🌙', label: 'Carta Natal', route: '/carta-natal' },
  { icon: '💎', label: 'Predicciones', route: '/lecturas' },
  { icon: '💜', label: 'Vínculo del Alma', route: '/compatibilidad' },
  { icon: '⚙️', label: 'Ajustes', route: '/configuracion', active: true },
])

const navigateTo = (route) => {
  if (route) router.push(route)
}

const logout = () => {
  authStore.clearSession()
  router.push('/auth')
}

const syncDNA = () => {
  const syncBtn = document.querySelector('.btn-sync')
  if (syncBtn) syncBtn.innerText = 'SINCRONIZANDO...'
  
  setTimeout(() => {
    const alignment = localStorage.getItem('alignmentProfile')
    if (alignment) {
      const data = JSON.parse(alignment)
      const sign = getZodiacSign(data.birthDate)
      const moonPhases = ['Luna Nueva', 'Luna Creciente', 'Luna Llena', 'Luna Menguante', 'Cuarto Creciente', 'Cuarto Menguante']
      const moon = moonPhases[Math.floor(Math.random() * moonPhases.length)]
      
      const updated = {
        ...data,
        zodiacSign: sign,
        moonPhase: moon,
        galaxyId: data.galaxyId || `#${Math.floor(1000 + Math.random() * 9000)}-ASTRO`
      }
      localStorage.setItem('alignmentProfile', JSON.stringify(updated))
    }
    
    refreshKey.value++
    if (syncBtn) syncBtn.innerText = 'SINCRONIZAR ADN'
    alert('✅ ADN Sincronizado. Frecuencia cuántica recalibrada y datos vinculados.')
  }, 2000)
}

const editProfile = () => {
  alert('⚡ Abriendo editor de avatar cuántico...')
}

const themeStyles = computed(() => ({
  '--glow-intensity': neonBrightness.value / 100,
  '--glow-blur': `${(neonBrightness.value / 100) * 25}px`,
  '--neon-opacity': 0.1 + (neonBrightness.value / 100) * 0.4
}))

const saveSettings = () => {
  alert('💾 Sincronización Guardada en el Núcleo')
}
</script>

<template>
  <div :class="['settings-layout', { 'light-theme': !deepDarkMode }]" :style="themeStyles">
    <div class="stars-overlay"></div>
    
    <!-- SIDEBAR -->
    <aside class="sidebar-settings">
      <div class="profile-mini" @click="navigateTo('/home')" style="cursor: pointer;">
        <div class="avatar-ring">
          <img :src="user.avatar" alt="Avatar" />
        </div>
        <div class="profile-info">
          <h3>{{ user.fullName }}</h3>
          <p>{{ user.level }}</p>
        </div>
      </div>

      <nav class="side-nav">
        <div 
          v-for="item in menuItems" 
          :key="item.label" 
          :class="['nav-item', { active: item.active }]"
          @click="navigateTo(item.route)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </div>
      </nav>
    </aside>

    <!-- MAIN PANEL -->
    <main class="settings-panel">
      <!-- HEADER -->
      <header class="settings-header">
        <div class="header-title">
          <div class="title-with-icon">
            <span class="sparkle-icon">✨</span>
            <h1>{{ t('settings.title') }} <span>{{ t('settings.subtitle') }}</span></h1>
          </div>
        </div>
        <div class="header-controls">
          <button class="icon-btn" @click="alert('Gestor de notificaciones activo')">
            <span class="icon">🔔</span>
            <div v-if="unreadNotifs > 0" class="notif-dot-mini"></div>
          </button>
          <button class="icon-btn profile-btn" @click="navigateTo('/home')">
            <img :src="user.avatar" alt="P" />
          </button>
        </div>
      </header>

      <div class="scrollable-content">
        <div class="welcome-text">
          <h2>{{ t('settings.welcome') }}</h2>
          <p>Sincroniza tu energía con el cosmos y personaliza tu experiencia cuántica</p>
        </div>

        <!-- PROFILE BIG BLOCK -->
        <section class="profile-main-block">
          <div class="profile-main-content">
            <div class="big-avatar-wrapper">
              <img :src="user.avatar" alt="User" class="big-avatar" />
              <button class="edit-btn" @click="editProfile">✎</button>
            </div>
            <div class="profile-text">
              <h2>{{ user.fullName }}</h2>
              <p class="gal-id">ID Galáctico: {{ user.galaxyId }}</p>
              <div class="profile-chips">
                <span class="chip">Signo: {{ user.sign }}</span>
                <span class="chip">Fase: {{ user.moonPhase }}</span>
              </div>
            </div>
            <button class="btn-sync" @click="syncDNA">{{ t('settings.syncBtn') }}</button>
          </div>
        </section>

        <!-- SETTINGS GRID -->
        <div class="settings-grid">
          <!-- Idioma -->
          <div class="glass-card lang-card">
            <div class="card-header">
              <span class="card-icon blue">🌍</span>
              <h3>{{ t('settings.language') }}</h3>
            </div>
            <div class="inner-block language-toggle">
              <button 
                :class="['lang-btn', { active: currentLanguage === 'es' }]" 
                @click="setLanguage('es')"
              >
                {{ t('settings.langEs') }}
              </button>
              <button 
                :class="['lang-btn', { active: currentLanguage === 'en' }]" 
                @click="setLanguage('en')"
              >
                {{ t('settings.langEn') }}
              </button>
            </div>
          </div>

          <!-- Preferencias de Lectura -->
          <div class="glass-card">
            <div class="card-header">
              <span class="card-icon pink">☸</span>
              <h3>{{ t('settings.notifFreq') }}</h3>
            </div>
            <div class="field-group">
              <div class="field">
                <label>Frecuencia de Notificaciones</label>
                <div class="dropdown-wrapper">
                  <div class="custom-select" @click="showFreqDropdown = !showFreqDropdown">
                    <span>{{ notificationFrequency }}</span>
                    <span :class="['arrow', { open: showFreqDropdown }]">▼</span>
                  </div>
                  <Transition name="slide-up">
                    <div v-if="showFreqDropdown" class="options-list">
                      <div 
                        v-for="opt in freqOptions" 
                        :key="opt" 
                        class="option-item"
                        @click="selectFreq(opt)"
                      >
                        {{ opt }}
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
              <div class="field">
                <label>Complejidad del Horóscopo</label>
                <div class="dropdown-wrapper">
                  <div class="custom-select" @click="showCompDropdown = !showCompDropdown">
                    <span>{{ horoscopeComplexity }}</span>
                    <span :class="['arrow', { open: showCompDropdown }]">▼</span>
                  </div>
                  <Transition name="slide-up">
                    <div v-if="showCompDropdown" class="options-list">
                      <div 
                        v-for="opt in compOptions" 
                        :key="opt" 
                        class="option-item"
                        @click="selectComp(opt)"
                      >
                        {{ opt }}
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
              <div class="checkbox-field" @click="retrogradeAlerts = !retrogradeAlerts">
                <div :class="['custom-check-box', { checked: retrogradeAlerts }]">
                  <span v-if="retrogradeAlerts">✔</span>
                </div>
                <label>{{ t('settings.retrograde') }}</label>
              </div>
            </div>
          </div>

          <!-- Privacidad y Seguridad -->
          <div class="glass-card">
            <div class="card-header">
              <span class="card-icon cyan">🛡</span>
              <h3>{{ t('settings.privacy') }}</h3>
            </div>
            <div 
              :class="['inner-block', 'encryption-active', { 'verifying': isVerifyingEncryption }]"
              @click="verifyEncryption"
              style="cursor: pointer;"
            >
              <div class="block-header">
                <h4>{{ isVerifyingEncryption ? 'VERIFICANDO...' : t('settings.encryption') }}</h4>
                <span class="badge-active">{{ isVerifyingEncryption ? 'SCAN' : 'ACTIVO' }}</span>
              </div>
              <p>{{ isVerifyingEncryption ? 'Escaneando flujo de datos galácticos...' : t('settings.encryptionDesc') }}</p>
              <div v-if="isVerifyingEncryption" class="scan-bar"></div>
            </div>
            <div class="toggle-field">
              <label>{{ t('settings.visibility') }}</label>
              <div :class="['toggle', { on: nexusVisibility }]" @click="nexusVisibility = !nexusVisibility">
                <div class="toggle-circle"></div>
              </div>
            </div>
          </div>

          <!-- Ajustes de Interfaz -->
          <div class="glass-card">
            <div class="card-header">
              <span class="card-icon teal">🎨</span>
              <h3>{{ t('settings.ui') }}</h3>
            </div>
            <div class="field">
              <label>{{ t('settings.brightness') }}</label>
              <div class="slider-wrapper">
                <input type="range" v-model="neonBrightness" class="range-input" />
                <div class="slider-labels">
                  <span>SUTIL</span>
                  <span>SUPERNOVA</span>
                </div>
              </div>
            </div>
            <div class="checkbox-field row-between">
              <label>{{ t('settings.darkMode') }}</label>
              <div class="custom-check" @click="deepDarkMode = !deepDarkMode">
                <span v-if="deepDarkMode">✔</span>
              </div>
            </div>
          </div>

          <!-- Ayuda y Soporte -->
          <div class="glass-card">
            <div class="card-header">
              <span class="card-icon purple">❓</span>
              <h3>{{ t('settings.support') }}</h3>
            </div>
            <div class="menu-list">
              <div class="menu-item" @click="openFAQ">
                <span>{{ t('settings.faq') }}</span>
                <span class="arrow">❯</span>
              </div>
              <div class="menu-item" @click="contactGuides">
                <span>{{ t('settings.contact') }}</span>
                <span class="arrow">❯</span>
              </div>
            </div>
            <p class="app-version">VERSIÓN DE LA APP 4.2.0-ASTRA</p>
          </div>
        </div>

        <!-- FOOTER ACTIONS -->
        <div class="footer-actions">
          <button class="btn-logout" @click="logout">{{ t('settings.logout') }}</button>
          <button class="btn-save" @click="saveSettings">{{ t('settings.saveAll') }}</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&display=swap');

.settings-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-deep, #050508);
  color: var(--text-main, #fff);
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
  
  /* Cosmic Variables */
  --neon-pink: #ff00ff;
  --neon-cyan: #00f2ff;
  --neon-indigo: #6366f1;
  --neon-purple: #a855f7;
  --card-bg: rgba(255, 255, 255, 0.02);
  --card-border: rgba(255, 255, 255, 0.05);
  --sidebar-bg: rgba(15, 12, 41, 0.4);
}

.settings-layout.light-theme {
  --bg-deep: #1a1a2e;
  --text-main: #e0e0ff;
  --card-bg: rgba(255, 255, 255, 0.05);
  --card-border: rgba(255, 255, 255, 0.1);
  --sidebar-bg: rgba(30, 30, 60, 0.6);
  background-image: radial-gradient(circle at center, #2a2a4e 0%, #1a1a2e 100%);
}

.stars-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 100px 150px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 200px 80px, #fff, rgba(0,0,0,0));
  background-size: 300px 300px;
  opacity: 0.1;
  pointer-events: none;
}

/* Sidebar Styling */
.sidebar-settings {
  width: 280px;
  background: rgba(15, 12, 41, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 2.5rem 1.5rem;
  z-index: 10;
}

.profile-mini {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 2rem;
}

.avatar-ring {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
}

.avatar-ring img {
  width: 100%; height: 100%;
  border-radius: 50%;
}

.profile-info h3 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
}

.profile-info p {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  color: rgba(255, 255, 255, 0.6);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
}

.nav-item.active {
  background: var(--neon-indigo);
  color: #fff;
  box-shadow: 0 4px calc(var(--glow-blur) * 0.8) rgba(99, 102, 241, var(--glow-intensity));
}

.nav-icon { font-size: 1.1rem; }
.nav-label { font-size: 0.85rem; font-weight: 500; letter-spacing: 0.5px; }

/* Main Panel Styling */
.settings-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  z-index: 5;
}

.settings-header {
  padding: 0 4rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.sparkle-icon {
  color: #a855f7;
  font-size: 1.4rem;
}

.header-title h1 {
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  letter-spacing: 2px;
  margin: 0;
}

.header-title span { color: #a855f7; }

.header-controls {
  display: flex;
  gap: 1rem;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  width: 40px; height: 40px;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-btn { 
  padding: 0; 
  overflow: hidden; 
  border-color: #00f2ff;
}

.profile-btn img {
  width: 100%; height: 100%;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 3rem 4rem;
}

.welcome-text h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.welcome-text p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  margin-bottom: 3rem;
}

/* Profile Block */
.profile-main-block {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  backdrop-filter: blur(10px);
}

.profile-main-content {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.big-avatar-wrapper {
  position: relative;
  width: 120px; height: 120px;
}

.big-avatar {
  width: 100%; height: 100%;
  border-radius: 50%;
  object-fit: crop;
  border: 4px solid #00f2ff;
}

.edit-btn {
  position: absolute;
  bottom: 0; right: 0;
  background: #ff00ff;
  border: none;
  width: 32px; height: 32px;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px var(--glow-blur) rgba(255, 0, 255, var(--glow-intensity));
}

.profile-text h2 { font-size: 1.8rem; margin: 0 0 0.4rem; }
.gal-id { font-size: 0.85rem; color: rgba(255, 255, 255, 0.4); margin-bottom: 1rem; }

.profile-chips {
  display: flex;
  gap: 1rem;
}

.chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.btn-sync {
  margin-left: auto;
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(99, 102, 241, var(--glow-intensity));
  transition: transform 0.3s;
}

.btn-sync:hover { transform: scale(1.05); }

/* Settings Grid */
/* LANGUAGE TOGGLE */
.language-toggle {
  display: flex;
  gap: 1rem;
  padding: 1rem !important;
}

.lang-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.lang-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.lang-btn.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
  color: #fff;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
}

/* LANGUAGE TOGGLE */
.language-toggle {
  display: flex;
  gap: 1rem;
  padding: 1rem !important;
}

.lang-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.lang-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.lang-btn.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
  color: #fff;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 5rem;
}

.glass-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.card-icon.pink { background: rgba(255, 0, 255, 0.1); color: #ff00ff; }
.card-icon.cyan { background: rgba(0, 242, 255, 0.1); color: #00f2ff; }
.card-icon.teal { background: rgba(20, 184, 166, 0.1); color: #14b8a6; }
.card-icon.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }

.card-header h3 { font-size: 1.1rem; font-weight: 600; margin: 0; }

.field-group { display: flex; flex-direction: column; gap: 1.5rem; }

.field label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.8rem;
}

.custom-select {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--card-border);
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.custom-select:hover {
  border-color: rgba(255, 0, 255, 0.3);
  background: rgba(255, 0, 255, 0.02);
}

.dropdown-wrapper {
  position: relative;
}

.options-list {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  background: rgba(15, 12, 41, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  z-index: 100;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.option-item {
  padding: 0.9rem 1.2rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  color: rgba(255, 255, 255, 0.7);
}

.option-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ff00ff;
  padding-left: 1.5rem;
}

.arrow { 
  font-size: 0.6rem; 
  opacity: 0.5; 
  transition: transform 0.3s;
}

.arrow.open {
  transform: rotate(180deg);
  opacity: 1;
  color: #ff00ff;
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
}

.checkbox-field label { font-size: 0.85rem; color: rgba(255, 255, 255, 0.8); }

.inner-block {
  background: rgba(0, 242, 255, 0.03);
  border: 1px solid rgba(0, 242, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.inner-block.verifying {
  border-color: #ff00ff;
  background: rgba(255, 0, 255, 0.05);
}

.scan-bar {
  height: 2px;
  background: #00f2ff;
  margin-top: 1rem;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.scan-bar::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, #ff00ff, transparent);
  animation: scan 1.5s infinite linear;
}

@keyframes scan {
  to { left: 100%; }
}

.block-header h4 { font-size: 0.9rem; margin: 0; }

.badge-active {
  background: #00f2ff;
  color: #0f0c29;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.inner-block p { font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); margin: 0; }

.toggle-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--card-border);
  border-radius: 16px;
}

.toggle-field label { font-size: 0.85rem; }

.toggle {
  width: 44px; height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle.on { background: #00f2ff; }

.toggle-circle {
  position: absolute;
  top: 3px; left: 3px;
  width: 18px; height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle.on .toggle-circle { transform: translateX(20px); }

.slider-wrapper { margin-top: 1rem; }

.range-input {
  width: 100%;
  accent-color: #00f2ff;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.5rem;
  letter-spacing: 1px;
}

.row-between { justify-content: space-between; width: 100%; }

.custom-check {
  width: 24px; height: 24px;
  background: #00f2ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f0c29;
  font-size: 0.8rem;
  cursor: pointer;
}

.menu-list { display: flex; flex-direction: column; gap: 0.8rem; }

.menu-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--card-border);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover { background: rgba(255, 255, 255, 0.08); }

.app-version {
  text-align: center;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.2);
  margin-top: 2rem;
  letter-spacing: 1px;
}

/* Footer UI */
.footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-logout {
  background: rgba(255, 0, 0, 0.05);
  border: 1px solid rgba(255, 0, 0, 0.2);
  color: #ff4d4d;
  padding: 1rem 2.5rem;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 0, 0, 0.1);
  border-color: #ff4d4d;
}

.btn-save {
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 1.1rem 3rem;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
  transition: transform 0.3s;
}

.btn-save:hover { transform: translateY(-3px); }

.notif-dot-mini {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #ff00ff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.6);
}

.custom-check-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff00ff;
  font-size: 0.7rem;
  transition: all 0.3s;
}

.custom-check-box.checked {
  background: rgba(255, 0, 255, 0.1);
  border-color: #ff00ff;
}

/* Scrollbar */
.scrollable-content::-webkit-scrollbar { width: 6px; }
.scrollable-content::-webkit-scrollbar-track { background: transparent; }
.scrollable-content::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>
