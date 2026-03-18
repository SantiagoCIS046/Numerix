<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usuariosService, pagosService } from '@/services/api'
import { authStore } from '@/store/auth'

const router = useRouter()
const users = ref([])
const payments = ref([])
const loading = ref(true)
const error = ref(null)

// KPIs
const stats = computed(() => {
  const totalUsers = users.value.length
  const activeUsers = users.value.filter(u => u.estado !== 'inactivo').length
  const totalRevenue = payments.value.reduce((sum, p) => sum + (Number(p.monto) || 0), 0)
  
  return [
    { label: 'VIAJEROS REGISTRADOS', value: totalUsers, icon: '👥', color: '#6366f1' },
    { label: 'ALMAS ACTIVAS', value: activeUsers, icon: '✨', color: '#a855f7' },
    { label: 'RECAUDACIÓN CÓSMICA', value: `$${totalRevenue.toLocaleString()}`, icon: '💰', color: '#f59e0b' }
  ]
})

async function fetchData() {
  loading.value = true
  error.value = null
  try {
    const [uRes, pRes] = await Promise.all([
      usuariosService.getAll(),
      pagosService.getAll()
    ])
    users.value = uRes.data || []
    payments.value = pRes.data || []
  } catch (err) {
    console.error('Error fetching admin data:', err)
    error.value = 'Error al sincronizar con el Oráculo de Datos. Verifica tu conexión.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Doble verificación de rol por seguridad en UI
  const user = authStore.currentUser.value
  if ((user?.id_rol || user?.role_id) !== 2) {
    router.push('/home')
    return
  }
  fetchData()
})

const activeTab = ref('users') // 'users' | 'payments'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

async function toggleUserStatus(user) {
  try {
    const newStatus = user.estado === 'inactivo' ? 'activo' : 'inactivo'
    await usuariosService.changeStatus(user.id_usuario || user.id, newStatus)
    user.estado = newStatus
  } catch (err) {
    alert('No se pudo alterar el estado del alma.')
  }
}
</script>

<template>
  <div class="guia-dashboard">
    <div class="stars-overlay"></div>
    
    <header class="dashboard-header">
      <div class="header-content">
        <button class="btn-back" @click="router.push('/home')">← VOLVER AL NODO</button>
        <div class="title-group">
          <h1>SANTUARIO DEL GUÍA</h1>
          <p>Administración de la Red Neural Numerix</p>
        </div>
      </div>
    </header>

    <main class="dashboard-content">
      <!-- STATS GRID -->
      <section class="stats-grid">
        <div v-for="s in stats" :key="s.label" class="stat-card">
          <div class="stat-icon" :style="{ backgroundColor: s.color + '22', color: s.color }">{{ s.icon }}</div>
          <div class="stat-info">
            <span class="stat-label">{{ s.label }}</span>
            <span class="stat-value">{{ s.value }}</span>
          </div>
          <div class="stat-glow" :style="{ background: s.color }"></div>
        </div>
      </section>

      <!-- TABS -->
      <div class="tabs-container">
        <button 
          :class="['tab-btn', { active: activeTab === 'users' }]" 
          @click="activeTab = 'users'"
        >
          VIAJEROS DEL COSMOS
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'payments' }]" 
          @click="activeTab = 'payments'"
        >
          MOVIMIENTOS FINANCIEROS
        </button>
      </div>

      <!-- LOADING / ERROR -->
      <div v-if="loading" class="loader-box">
        <div class="lds-ripple"><div></div><div></div></div>
        <p>Sincronizando flujos de datos...</p>
      </div>

      <div v-else-if="error" class="error-box">
        <span>⚠️</span> {{ error }}
        <button @click="fetchData" class="btn-retry">REINTENTAR</button>
      </div>

      <!-- USERS TABLE -->
      <section v-show="activeTab === 'users'" class="table-container">
        <table class="cosmic-table">
          <thead>
            <tr>
              <th>VIAJERO</th>
              <th>CORREO</th>
              <th>ROL</th>
              <th>ESTADO</th>
              <th>REGISTRO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id_usuario || user.id">
              <td>
                <div class="user-cell">
                  <div class="user-avatar-small">{{ user.nombre?.charAt(0) || '?' }}</div>
                  <span>{{ user.nombre }}</span>
                </div>
              </td>
              <td class="dim">{{ user.email }}</td>
              <td><span class="badge-role">{{ user.id_rol === 2 ? 'GUÍA' : 'VIAJERO' }}</span></td>
              <td>
                <span :class="['status-dot', user.estado === 'inactivo' ? 'inactive' : 'active']"></span>
                {{ user.estado || 'activo' }}
              </td>
              <td class="dim">{{ formatDate(user.createdAt || user.fecha_nacimiento) }}</td>
              <td>
                <button class="btn-action" @click="toggleUserStatus(user)">
                  {{ user.estado === 'inactivo' ? 'ACTIVAR' : 'SUSPENDER' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- PAYMENTS TABLE -->
      <section v-show="activeTab === 'payments'" class="table-container">
        <table class="cosmic-table">
          <thead>
            <tr>
              <th>ID PAGO</th>
              <th>USUARIO ID</th>
              <th>MONTO</th>
              <th>PLAN</th>
              <th>MÉTODO</th>
              <th>FECHA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pay in payments" :key="pay.id_pago">
              <td class="mono">#{{ pay.id_pago }}</td>
              <td class="dim">{{ pay.id_usuario }}</td>
              <td class="highlight-gold">${{ pay.monto }}</td>
              <td><span class="badge-plan">{{ pay.plan || 'PREMIUM' }}</span></td>
              <td class="dim">{{ pay.metodo_pago }}</td>
              <td class="dim">{{ formatDate(pay.fecha_pago) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<style scoped>
.guia-dashboard {
  min-height: 100vh;
  background: #0f0c29;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  padding: 3rem 5%;
  position: relative;
  overflow-x: hidden;
}

.stars-overlay {
  position: fixed;
  inset: 0;
  background-image: radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0));
  background-size: 200px 200px;
  opacity: 0.15;
  pointer-events: none;
}

.dashboard-header {
  margin-bottom: 4rem;
  position: relative;
  z-index: 10;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.btn-back {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6);
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  width: fit-content;
  transition: 0.3s;
}

.btn-back:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.title-group h1 {
  font-size: 2.5rem;
  letter-spacing: 5px;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-group p {
  color: rgba(255,255,255,0.4);
  letter-spacing: 2px;
  font-size: 0.9rem;
  margin: 0.5rem 0 0;
}

/* STATS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.stat-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 1px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
}

.stat-glow {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  filter: blur(60px);
  bottom: -50px;
  right: -50px;
  opacity: 0.2;
}

/* TABS */
.tabs-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 1rem;
}

.tab-btn {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 12px;
}

.tab-btn.active {
  color: #fff;
  background: rgba(168, 85, 247, 0.1);
  box-shadow: inset 0 0 0 1px rgba(168, 85, 247, 0.3);
}

/* TABLES */
.table-container {
  background: rgba(15, 20, 35, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.cosmic-table {
  width: 100%;
  border-collapse: collapse;
}

.cosmic-table th {
  background: rgba(255,255,255,0.02);
  text-align: left;
  padding: 1.2rem 2rem;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 2px;
  text-transform: uppercase;
}

.cosmic-table td {
  padding: 1.2rem 2rem;
  border-top: 1px solid rgba(255,255,255,0.03);
  font-size: 0.9rem;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
}

.dim { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
.highlight-gold { color: #f59e0b; font-weight: 700; }
.mono { font-family: monospace; }

.badge-role {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}

.badge-plan {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}
.status-dot.active { background: #4ade80; box-shadow: 0 0 10px #4ade80; }
.status-dot.inactive { background: #f87171; }

.btn-action {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: 0.2s;
}
.btn-action:hover {
  background: #fff;
  color: #0f0c29;
}

/* LOADER */
.loader-box {
  padding: 4rem;
  text-align: center;
  color: rgba(255,255,255,0.5);
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #a855f7;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) { animation-delay: -0.5s; }
@keyframes lds-ripple {
  0% { top: 36px; left: 36px; width: 0; height: 0; opacity: 1; }
  100% { top: 0px; left: 0px; width: 72px; height: 72px; opacity: 0; }
}

@media (max-width: 768px) {
  .guia-dashboard { padding: 2rem 1.5rem; }
  .table-container { overflow-x: auto; }
  .cosmic-table { min-width: 600px; }
  .title-group h1 { font-size: 1.8rem; }
}
</style>
