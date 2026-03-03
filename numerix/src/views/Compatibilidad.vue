<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Galaxy from '../components/Galaxy.vue'

const router = useRouter()
const syncLoading = ref(false)
const syncResult = ref(null)

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

const partner = ref({
  nombre: '',
  fecha_nacimiento: ''
})

const navLinks = [
  { label: 'Lectura Diaria', path: '/lecturas', active: false },
  { label: 'Carta Natal', path: '/carta-natal', active: false },
  { label: 'Compatibilidad', path: '/compatibilidad', active: true },
  { label: 'Horóscopo', path: '/horoscopo', active: false },
]

function handleSync() {
  if (!partner.value.nombre || !partner.value.fecha_nacimiento) return
  
  syncLoading.value = true
  syncResult.value = null
  
  setTimeout(() => {
    syncLoading.value = false
    syncResult.value = {
      score: 87,
      label: 'SINCRO-ESTELAR ALTA',
      desc: 'Sus vibraciones resuenan en una frecuencia armónica. Existe una alineación natural entre sus caminos evolutivos.',
      areas: [
        { name: 'Comunicación', value: 92, icon: '💬' },
        { name: 'Emoción', value: 78, icon: '❤️' },
        { name: 'Espiritual', value: 95, icon: '✨' },
      ]
    }
  }, 2500)
}

function goBack() { router.push('/home') }
function goTo(path) { router.push(path) }

const bootstrapAlert = ref({ show: false, message: '', type: 'info' })

function showAlert(message, type = 'info') {
  bootstrapAlert.value = { show: true, message, type }
  setTimeout(() => {
    bootstrapAlert.value.show = false
  }, 4000)
}
</script>

<template>
  <div class="compatibility-container">
    <Galaxy 
      :density="1.2"
      :glow-intensity="0.4"
      :hue-shift="180"
      class="galaxy-bg"
    />

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
    <header class="navbar">
      <div class="nav-left">
        <button class="nav-back-btn" @click="goBack"><span>←</span> VOLVER</button>
        <div class="nav-logo" @click="goBack"><span>✨</span> ASTRALIS</div>
      </div>
      <nav class="nav-center">
        <a v-for="link in navLinks" :key="link.label" href="javascript:void(0)" :class="['nav-link', { active: link.active }]" @click="goTo(link.path)">
          {{ link.label }}
        </a>
      </nav>
      <div class="nav-right">
        <div class="user-nav-profile">
          <div class="user-avatar-mini"><img :src="`https://ui-avatars.com/api/?name=${user?.nombre || 'User'}&background=fff&color=6366f1`" alt="User" /></div>
          <span class="user-name-mini">{{ user?.nombre }}</span>
        </div>
        <button class="premium-btn" @click="goTo('/suscripcion')">PREMIUM</button>
      </div>
    </header>

    <main class="page-content">
      <section class="sync-hero">
        <div class="hero-glow"></div>
        <p class="hero-tag">ALINEACIÓN VIBRACIONAL</p>
        <h1 class="hero-title">Compatibilidad</h1>
        <p class="hero-desc">Descubre cómo tus números se entrelazan con otra esencia en el tejido cósmico.</p>
      </section>

      <div class="sync-grid">
        <!-- Input Form -->
        <section class="sync-card input-section">
          <h2 class="card-title">Segunda Esencia</h2>
          <div class="form-group">
            <label>NOMBRE CELESTIAL</label>
            <input v-model="partner.nombre" type="text" placeholder="Nombre completo" />
          </div>
          <div class="form-group">
            <label>FECHA DE ALINEACIÓN</label>
            <input v-model="partner.fecha_nacimiento" type="date" />
          </div>
          <button class="btn-sync" :disabled="syncLoading || !partner.nombre || !partner.fecha_nacimiento" @click="handleSync">
            <span v-if="!syncLoading">SINCRONIZAR ALMAS ✦</span>
            <div v-else class="lds-dual-ring"></div>
          </button>
        </section>

        <!-- Result Display -->
        <section class="sync-card result-section" :class="{ 'has-result': syncResult }">
          <div v-if="!syncResult && !syncLoading" class="empty-state">
            <div class="empty-icon">🪐</div>
            <p>Ingresa la esencia del acompañante para iniciar el análisis de sincronía.</p>
          </div>

          <div v-if="syncLoading" class="syncing-state">
            <div class="radar">
              <div class="radar-line"></div>
              <div class="radar-circles"></div>
            </div>
            <p>Analizando frecuencias compartidas...</p>
          </div>

          <div v-if="syncResult" class="result-content animate-in">
            <div class="score-container">
              <div class="score-ring" :style="{ '--percent': syncResult.score }">
                <span class="score-value">{{ syncResult.score }}%</span>
              </div>
              <h3 class="score-label">{{ syncResult.label }}</h3>
            </div>
            <p class="result-desc">{{ syncResult.desc }}</p>
            <div class="areas-grid">
              <div v-for="area in syncResult.areas" :key="area.name" class="area-item">
                <span class="area-icon">{{ area.icon }}</span>
                <div class="area-info">
                  <span class="area-name">{{ area.name }}</span>
                  <div class="area-bar-bg"><div class="area-bar-fill" :style="{ width: area.value + '%' }"></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <footer class="page-footer">
      <div class="footer-left">© 2024 Astralis Resonance.</div>
      <div class="footer-right"><a href="#" @click.prevent="showAlert('Tu sincronía es sagrada y privada.', 'info')">Privacidad</a></div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

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

.compatibility-container { 
  background-color: #020205; 
  color: #fff; 
  min-height: 100vh; 
  font-family: 'Outfit', sans-serif; 
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
  opacity: 0.4;
}

/* NAVBAR (Same as others) */
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
.nav-back-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); padding: 0.5rem 1rem; border-radius: 50px; cursor: pointer; font-family: inherit; font-size: 0.75rem; font-weight: 700; }
.nav-back-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.nav-logo { font-weight: 800; letter-spacing: 4px; cursor: pointer; }
.nav-center { display: flex; background: rgba(255, 255, 255, 0.03); padding: 0.4rem 0.8rem; border-radius: 50px; }
.nav-link { color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 0.8rem; padding: 0.5rem 1.2rem; border-radius: 50px; transition: all 0.3s; }
.nav-link.active { background: rgba(99, 102, 241, 0.15); color: #fff; }
.nav-right { display: flex; align-items: center; gap: 1.5rem; }
.user-nav-profile { display: flex; align-items: center; gap: 0.8rem; background: rgba(255, 255, 255, 0.03); padding: 0.4rem 1rem; border-radius: 50px; }
.user-avatar-mini { width: 26px; height: 26px; border-radius: 50%; overflow: hidden; }
.user-name-mini { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; opacity: 0.8; }
.premium-btn { background: #6366f1; border: none; color: #fff; padding: 0.5rem 1.2rem; border-radius: 8px; font-weight: 800; font-size: 0.75rem; cursor: pointer; }

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

.sync-hero { text-align: center; margin-bottom: 5rem; position: relative; }
.hero-glow { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 500px; height: 300px; background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%); z-index: -1; }
.hero-tag { color: #6366f1; font-weight: 800; letter-spacing: 4px; font-size: 0.75rem; margin-bottom: 1rem; }
.hero-title { font-size: 3.5rem; font-weight: 800; margin: 0; }
.hero-desc { color: rgba(255, 255, 255, 0.5); font-size: 1.1rem; margin-top: 1rem; max-width: 600px; margin-left: auto; margin-right: auto; }

.sync-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 2rem; align-items: start; }

.sync-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 32px; padding: 3rem; backdrop-filter: blur(20px); transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); }

.input-section { position: sticky; top: 120px; }
.card-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 2rem; color: #6366f1; }

.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; font-size: 0.7rem; font-weight: 700; color: rgba(255, 255, 255, 0.4); letter-spacing: 1.5px; margin-bottom: 0.5rem; }
.form-group input { width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1rem; color: #fff; font-family: inherit; font-size: 1rem; outline: none; transition: border-color 0.3s; }
.form-group input:focus { border-color: #6366f1; }

.btn-sync { width: 100%; background: #fff; color: #000; border: none; padding: 1.2rem; border-radius: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer; margin-top: 1rem; transition: transform 0.3s, background 0.3s; display: flex; justify-content: center; align-items: center; }
.btn-sync:hover:not(:disabled) { transform: translateY(-2px); background: #f0f0f0; }
.btn-sync:disabled { opacity: 0.5; cursor: not-allowed; }

/* RESULTS STYLES */
.result-section { min-height: 400px; display: flex; align-items: center; justify-content: center; text-align: center; }
.result-section.has-result { border-color: rgba(99, 102, 241, 0.3); background: rgba(99, 102, 241, 0.02); }

.empty-state { color: rgba(255, 255, 255, 0.3); }
.empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }

.syncing-state { color: #6366f1; }
.radar { width: 120px; height: 120px; border: 2px solid rgba(99, 102, 241, 0.2); border-radius: 50%; margin: 0 auto 2rem; position: relative; overflow: hidden; }
.radar-line { position: absolute; top: 0; left: 50%; width: 2px; height: 50%; background: linear-gradient(to top, #6366f1, transparent); transform-origin: bottom; animation: rotate 2s linear infinite; }
.radar-circles { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60%; height: 60%; border: 1px solid rgba(99, 102, 241, 0.1); border-radius: 50%; }

@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.animate-in { animation: slideUp 0.8s cubic-bezier(0.19, 1, 0.22, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

.score-ring { width: 150px; height: 150px; border-radius: 50%; background: radial-gradient(closest-side, #050508 85%, transparent 86% 100%), conic-gradient(#6366f1 calc(var(--percent) * 1%), rgba(255, 255, 255, 0.05) 0); margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; }
.score-value { font-size: 2.5rem; font-weight: 800; }
.score-label { color: #6366f1; font-size: 1.2rem; margin: 0; letter-spacing: 2px; }
.result-desc { color: rgba(255, 255, 255, 0.6); margin: 1.5rem 0 3rem; line-height: 1.7; font-size: 0.95rem; }

.areas-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.area-item { background: rgba(255, 255, 255, 0.03); padding: 1.5rem; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.05); }
.area-icon { font-size: 1.5rem; display: block; margin-bottom: 1rem; }
.area-name { font-size: 0.7rem; font-weight: 800; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 1px; }
.area-bar-bg { height: 4px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; margin-top: 0.5rem; overflow: hidden; }
.area-bar-fill { height: 100%; background: #6366f1; border-radius: 10px; }

/* LOADER */
.lds-dual-ring { display: inline-block; width: 24px; height: 24px; }
.lds-dual-ring:after { content: " "; display: block; width: 18px; height: 18px; margin: 3px; border-radius: 50%; border: 3px solid #000; border-color: #000 transparent #000 transparent; animation: lds-dual-ring 1.2s linear infinite; }
@keyframes lds-dual-ring { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 900px) { .sync-grid { grid-template-columns: 1fr; } .input-section { position: static; } .navbar { padding: 1rem 2rem; } .nav-center { display: none; } }
</style>
