<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = computed(() => {
  const stored = localStorage.getItem('user')
  return stored ? JSON.parse(stored) : { name: 'JULIÁN VANE', role: 'BUSCADOR NIVEL 11' }
})

const menuItems = [
  { icon: '🪄', label: 'INICIO', active: true },
  { icon: '✨', label: 'LECTURAS', active: false },
  { icon: '🌍', label: 'COMUNIDAD', active: false },
  { icon: '✨', label: 'ALINEACIÓN', active: false, route: '/alineacion' },
  { icon: '⚙️', label: 'CONFIGURACIÓN', active: false },
]

const astronomicalData = [
  { label: 'TRÁNSITO ACTUAL', value: 'SOL_EN_PISCIS', icon: '☀️' },
  { label: 'FASE LUNAR', value: 'GIBOSA_MENGUANTE', icon: '🌙' },
  { label: 'TIEMPO CELESTIAL', value: 'XXI : IV : MMXXIV', icon: '🕒' },
]

const modules = [
  { title: 'VIBRACIÓN', icon: '☀️' },
  { title: 'MISIÓN DE VIDA', icon: '❓' },
  { title: 'COMPATIBILIDAD', icon: '👥' },
]

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/auth')
}
</script>

<template>
  <div class="dashboard-layout">
    <div class="stars-fixed"></div>
    
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-inner">
            <span class="logo-spark">✨</span>
          </div>
        </div>
        <h1 class="sidebar-brand">ASTRA</h1>
        <p class="sidebar-tagline">NODO CELESTIAL</p>
      </div>

      <nav class="sidebar-nav">
        <div 
          v-for="item in menuItems" 
          :key="item.label"
          :class="['nav-item', { active: item.active }]"
          @click="item.route ? router.push(item.route) : null"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="premium-card">
          <p class="premium-title">ACCESO INFINITO</p>
          <p class="premium-desc">Desbloquea el mapa cósmico y los senderos estelares de 2024.</p>
          <button class="btn-premium">SUBIR AL NIVEL PREMIUM</button>
        </div>

        <div class="user-profile" @click="logout">
          <div class="user-avatar">
            <img src="https://ui-avatars.com/api/?name=Julian+Vane&background=fff&color=0f0c29" alt="User" />
            <div class="status-indicator"></div>
          </div>
          <div class="user-info">
            <p class="user-name">{{ user?.name || 'JULIÁN VANE' }}</p>
            <p class="user-role">{{ user?.role || 'BUSCADOR NIVEL 11' }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <!-- HEADER -->
      <header class="top-header">
        <div class="astro-data">
          <div v-for="data in astronomicalData" :key="data.label" class="astro-item">
            <span class="astro-icon">{{ data.icon }}</span>
            <div class="astro-text">
              <span class="astro-label">{{ data.label }}</span>
              <span class="astro-value">{{ data.value }}</span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-notification">
            <span class="notif-icon">🔔</span>
            <div class="notif-badge"></div>
          </button>
        </div>
      </header>

      <!-- DASHBOARD BODY -->
      <div class="dashboard-body">
        <div class="welcome-section">
          <h2 class="welcome-title">SALUDOS, <span class="highlight">{{ user?.name?.split(' ')[0] || 'JULIÁN' }}</span></h2>
          <div class="title-divider">
            <span class="divider-line"></span>
            <p class="welcome-subtitle">Las constelaciones se alinean para tu expansión creativa hoy.</p>
            <span class="divider-line"></span>
          </div>
        </div>

        <!-- FEATURED CARD -->
        <div class="featured-card">
          <div class="card-glow"></div>
          <div class="card-content">
            <span class="card-tag">ILUMINACIÓN DORADA</span>
            <h3 class="card-title">MAPEA LA CONSTELACIÓN COMPLETA DE TU DESTINO</h3>
            <p class="card-desc">
              Desbloquea las cartas de retorno solar avanzadas y los ciclos planetarios que definen tu evolución personal para la próxima década.
            </p>
            <button class="btn-revelar">
              REVELAR DESTINO <span class="btn-icon">🧭</span>
            </button>
          </div>
          <div class="card-visual">
            <div class="galaxy-viz"></div>
          </div>
        </div>

        <!-- MODULES -->
        <div class="modules-section">
          <h4 class="section-title">▲ MÓDULOS CÓSMICOS</h4>
          <div class="modules-grid">
            <div v-for="mod in modules" :key="mod.title" class="module-card">
              <div class="module-icon-container">
                <span class="module-icon">{{ mod.icon }}</span>
              </div>
              <h5 class="module-title">{{ mod.title }}</h5>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #0f0c29;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  overflow: hidden;
  position: relative;
}

.stars-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(27, 22, 65, 0.4) 0%, rgba(15, 12, 41, 1) 100%);
  z-index: 0;
}

/* SIDEBAR */
.sidebar {
  width: 280px;
  background: rgba(15, 12, 41, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 2.5rem 0;
  z-index: 10;
  backdrop-filter: blur(20px);
}

.sidebar-header {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-container {
  width: 70px;
  height: 70px;
  background: radial-gradient(circle, #c9a96e 0%, #a07840 100%);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  box-shadow: 0 0 30px rgba(201, 169, 110, 0.4);
}

.logo-inner {
  width: 100%;
  height: 100%;
  background: #0f0c29;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-spark {
  font-size: 1.8rem;
  color: #c9a96e;
}

.sidebar-brand {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 6px;
  margin: 0;
  color: #fff;
}

.sidebar-tagline {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-top: 0.4rem;
}

.sidebar-nav {
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.5rem;
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0.5rem;
}

.nav-item.active {
  background: rgba(201, 169, 110, 0.05);
  color: #c9a96e;
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-label {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1.5px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  transform: translateX(5px);
}

.sidebar-footer {
  margin-top: auto;
  padding: 0 1.5rem;
}

.premium-card {
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.1) 0%, rgba(201, 169, 110, 0.02) 100%);
  border: 1px solid rgba(201, 169, 110, 0.1);
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
}

.premium-title {
  color: #c9a96e;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin: 0 0 0.5rem;
}

.premium-desc {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
  margin-bottom: 1.2rem;
}

.btn-premium {
  width: 100%;
  padding: 0.75rem;
  background: #c9a96e;
  border: none;
  border-radius: 50px;
  color: #0f0c29;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.user-avatar {
  position: relative;
  width: 45px;
  height: 45px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(201, 169, 110, 0.3);
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #4ade80;
  border: 2px solid #0f0c29;
  border-radius: 50%;
}

.user-info p {
  margin: 0;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.user-role {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.top-header {
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.astro-data {
  display: flex;
  gap: 3rem;
}

.astro-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.astro-icon {
  font-size: 1.2rem;
  color: #c9a96e;
}

.astro-label {
  display: block;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
}

.astro-value {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  color: #fff;
}

.btn-notification {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notif-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: #c9a96e;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(201, 169, 110, 0.8);
}

/* BODY */
.dashboard-body {
  padding: 3rem 4rem;
  max-width: 1200px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 4rem;
}

.welcome-title {
  font-size: 2.8rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: 2px;
}

.welcome-title .highlight {
  color: #c9a96e;
  font-weight: 800;
}

.title-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.divider-line {
  height: 1px;
  width: 100px;
  background: linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.3), transparent);
}

.welcome-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  margin: 0;
}

/* FEATURED CARD */
.featured-card {
  position: relative;
  background: linear-gradient(135deg, rgba(20, 30, 80, 0.6) 0%, rgba(10, 15, 30, 0.8) 100%);
  border-radius: 40px;
  padding: 4rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  margin-bottom: 5rem;
}

.card-glow {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 80%;
  height: 150%;
  background: radial-gradient(circle, rgba(65, 105, 225, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

.card-content {
  flex: 1;
  position: relative;
  z-index: 2;
}

.card-tag {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: rgba(201, 169, 110, 0.1);
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: 50px;
  color: #c9a96e;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 2rem;
}

.card-title {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1.5rem;
  max-width: 600px;
}

.card-desc {
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
  font-size: 1rem;
  margin-bottom: 2.5rem;
  max-width: 500px;
}

.btn-revelar {
  padding: 1.2rem 2.5rem;
  background: #c9a96e;
  border: none;
  border-radius: 50px;
  color: #0f0c29;
  font-weight: 800;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
}

.btn-revelar:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(201, 169, 110, 0.3);
}

.card-visual {
  position: absolute;
  right: -5%;
  top: 0;
  bottom: 0;
  width: 45%;
  background: url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022&auto=format&fit=crop') center/cover;
  opacity: 0.4;
  mask-image: linear-gradient(to left, black, transparent);
}

/* MODULES */
.modules-section {
  padding-bottom: 4rem;
}

.section-title {
  color: #c9a96e;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 3px;
  margin-bottom: 3rem;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.module-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 300px; /* Highly elliptical shape */
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.4s;
  cursor: pointer;
}

.module-card:hover {
  background: rgba(201, 169, 110, 0.05);
  border-color: rgba(201, 169, 110, 0.2);
  transform: translateY(-10px);
}

.module-icon-container {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.module-icon {
  font-size: 1.5rem;
}

.module-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
}

/* RESPONSIVENESS */
@media (max-width: 1200px) {
  .astro-data { display: none; }
  .modules-grid { grid-template-columns: 1fr; }
  .featured-card { flex-direction: column; padding: 2.5rem; }
  .card-visual { position: relative; width: 100%; height: 200px; margin-top: 2rem; }
}

@media (max-width: 768px) {
  .sidebar { position: fixed; transform: translateX(-100%); transition: 0.3s; }
  .main-content { padding-left: 0; }
  .top-header, .dashboard-body { padding: 1.5rem; }
}
</style>

