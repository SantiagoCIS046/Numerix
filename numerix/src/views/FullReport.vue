<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Galaxy from '../components/Galaxy.vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const router = useRouter()
const generating = ref(true)
const reportProgress = ref(0)

const user = computed(() => {
  const stored = localStorage.getItem('user')
  const alignment = localStorage.getItem('alignmentProfile')
  const userData = stored ? JSON.parse(stored) : null
  const alignmentData = alignment ? JSON.parse(alignment) : null
  
  return {
    nombre: alignmentData?.fullName || userData?.nombre || userData?.name || t('report.defaults.name'),
    role: userData?.role || t('report.defaults.role')
  }
})

const reportData = computed(() => ({
  vibracion_maestra: 33,
  resumen_almas: t('report.defaults.summary'),
  pilares: [
    { title: t('report.pillars.identity.title'), value: t('report.pillars.identity.value'), icon: '☀️', desc: t('report.pillars.identity.desc') },
    { title: t('report.pillars.path.title'), value: t('report.pillars.path.value'), icon: '🏹', desc: t('report.pillars.path.desc') },
    { title: t('report.pillars.freq.title'), value: t('report.pillars.freq.value'), icon: '✨', desc: t('report.pillars.freq.desc') },
  ],
  modulos_detalle: [
    { id: 'numerologia', title: t('report.modules.numerology.title'), content: t('report.modules.numerology.content') },
    { id: 'astrologia', title: t('report.modules.astrology.title'), content: t('report.modules.astrology.content') },
    { id: 'aura', title: t('report.modules.aura.title'), content: t('report.modules.aura.content') },
  ]
}))

onMounted(() => {
  const interval = setInterval(() => {
    reportProgress.value += 2
    if (reportProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        generating.value = false
      }, 500)
    }
  }, 50)
})

function goBack() { router.back() }

const bootstrapAlert = ref({ show: false, message: '', type: 'info' })

function showAlert(message, type = 'info') {
  bootstrapAlert.value = { show: true, message, type }
  setTimeout(() => {
    bootstrapAlert.value.show = false
  }, 4000)
}

function printReport() { 
  showAlert(t('report.alerts.preparing'), 'success')
  setTimeout(() => {
    window.print() 
  }, 1000)
}
</script>

<template>
  <div class="report-container">
    <Galaxy 
      :density="2.0"
      :glow-intensity="0.6"
      :hue-shift="220"
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
    <div v-if="generating" class="generating-overlay">
      <div class="gen-content">
        <div class="cosmic-spinner">
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="ring"></div>
          <div class="core">✨</div>
        </div>
        <h2>{{ t('report.overlay.title') }}</h2>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" :style="{ width: reportProgress + '%' }"></div>
        </div>
        <p class="progress-text">{{ reportProgress }}% - {{ t('report.overlay.sync') }}</p>
      </div>
    </div>

    <div v-else class="report-content animate-in">
      <header class="report-header">
        <div class="header-left">
          <button class="back-btn" @click="goBack">{{ t('report.header.back') }}</button>
          <div class="logo">{{ t('report.header.logo') }}</div>
        </div>
        <div class="header-right">
          <span class="report-id">ID: #AST-{{ Date.now().toString().slice(-6) }}</span>
          <button class="print-btn" @click="printReport">{{ t('report.header.download') }}</button>
        </div>
      </header>

      <main class="report-main">
        <section class="hero-summary">
          <div class="hero-blur"></div>
          <div class="user-intro">
            <p class="tag">{{ t('report.hero.tag') }}</p>
            <h1>{{ user?.nombre }}</h1>
            <div class="vibration-badge">{{ t('report.hero.vibration') }} {{ reportData.vibracion_maestra }}</div>
          </div>
          <div class="summary-box">
             <p>{{ reportData.resumen_almas }}</p>
          </div>
        </section>

        <section class="pillars-grid">
          <div v-for="pilar in reportData.pilares" :key="pilar.title" class="pilar-card">
            <span class="pilar-icon">{{ pilar.icon }}</span>
            <div class="pilar-info">
              <h3>{{ pilar.title }}</h3>
              <p class="pilar-val">{{ pilar.value }}</p>
              <p class="pilar-desc">{{ pilar.desc }}</p>
            </div>
          </div>
        </section>

        <section class="detailed-analysis">
          <div v-for="mod in reportData.modulos_detalle" :key="mod.id" class="analysis-module">
            <div class="module-header">
              <span class="module-dot"></span>
              <h2>{{ mod.title }}</h2>
            </div>
            <div class="module-body">
              <p>{{ mod.content }}</p>
            </div>
          </div>
        </section>

        <section class="certification">
          <div class="cert-seal">💠</div>
          <p>{{ t('report.certification.desc') }}</p>
          <div class="signature">{{ t('report.certification.signature') }}</div>
        </section>
      </main>

      <footer class="report-footer">
        <a href="#" @click.prevent="showAlert(t('report.alerts.encrypted'), 'info')" style="color: inherit; text-decoration: none;">{{ t('report.footer') }}</a>
      </footer>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

.report-container { 
  background: #020204; 
  color: #fff; 
  min-height: 100vh; 
  font-family: 'Outfit', sans-serif;
  overflow-x: hidden;
  position: relative;
}

.galaxy-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.7;
}

/* GENERATING OVERLAY */
.generating-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: #050508; z-index: 2000;
  display: flex; align-items: center; justify-content: center; text-align: center;
}
.gen-content { max-width: 400px; width: 90%; }
.cosmic-spinner { width: 100px; height: 100px; margin: 0 auto 3rem; position: relative; }
.ring { position: absolute; border: 2px solid transparent; border-radius: 50%; animation: spin 2s linear infinite; }
.ring:nth-child(1) { width: 100%; height: 100%; border-top-color: #6366f1; animation-duration: 3s; }
.ring:nth-child(2) { width: 80%; height: 80%; top: 10%; left: 10%; border-left-color: #a855f7; animation-direction: reverse; }
.ring:nth-child(3) { width: 60%; height: 60%; top: 20%; left: 20%; border-bottom-color: #ec4899; }
.core { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.5rem; }

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.gen-content h2 { font-size: 1rem; letter-spacing: 5px; color: rgba(255, 255, 255, 0.6); margin-bottom: 2rem; }

.progress-bar-container { height: 4px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; overflow: hidden; margin-bottom: 1rem; }
.progress-bar-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); transition: width 0.1s; }
.progress-text { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); letter-spacing: 1px; }

/* MAIN CONTENT */
.report-content { padding-bottom: 5rem; }
.animate-in { animation: fadeInScale 1s cubic-bezier(0.19, 1, 0.22, 1); }
@keyframes fadeInScale { from { opacity: 0; transform: scale(0.98) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.report-header { 
  display: flex; justify-content: space-between; align-items: center; 
  padding: 2.5rem 4rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(2, 2, 4, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-sizing: border-box;
}
.header-left { display: flex; align-items: center; gap: 2rem; }
.back-btn { background: none; border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.5); padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; font-size: 0.7rem; font-weight: 700; }
.back-btn:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
.logo { font-weight: 800; letter-spacing: 6px; font-size: 0.9rem; color: #6366f1; }
.report-id { font-size: 0.7rem; color: rgba(255, 255, 255, 0.3); margin-right: 2rem; }
.print-btn { background: #fff; color: #000; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-size: 0.75rem; font-weight: 800; cursor: pointer; }

.report-main { 
  max-width: 900px; 
  margin: 0 auto; 
  padding: 12rem 2rem 6rem; 
  position: relative;
  z-index: 5;
}

.hero-summary { text-align: center; margin-bottom: 6rem; position: relative; }
.hero-blur { position: absolute; top: -50px; left: 50%; transform: translateX(-50%); width: 400px; height: 300px; background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%); z-index: -1; }
.tag { font-weight: 800; letter-spacing: 4px; font-size: 0.7rem; color: #6366f1; margin-bottom: 1rem; }
.hero-summary h1 { font-family: 'Playfair Display', serif; font-size: 4.5rem; margin: 0; font-style: italic; }
.vibration-badge { display: inline-block; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 0.5rem 1.5rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; margin: 2rem 0; }
.summary-box { max-width: 600px; margin: 2rem auto 0; color: rgba(255, 255, 255, 0.6); line-height: 1.8; font-size: 1.1rem; }

.pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 8rem; }
.pilar-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 2.5rem; border-radius: 24px; text-align: center; transition: background 0.3s; }
.pilar-card:hover { background: rgba(255, 255, 255, 0.04); }
.pilar-icon { font-size: 2.5rem; display: block; margin-bottom: 1.5rem; }
.pilar-card h3 { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
.pilar-val { font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem; }
.pilar-desc { font-size: 0.85rem; color: rgba(255, 255, 255, 0.4); line-height: 1.5; }

.detailed-analysis { display: flex; flex-direction: column; gap: 4rem; margin-bottom: 8rem; }
.analysis-module { border-left: 1px solid rgba(99, 102, 241, 0.3); padding-left: 3rem; }
.module-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.module-dot { width: 8px; height: 8px; background: #6366f1; border-radius: 50%; box-shadow: 0 0 10px #6366f1; }
.analysis-module h2 { font-size: 1.5rem; font-weight: 800; letter-spacing: 1px; }
.module-body p { color: rgba(255, 255, 255, 0.7); line-height: 1.8; font-size: 1.05rem; }

.certification { text-align: center; padding: 4rem; border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 32px; }
.cert-seal { font-size: 3rem; margin-bottom: 2rem; color: #6366f1; }
.certification p { font-size: 0.9rem; color: rgba(255, 255, 255, 0.5); font-style: italic; margin-bottom: 2rem; }
.signature { font-family: 'Playfair Display', serif; font-size: 1.5rem; }

.report-footer { text-align: center; font-size: 0.7rem; color: rgba(255, 255, 255, 0.2); border-top: 1px solid rgba(255, 255, 255, 0.05); padding: 4rem; }

/* Cosmic Alert Top */
.cosmic-alert-top {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2200;
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
@media print {
  .cosmic-alert-top { display: none !important; }
}

@media (max-width: 768px) {
  .pillars-grid { grid-template-columns: 1fr; }
  .report-header { padding: 1.5rem 2rem; }
  .hero-summary h1 { font-size: 3rem; }
}

@media print {
  .back-btn, .print-btn { display: none; }
  .report-container { background: #fff !important; color: #000 !important; }
  .pilar-card, .analysis-module, .certification { border-color: #eee !important; background: #fafafa !important; }
  .pilar-val, .logo, .tag, .vibration-badge { color: #000 !important; }
  .analysis-module { border-left-color: #000 !important; }
  .module-dot { background: #000 !important; }
}
</style>
