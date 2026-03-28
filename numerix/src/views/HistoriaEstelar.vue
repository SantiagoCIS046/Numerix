<template>
  <div class="history-page">
    <div class="cosmic-bg"></div>
    <div class="stars-overlay"></div>

    <!-- Header -->
    <header class="header">
      <div class="brand" @click="navigateTo('/home')" style="cursor: pointer;">
        <div class="logo-box">✨</div>
        <div>
          <h1 class="brand-title">{{ t('history.title') }}</h1>
          <p class="brand-sub">{{ t('history.subtitle') }}</p>
        </div>
      </div>
      <nav class="nav">
        <a href="#" @click.prevent="navigateTo('/home')">{{ t('history.nav.panel') }}</a>
        <a href="#" class="active">{{ t('history.nav.chronology') }}</a>
        <a href="#" @click.prevent="navigateTo('/lecturas')">{{ t('history.nav.arcana') }}</a>
        <div class="user-avatar">
          <img :src="`https://ui-avatars.com/api/?name=${user.nombre}&background=222&color=fff`" alt="User">
        </div>
      </nav>
    </header>

    <main class="content">
      <div class="content-header">
        <div>
          <h2 class="title">{{ t('history.timelineTitle') }} <span class="highlight">{{ t('history.timelineHighlight') }}</span></h2>
          <p class="subtitle">{{ t('history.timelineDesc') }}</p>
        </div>
        <div class="actions">
          <div class="selector">
            <span class="sel-label">{{ t('history.filters.alignment') }}</span>
            <div class="cosmic-dropdown" :class="{ 'is-open': isDropdownOpen }">
              <div class="dropdown-header" @click="toggleDropdown">
                <span>{{ activeFilter }}</span>
                <span class="arrow">▼</span>
              </div>
              <div v-if="isDropdownOpen" class="dropdown-list">
                <div 
                  v-for="f in filters" 
                  :key="f" 
                  class="dropdown-item"
                  @click="setFilter(f)"
                >
                  {{ f }}
                </div>
              </div>
            </div>
          </div>
          <div class="selector">
            <span class="sel-label">{{ t('history.filters.era') }}</span>
            <div class="cosmic-dropdown" :class="{ 'is-open': isEraOpen }">
              <div class="dropdown-header" @click="toggleEra">
                <span>{{ activeEra }}</span>
                <span class="arrow">▼</span>
              </div>
              <div v-if="isEraOpen" class="dropdown-list">
                <div 
                  v-for="e in eraOptions" 
                  :key="e" 
                  class="dropdown-item"
                  @click="setEra(e)"
                >
                  {{ e }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div v-if="!isNewUser" class="timeline-container" :style="{ transform: `scale(${zoomScale})` }">
        <div class="timeline-line"></div>
        
        <div class="timeline-events">
          <div 
            v-for="(event, index) in filteredEvents" 
            :key="event.id"
            class="event-wrapper"
            :class="{ 'event-left': index % 2 === 0, 'event-right': index % 2 !== 0 }"
          >
            <div class="event-node"></div>
            <div class="event-card">
              <p class="event-date">{{ event.date }} • {{ event.type }}</p>
              <h3 class="event-title">{{ event.title }}</h3>
              <div class="event-tags">
                <span v-for="tag in event.labels" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <p class="event-desc">{{ event.desc }}</p>
            </div>
          </div>
        </div>

        <div class="zoom-controls">
          <button class="zoom-btn" @click="adjustZoom(0.1)">+</button>
          <button class="zoom-btn" @click="adjustZoom(-0.1)">-</button>
        </div>
      </div>

      <!-- Empty State for New Users -->
      <div v-else class="empty-astral-state">
        <div class="empty-icon">🌑</div>
        <h3 class="empty-title">{{ t('history.empty.title') }}</h3>
        <p class="empty-desc" v-html="t('history.empty.desc')"></p>
        <button class="generate-btn" @click="navigateTo('/lecturas')">{{ t('history.empty.btn') }}</button>
      </div>

      <div v-if="!isNewUser" class="center-action">
        <button class="descend-btn" @click="scrollToTimeline">{{ t('history.descendBtn') }}</button>
      </div>

      <!-- User Stats Floating -->
      <div class="user-stats-floating">
        <div class="stats-item">
          <span class="stats-label">{{ t('history.stats.user') }}</span>
          <span class="stats-val">{{ user.nombre }}</span>
        </div>
        <div class="stats-item">
          <span class="stats-label">{{ t('history.stats.plan') }}</span>
          <span class="stats-val highlight-gold">{{ user.plan }}</span>
        </div>
        <div class="stats-item">
          <span class="stats-label">{{ t('history.stats.start') }}</span>
          <span class="stats-val">{{ user.startDate }}</span>
        </div>
        <div class="stats-item">
          <span class="stats-label">{{ t('history.stats.status') }}</span>
          <span class="stats-val">{{ user.alignmentStatus }}</span>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-left">
        <p>{{ t('history.footer.currentAlign') }}</p>
        <p class="footer-highlight">{{ t('history.footer.neptune') }}</p>
      </div>
      <div class="footer-links">
        <a href="#">{{ t('history.footer.ethics') }}</a>
        <a href="#">{{ t('history.footer.voidPolicy') }}</a>
        <a href="#">{{ t('history.footer.api') }}</a>
        <p>© 2024 {{ t('history.footer.corp') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import { getMovimientos } from "../services/data";
import { useAuthStore } from "../store/auth";

const { t } = useI18n()

const router = useRouter()

// --- DATA ---
const user = computed(() => {
  const store = useAuthStore();
  const userData = store.user;
  const alignment = localStorage.getItem('alignmentProfile')
  const subscription = localStorage.getItem('userSubscription')
  
  const alignmentData = alignment ? JSON.parse(alignment) : null
  const subData = subscription ? JSON.parse(subscription) : null
  
  return {
    nombre: alignmentData?.fullName || userData?.nombre || userData?.name || 'VIAJERO ASTRAL',
    plan: subData?.name || t('history.stats.planLunar'),
    startDate: subData?.date ? new Date(subData.date).toLocaleDateString() : '03 ENE, 2024',
    rawDate: subData?.date || new Date().toISOString(),
    alignmentStatus: alignmentData ? t('history.stats.complete') : t('history.stats.pending')
  }
})

const isNewUser = computed(() => {
  const start = new Date(user.value.rawDate)
  const today = new Date()
  return (today - start) < (7 * 24 * 60 * 60 * 1000)
})

const movements = ref([])

onMounted(async () => {
  try {
    const data = await getMovimientos();
    movements.value = data.movimientos || data;
  } catch (err) {
    console.error("Error al cargar movimientos:", err);
  }
})

const timelineEvents = computed(() => {
  if (movements.value.length > 0) {
    return movements.value;
  }
  // Fallback a eventos estáticos si no hay datos en el backend
  return [
  {
    id: 1,
    date: '14 NOV, 2024',
    type: t('history.events.0.type'),
    title: t('history.events.0.title'),
    labels: t('history.events.0.labels'),
    desc: t('history.events.0.desc'),
    active: true
  },
  {
    id: 2,
    date: '28 OCT, 2024',
    type: t('history.events.1.type'),
    title: t('history.events.1.title'),
    labels: t('history.events.1.labels'),
    desc: t('history.events.1.desc'),
    active: false
  },
  {
    id: 3,
    date: '12 SEP, 2024',
    type: t('history.events.2.type'),
    title: t('history.events.2.title'),
    labels: t('history.events.2.labels'),
    desc: t('history.events.2.desc'),
    active: false
  },
  {
    id: 4,
    date: '05 AGO, 2024',
    type: t('history.events.3.type'),
    title: t('history.events.3.title'),
    labels: t('history.events.3.labels'),
    desc: t('history.events.3.desc'),
    active: false
  }
]
})

const activeFilter = ref(t('history.filters.all'))
const filters = computed(() => [t('history.filters.all'), t('history.filters.transits'), t('history.filters.numerology'), t('history.filters.maps')])
const zoomScale = ref(1)
const isDropdownOpen = ref(false)
const isEraOpen = ref(false)

const activeEra = ref(t('history.filters.sun30'))
const eraOptions = computed(() => [t('history.filters.sun7'), t('history.filters.sun30'), t('history.filters.sun90'), t('history.filters.allTime')])

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) isEraOpen.value = false
}

function toggleEra() {
  isEraOpen.value = !isEraOpen.value
  if (isEraOpen.value) isDropdownOpen.value = false
}

function setFilter(f) {
  activeFilter.value = f
  isDropdownOpen.value = false
}

function setEra(e) {
  activeEra.value = e
  isEraOpen.value = false
}

const filteredEvents = computed(() => {
  let events = timelineEvents.value

  // Alignment Filter
  if (activeFilter.value !== t('history.filters.all')) {
    const filterMap = {
      [t('history.filters.transits')]: t('history.events.0.type'),
      [t('history.filters.numerology')]: t('history.events.1.type'),
      [t('history.filters.maps')]: t('history.events.2.type')
    }
    const targetType = filterMap[activeFilter.value]
    events = events.filter(ev => ev.type === targetType)
  }

  // Era Filter
  if (activeEra.value === t('history.filters.sun7')) {
    return events.slice(0, 1)
  } else if (activeEra.value === t('history.filters.sun30')) {
    return events.slice(0, 3)
  } else if (activeEra.value === t('history.filters.sun90')) {
    return events.slice(0, 4)
  }

  return events
})

function adjustZoom(delta) {
  const newScale = zoomScale.value + delta
  if (newScale >= 0.5 && newScale <= 2) {
    zoomScale.value = newScale
  }
}

function navigateTo(path) {
  router.push(path)
}

function goBack() {
  router.back()
}

function scrollToTimeline() {
  const el = document.querySelector('.timeline-container') || document.querySelector('.empty-astral-state')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&display=swap');

.history-page {
  min-height: 100vh;
  background-color: #050508;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.cosmic-bg {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 70% 20%, rgba(30, 20, 80, 0.4) 0%, transparent 60%),
              radial-gradient(circle at 10% 80%, rgba(20, 10, 50, 0.4) 0%, transparent 60%);
  z-index: 0;
}

.stars-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)), 
                    radial-gradient(1.5px 1.5px at 100px 100px, #fff, rgba(0,0,0,0));
  background-size: 200px 200px;
  opacity: 0.1;
  z-index: 1;
}

/* Header */
.header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(5, 5, 8, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.brand { display: flex; align-items: center; gap: 1rem; }
.logo-box {
  width: 40px; height: 40px;
  background: #3b28cc;
  border-radius: 8px;
  display: flex;
  align-items: center; justify-content: center;
  font-size: 1.2rem;
}

.brand-title {
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  letter-spacing: 2px;
  margin: 0;
}
.brand-sub {
  font-size: 0.6rem;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.4);
  margin: 0;
}

.nav { display: flex; align-items: center; gap: 3rem; }
.nav a {
  text-decoration: none;
  color: rgba(255,255,255,0.5);
  font-size: 0.75rem;
  letter-spacing: 2px;
  font-weight: 600;
  transition: 0.3s;
}
.nav a:hover, .nav a.active { color: #8257ff; }
.nav a.active { border-bottom: 2px solid #8257ff; padding-bottom: 4px; }

.user-avatar {
  width: 35px; height: 35px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.2);
  overflow: hidden;
}
.user-avatar img { width: 100%; height: 100%; object-fit: cover; }

/* Content */
.content {
  flex: 1;
  padding: 4rem 10%;
  position: relative;
  z-index: 5;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 6rem;
}

.title {
  font-family: 'Cinzel', serif;
  font-size: 3rem;
  margin: 0 0 1rem 0;
}
.highlight { color: #8257ff; }
.subtitle {
  color: rgba(255,255,255,0.5);
  letter-spacing: 1px;
}

.actions { display: flex; gap: 2rem; }
.selector { display: flex; flex-direction: column; gap: 0.5rem; }
.sel-label {
  font-size: 0.6rem;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.3);
}
.cosmic-dropdown {
  position: relative;
  min-width: 200px;
  z-index: 50;
}

.dropdown-header {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(130, 87, 255, 0.2);
  color: #fff;
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.dropdown-header:hover {
  background: rgba(130, 87, 255, 0.05);
  border-color: rgba(130, 87, 255, 0.5);
}

.is-open .dropdown-header {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-color: #8257ff;
}

.arrow {
  font-size: 0.6rem;
  transition: transform 0.3s;
  opacity: 0.5;
}

.is-open .arrow { transform: rotate(180deg); }

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #0a0a14;
  border: 1px solid #8257ff;
  border-top: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  animation: dropdownFade 0.3s ease-out;
}

.dropdown-item {
  padding: 0.8rem 1.2rem;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  transition: 0.2s;
}

.dropdown-item:hover {
  background: rgba(130, 87, 255, 0.15);
  color: #fff;
  padding-left: 1.5rem;
}

.cosmic-select-custom {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 0.8rem 1.2rem;
  border-radius: 4px;
  font-size: 0.85rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  cursor: pointer;
}

@keyframes dropdownFade {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Timeline */
.timeline-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 0;
}

.timeline-line {
  position: absolute;
  top: 0; bottom: 0; left: 50%;
  width: 2px;
  background: linear-gradient(to bottom, transparent, #8257ff 15%, #8257ff 85%, transparent);
  transform: translateX(-50%);
}

.timeline-events {
  display: flex;
  flex-direction: column;
  gap: 8rem;
}

.event-wrapper {
  position: relative;
  width: 100%;
  display: flex;
}

.event-left { justify-content: flex-start; }
.event-right { justify-content: flex-end; }

.event-card {
  width: 450px;
  padding: 2.5rem;
  background: rgba(15, 10, 30, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  position: relative;
  transition: 0.4s;
}
.event-card:hover { border-color: #8257ff; transform: translateY(-5px); }

.event-node {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px; height: 14px;
  background: #8257ff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px #8257ff;
}

.event-date {
  font-size: 0.7rem;
  color: #8257ff;
  letter-spacing: 3px;
  margin-bottom: 1rem;
}
.event-title {
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
}

.event-tags { display: flex; gap: 0.8rem; margin-bottom: 1.5rem; }
.tag {
  font-size: 0.6rem;
  letter-spacing: 1.5px;
  padding: 0.4rem 0.8rem;
  background: rgba(130, 87, 255, 0.1);
  border: 1px solid rgba(130, 87, 255, 0.2);
  border-radius: 4px;
}

.event-desc {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.6);
  font-style: italic;
}

.zoom-controls {
  position: fixed;
  right: 4rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 100;
}

.zoom-btn {
  width: 50px; height: 50px;
  border-radius: 50%;
  background: rgba(130, 87, 255, 0.2);
  border: 1px solid rgba(130, 87, 255, 0.4);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: 0.3s;
}

.zoom-btn:hover {
  background: #8257ff;
  box-shadow: 0 0 20px rgba(130, 87, 255, 0.4);
  transform: scale(1.1);
}

/* Empty State */
.empty-astral-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10rem 0;
  animation: fadeIn 1s ease-out;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
  opacity: 0.5;
  filter: drop-shadow(0 0 30px rgba(130, 87, 255, 0.2));
}

.empty-title {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  letter-spacing: 5px;
  margin-bottom: 1.5rem;
}

.empty-desc {
  color: rgba(255,255,255,0.4);
  line-height: 2;
  font-size: 1.1rem;
  margin-bottom: 4rem;
}

.generate-btn {
  background: #8257ff;
  border: none;
  padding: 1.2rem 3rem;
  color: #fff;
  letter-spacing: 3px;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: bold;
}

.generate-btn:hover {
  background: #6a44d1;
  box-shadow: 0 0 40px rgba(130, 87, 255, 0.4);
  transform: translateY(-3px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.center-action { display: flex; justify-content: center; margin-top: 10rem; }
.descend-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.2rem 3rem;
  color: #fff;
  letter-spacing: 4px;
  font-size: 0.75rem;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s;
}
.descend-btn:hover { background: #fff; color: #000; letter-spacing: 6px; }

/* Floating Stats (Added) */
.user-stats-floating {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  background: rgba(10, 5, 20, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  z-index: 100;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.stats-item { display: flex; flex-direction: column; gap: 0.3rem; }
.stats-label { font-size: 0.6rem; color: rgba(255,255,255,0.4); letter-spacing: 2px; }
.stats-val { font-size: 0.8rem; font-weight: 600; letter-spacing: 1px; }
.highlight-gold { color: #fbbf24; }

/* Footer */
.footer {
  padding: 3rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255,255,255,0.05);
  font-size: 0.7rem;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.3);
}

.footer-highlight { color: #8257ff; margin-top: 0.5rem; }
.footer-links { display: flex; gap: 3rem; align-items: center; }
.footer-links a { text-decoration: none; color: inherit; transition: 0.3s; }
.footer-links a:hover { color: #fff; }

@media (max-width: 1024px) {
  .timeline-line { left: 40px; }
  .event-node { left: 40px; }
  .event-card { width: calc(100% - 100px); margin-left: 80px; }
  .event-right { justify-content: flex-start; }
  .content-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
  .user-stats-floating { display: none; }
}
</style>
