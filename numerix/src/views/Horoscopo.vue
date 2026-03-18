<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import Galaxy from '../components/Galaxy.vue'

const { t } = useI18n()

const router = useRouter()
const activeCategory = ref('love')
const showSignSelector = ref(false)

const zodiacSigns = [
  { id: 'aries', name: 'Aries', icon: '♈' },
  { id: 'tauro', name: 'Tauro', icon: '♉' },
  { id: 'geminis', name: 'Géminis', icon: '♊' },
  { id: 'cancer', name: 'Cáncer', icon: '♋' },
  { id: 'leo', name: 'Leo', icon: '♌' },
  { id: 'virgo', name: 'Virgo', icon: '♍' },
  { id: 'libra', name: 'Libra', icon: '♎' },
  { id: 'escorpio', name: 'Escorpio', icon: '♏' },
  { id: 'sagitario', name: 'Sagitario', icon: '♐' },
  { id: 'capricornio', name: 'Capricornio', icon: '♑' },
  { id: 'acuario', name: 'Acuario', icon: '♒' },
  { id: 'piscis', name: 'Piscis', icon: '♓' }
]

const selectedSign = ref('Tauro')

const user = computed(() => {
  const stored = localStorage.getItem('user')
  const alignment = localStorage.getItem('alignmentProfile')
  const userData = stored ? JSON.parse(stored) : null
  const alignmentData = alignment ? JSON.parse(alignment) : null
  
  return {
    nombre: alignmentData?.fullName || userData?.nombre || userData?.name || 'VIAJERO ASTRAL',
    signo: selectedSign.value,
    role: userData?.role || 'BUSCADOR CÓSMICO'
  }
})

import { onMounted } from 'vue'
onMounted(() => {
  const stored = localStorage.getItem('user')
  const alignment = localStorage.getItem('alignmentProfile')
  const userData = stored ? JSON.parse(stored) : null
  const alignmentData = alignment ? JSON.parse(alignment) : null
  const initialSign = alignmentData?.signo || userData?.signo || 'Tauro'
  selectedSign.value = initialSign
})

function selectSign(signName) {
  selectedSign.value = signName
  showSignSelector.value = false
  
  // Opcional: Persistir el cambio
  const alignment = localStorage.getItem('alignmentProfile')
  if (alignment) {
    const data = JSON.parse(alignment)
    data.signo = signName
    localStorage.setItem('alignmentProfile', JSON.stringify(data))
  }
}

const categories = computed(() => [
  { id: 'love', label: t('horoscope.categories.love'), icon: '❤️' },
  { id: 'work', label: t('horoscope.categories.work'), icon: '💼' },
  { id: 'health', label: t('horoscope.categories.health'), icon: '🌿' },
  { id: 'money', label: t('horoscope.categories.money'), icon: '💰' },
])

const predictions = computed(() => ({
  'love': t('horoscope.predictions.love'),
  'work': t('horoscope.predictions.work'),
  'health': t('horoscope.predictions.health'),
  'money': t('horoscope.predictions.money'),
}))

const navLinks = computed(() => [
  { label: t('nav.predictions'), path: '/lecturas', active: false },
  { label: t('nav.chart'), path: '/carta-natal', active: false },
  { label: t('nav.compat'), path: '/compatibilidad', active: false },
  { label: 'Horóscopo', path: '/horoscopo', active: true },
])

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
  <div class="horoscopo-container">
    <Galaxy 
      :density="1.3"
      :glow-intensity="0.3"
      :hue-shift="200"
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
        <button class="nav-back-btn" @click="goBack"><span>←</span> {{ t('nav.back') }}</button>
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
      <section class="horoscopo-hero">
        <div class="hero-glow"></div>
        <p class="hero-tag">{{ t('horoscope.heroTag') }}</p>
        <h1 class="hero-title">{{ t('horoscope.title') }}</h1>
        <div class="sign-tag-wrapper">
          <button class="sign-tag-btn" @click="showSignSelector = true">
            <span class="sign-text">{{ user?.signo || 'Tauro' }}</span>
            <span class="edit-icon">✎</span>
          </button>
        </div>
      </section>

      <!-- SIGN SELECTOR MODAL -->
      <Transition name="fade-scale">
        <div v-if="showSignSelector" class="sign-modal-overlay" @click.self="showSignSelector = false">
          <div class="sign-modal-card">
            <header class="modal-header">
              <h3>ELIGE TU SIGNO</h3>
              <button class="close-modal" @click="showSignSelector = false">✕</button>
            </header>
            <div class="signs-grid">
              <button 
                v-for="s in zodiacSigns" 
                :key="s.id" 
                class="sign-btn"
                :class="{ active: selectedSign === s.name }"
                @click="selectSign(s.name)"
              >
                <span class="sign-icon">{{ s.icon }}</span>
                <span class="sign-name">{{ s.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <section class="prediction-card">
        <div class="category-tabs">
          <button 
            v-for="cat in categories" 
            :key="cat.id" 
            :class="['cat-tab', { active: activeCategory === cat.id }]"
            @click="activeCategory = cat.id"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span class="cat-name">{{ cat.label }}</span>
          </button>
        </div>

        <div class="prediction-content animate-fade">
          <div class="quote-mark">“</div>
          <p class="prediction-text">{{ predictions[activeCategory] }}</p>
          <div class="prediction-meta">{{ t('horoscope.vibration') }} <strong>{{ t('horoscope.vibrationVal') }}</strong></div>
        </div>
      </section>

      <div class="side-sections">
        <section class="master-advice">
          <h2 class="section-title">{{ t('horoscope.masterAdvice') }}</h2>
          <div class="advice-box">
             <p>{{ t('horoscope.masterQuote') }}</p>
             <span class="master-sig">{{ t('horoscope.masterSig') }}</span>
          </div>
        </section>

        <section class="lucky-numbers">
          <h2 class="section-title">{{ t('horoscope.luckyNumbers') }}</h2>
          <div class="numbers-grid">
            <div class="num-circle">11</div>
            <div class="num-circle">23</div>
            <div class="num-circle">47</div>
            <div class="num-circle">8</div>
          </div>
        </section>
      </div>
    </main>

    <footer class="page-footer">
      <div class="footer-left">© 2024 {{ t('horoscope.footer') }}</div>
      <div class="footer-right"><a href="#" @click.prevent="showAlert(t('horoscope.privacyAlert'), 'info')">{{ t('horoscope.privacy') }}</a></div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

.horoscopo-container { 
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
  opacity: 0.5;
}

/* NAVBAR (Same) */
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
  max-width: 1000px; 
  margin: 0 auto; 
  width: 100%; 
  position: relative;
  z-index: 1;
}

.horoscopo-hero { text-align: center; margin-bottom: 4rem; position: relative; }
.hero-glow { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 400px; height: 200px; background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%); z-index: -1; }
.hero-tag { color: #6366f1; font-weight: 800; letter-spacing: 4px; font-size: 0.75rem; margin-bottom: 1rem; }
.hero-title { font-size: 3.5rem; font-weight: 800; margin: 0; }
.sign-tag { display: inline-block; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); color: #6366f1; padding: 0.4rem 1.5rem; border-radius: 50px; font-weight: 800; font-size: 0.9rem; margin-top: 1rem; text-transform: uppercase; letter-spacing: 2px; }

.prediction-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 32px; padding: 3rem; margin-bottom: 3rem; backdrop-filter: blur(20px); }

.category-tabs { display: flex; justify-content: center; gap: 1rem; margin-bottom: 3rem; }
.cat-tab { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.5); padding: 0.8rem 1.5rem; border-radius: 16px; cursor: pointer; display: flex; align-items: center; gap: 0.8rem; transition: all 0.3s; }
.cat-tab:hover { background: rgba(255, 255, 255, 0.08); }
.cat-tab.active { background: #fff; color: #000; border-color: #fff; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1); }
.cat-icon { font-size: 1.2rem; }
.cat-name { font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }

.prediction-content { text-align: center; position: relative; padding: 0 2rem; }
.quote-mark { font-size: 6rem; color: rgba(99, 102, 241, 0.1); position: absolute; top: -40px; left: 0; font-family: serif; }
.prediction-text { font-size: 1.25rem; line-height: 1.8; color: rgba(255, 255, 255, 0.8); margin-bottom: 2.5rem; position: relative; z-index: 1; }
.prediction-meta { font-size: 0.8rem; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 1px; }
.prediction-meta strong { color: #6366f1; }

.side-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.master-advice, .lucky-numbers { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; padding: 2rem; }
.section-title { font-size: 0.8rem; font-weight: 800; color: rgba(255, 255, 255, 0.3); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1.5rem; }

.advice-box p { font-style: italic; color: rgba(255, 255, 255, 0.7); line-height: 1.6; font-size: 0.95rem; margin-bottom: 1rem; }
.master-sig { display: block; text-align: right; color: #6366f1; font-weight: 800; font-size: 0.7rem; letter-spacing: 2px; }

.numbers-grid { display: flex; justify-content: center; gap: 1rem; }
.num-circle { width: 48px; height: 48px; border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #6366f1; background: rgba(99, 102, 241, 0.05); }

.animate-fade { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.page-footer { margin-top: auto; padding: 3rem 4rem; border-top: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: rgba(255, 255, 255, 0.3); }
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

/* SIGN MODAL styles */
.sign-tag-wrapper { margin-top: 1.5rem; }
.sign-tag-btn {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  padding: 0.6rem 2rem;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s;
}
.sign-tag-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}
.edit-icon { font-size: 0.8rem; opacity: 0.5; }

.sign-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(2, 2, 5, 0.85);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign-modal-card {
  background: rgba(15, 20, 35, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  width: 90%;
  max-width: 600px;
  padding: 2.5rem;
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.modal-header h3 { font-family: 'Outfit', sans-serif; font-weight: 800; letter-spacing: 3px; font-size: 1.2rem; color: #6366f1; }
.close-modal { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; opacity: 0.5; }
.close-modal:hover { opacity: 1; }

.signs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.sign-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
}

.sign-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-5px);
}

.sign-btn.active {
  background: #6366f1;
  border-color: #6366f1;
}
.sign-btn.active .sign-name { color: #fff; }
.sign-btn.active .sign-icon { color: #fff; }

.sign-icon { font-size: 2rem; color: #6366f1; }
.sign-name { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: rgba(255, 255, 255, 0.6); }

/* Transitions */
.fade-scale-enter-active, .fade-scale-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.9); }

@media (max-width: 900px) { .side-sections { grid-template-columns: 1fr; } .category-tabs { flex-wrap: wrap; } .navbar { padding: 1rem 2rem; } .nav-center { display: none; } .signs-grid { grid-template-columns: repeat(3, 1fr); } }
</style>
