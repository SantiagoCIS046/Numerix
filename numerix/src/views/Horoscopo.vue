<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Galaxy from '../components/Galaxy.vue'

const router = useRouter()
const activeCategory = ref('Amor')

const user = computed(() => {
  const stored = localStorage.getItem('user')
  const alignment = localStorage.getItem('alignmentProfile')
  const userData = stored ? JSON.parse(stored) : null
  const alignmentData = alignment ? JSON.parse(alignment) : null
  
  return {
    nombre: alignmentData?.fullName || userData?.nombre || userData?.name || 'VIAJERO ASTRAL',
    signo: alignmentData?.signo || userData?.signo || 'Tauro',
    role: userData?.role || 'BUSCADOR CÓSMICO'
  }
})

const categories = [
  { id: 'Amor', icon: '❤️' },
  { id: 'Trabajo', icon: '💼' },
  { id: 'Salud', icon: '🌿' },
  { id: 'Dinero', icon: '💰' },
]

const predictions = {
  'Amor': 'Las alineaciones de Venus sugieren un periodo de apertura emocional. Si estás en pareja, es momento de renovar compromisos. Si buscas, alguien del pasado podría reaparecer con una nueva perspectiva.',
  'Trabajo': 'Marte en tu casa del éxito impulsa proyectos estancados. No temas tomar la iniciativa en esa reunión importante. Tu visión clara será recompensada por figuras de autoridad.',
  'Salud': 'La energía de hoy pide descanso regenerativo. Evita el estrés innecesario y busca contacto con la naturaleza. Un baño de sal marina o meditación antes de dormir será clave.',
  'Dinero': 'Júpiter protege tus finanzas, pero Mercurio advierte sobre gastos impulsivos. Una oportunidad de inversión a largo plazo se presentará el viernes. Analiza los detalles con calma.',
}

const navLinks = [
  { label: 'Lectura Diaria', path: '/lecturas', active: false },
  { label: 'Carta Natal', path: '/carta-natal', active: false },
  { label: 'Compatibilidad', path: '/compatibilidad', active: false },
  { label: 'Horóscopo', path: '/horoscopo', active: true },
]

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
      <section class="horoscopo-hero">
        <div class="hero-glow"></div>
        <p class="hero-tag">PREDICCIÓN DIARIA</p>
        <h1 class="hero-title">Horóscopo</h1>
        <div class="sign-tag">{{ user?.signo || 'Tauro' }}</div>
      </section>

      <section class="prediction-card">
        <div class="category-tabs">
          <button 
            v-for="cat in categories" 
            :key="cat.id" 
            :class="['cat-tab', { active: activeCategory === cat.id }]"
            @click="activeCategory = cat.id"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span class="cat-name">{{ cat.id }}</span>
          </button>
        </div>

        <div class="prediction-content animate-fade">
          <div class="quote-mark">“</div>
          <p class="prediction-text">{{ predictions[activeCategory] }}</p>
          <div class="prediction-meta">Vibración del día: <strong>Armonía Celeste</strong></div>
        </div>
      </section>

      <div class="side-sections">
        <section class="master-advice">
          <h2 class="section-title">Consejo del Maestro</h2>
          <div class="advice-box">
             <p>"La paciencia es la forma en que el tiempo rinde culto a la eternidad. No apresures lo que el cosmos está tejiendo a tu favor."</p>
             <span class="master-sig">- EL GUÍA -</span>
          </div>
        </section>

        <section class="lucky-numbers">
          <h2 class="section-title">Números de Poder</h2>
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
      <div class="footer-left">© 2024 Astralis Daily.</div>
      <div class="footer-right"><a href="#" @click.prevent="showAlert('Tu destino es privado bajo la ley del Oráculo.', 'info')">Privacidad</a></div>
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

@media (max-width: 900px) { .side-sections { grid-template-columns: 1fr; } .category-tabs { flex-wrap: wrap; } .navbar { padding: 1rem 2rem; } .nav-center { display: none; } }
</style>
