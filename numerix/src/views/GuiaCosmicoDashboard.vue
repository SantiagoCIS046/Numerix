<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usuariosService, pagosService } from '@/services/api'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()

const router = useRouter()
const users = ref([])
const payments = ref([])
const loading = ref(true)
const error = ref(null)

// Current Active Section: 'overview' | 'content' | 'users' | 'monetization' | 'config' | 'analytics' | 'security' | 'services'
const activeSection = ref('overview')
const toast = ref({ show: false, message: '', type: 'success' })
const userFilter = ref('all') // 'all' | 'subscribers'
const selectedMonth = ref(null) // null | 'Enero' | 'Febrero' | 'Marzo'
const userSearchQuery = ref('')
const isEditModalOpen = ref(false)
const editingUser = ref(null)

// Content Management State
const vibracionDia = ref(7)
const isEditInterpretationModalOpen = ref(false)
const editingInterpretation = ref(null)
const interpretaciones = ref([
  { id: 1, titulo: 'Esencia del Número 1', descripcion: 'Liderazgo, independencia y nuevos comienzos. La vibración de la unidad.' },
  { id: 2, titulo: 'Esencia del Número 2', descripcion: 'Dualidad, cooperación y diplomacia. La búsqueda del equilibrio.' },
  { id: 3, titulo: 'Esencia del Número 3', descripcion: 'Expresión, creatividad y optimismo. La tríada de la comunicación.' },
  { id: 4, titulo: 'Esencia del Número 4', descripcion: 'Estabilidad, orden y trabajo duro. La base sólida del mundo.' },
  { id: 5, titulo: 'Esencia del Número 5', descripcion: 'Libertad, aventura y cambio. El espíritu de la exploración.' }
])





// Plan Costs State
const planCosts = ref(JSON.parse(localStorage.getItem('numerix_plan_costs')) || {
  lunar: 12.00,
  planetario: 34.00,
  supernova: 88.00
})


watch(planCosts, (newVal) => {
  localStorage.setItem('numerix_plan_costs', JSON.stringify(newVal))
}, { deep: true })

// Monthly Analytics Data (Computed)
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const monthlyFlow = computed(() => {
  const currentMonth = new Date().getMonth()
  const stats = []

  // Mostrar los últimos 4 meses (incluyendo el actual)
  for (let i = 3; i >= 0; i--) {
    let mIndex = currentMonth - i
    if (mIndex < 0) mIndex += 12
    const monthName = MONTH_NAMES[mIndex]

    // Registros en este mes
    const monthUsers = users.value.filter(u => {
      const regDate = new Date(u.fecha_registro || u.createdAt)
      return regDate.getMonth() === mIndex && regDate.getFullYear() === new Date().getFullYear()
    }).length

    // Suscripciones/Pagos en este mes
    const monthSubs = payments.value.filter(p => {
      const payDate = new Date(p.fecha_pago || p.createdAt)
      return payDate.getMonth() === mIndex && payDate.getFullYear() === new Date().getFullYear()
    }).length

    stats.push({ month: monthName, users: monthUsers, subs: monthSubs })
  }
  return stats
})



function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}


const menuItems = [
  { id: 'overview', label: 'VISIÓN GENERAL', icon: '👁️' },
  { id: 'content', label: 'GESTIÓN DE CONTENIDO', icon: '🧠' },
  { id: 'users', label: 'GESTIÓN DE USUARIOS', icon: '👥' },
  { id: 'monetization', label: 'MONETIZACIÓN', icon: '💰' },
  { id: 'analytics', label: 'ANALÍTICA', icon: '📊' },
  { id: 'security', label: 'SEGURIDAD', icon: '🛡️' }
]


// KPIs
const stats = computed(() => {
  const totalUsers = users.value.length
  const activeUsers = users.value.filter(u => u.estado !== 'inactivo').length
  const totalRevenue = payments.value.reduce((sum, p) => sum + (Number(p.monto) || 0), 0)
  
  return [
    { label: 'VIAJEROS', value: totalUsers, icon: '👥', color: '#6366f1' },
    { label: 'ACTIVOS', value: activeUsers, icon: '✨', color: '#a855f7' },
    { label: 'RECAUDACIÓN', value: `$${totalRevenue.toLocaleString()}`, icon: '💰', color: '#f59e0b' }
  ]
})

const mockUsers = [
  { id_usuario: 1, nombre: 'SANTIAGO CISNEROS', email: 'santiagocisneros046@gmail.com', estado: 'activo', id_rol: 2, plan: 'SUPERNOVA', vencimiento: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), fecha_registro: new Date('2026-03-01') },
  { id_usuario: 2, nombre: 'LUNA ESTELAR', email: 'luna@cosmos.com', estado: 'activo', id_rol: 1, plan: 'PLANETARIO', vencimiento: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), fecha_registro: new Date('2026-02-15') },
  { id_usuario: 3, nombre: 'ORIÓN BOREAL', email: 'orion@void.net', estado: 'inactivo', id_rol: 1, plan: 'NINGUNO', vencimiento: null, fecha_registro: new Date('2026-01-20') },
  { id_usuario: 4, nombre: 'AURA CELESTE', email: 'aura@galaxia.io', estado: 'activo', id_rol: 1, plan: 'LUNAR', vencimiento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), fecha_registro: new Date('2026-03-10') }
]

const mockPayments = [
  { id_pago: 101, monto: 29.99, plan: 'SUPERNOVA', fecha_pago: new Date() },
  { id_pago: 102, monto: 15.00, plan: 'LUNAR', fecha_pago: new Date() }
]

async function fetchData() {
  loading.value = true
  error.value = null
  try {
    const [uRes, pRes] = await Promise.allSettled([
      usuariosService.getAll(),
      pagosService.getAll()
    ])

    const extractData = (res, key) => {
      if (res.status !== 'fulfilled') return []
      const val = res.value?.data || res.value
      if (Array.isArray(val)) return val
      return val?.[key] || val?.results || []
    }

    const usersData = extractData(uRes, 'usuarios')
    const paymentsData = extractData(pRes, 'pagos')

    // Priorize real data, fallback to mock if empty
    users.value = usersData.length > 0 ? usersData : mockUsers
    payments.value = paymentsData.length > 0 ? paymentsData : mockPayments

    if (usersData.length > 0) {
      showToast('Sincronización Astral Exitosa: Datos en Tiempo Real.', 'success')
    } else {
      showToast('Modo de Consulta: Usando registros archivados (Mock).', 'info')
    }
  } catch (err) {
    console.error('Error fetching admin data:', err)
    showToast('Falla en la Sincronización: Verifica tu conexión al Núcleo.', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const user = auth.user
  const roleId = user?.id_rol || user?.role_id
  
  if (roleId !== 2) {
    router.push('/home')
    return
  }
  fetchData()
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

async function toggleUserStatus(user) {
  const newStatus = user.estado === 'activo' ? 'inactivo' : 'activo'
  try {
    await usuariosService.changeStatus(user.id_usuario || user.id, newStatus)
    user.estado = newStatus
    showToast(`Estado de ${user.nombre} actualizado.`, 'success')
  } catch (err) {
    console.error(err)
    user.estado = newStatus
    showToast(`Modo Local: ${user.nombre} ahora está ${newStatus.toUpperCase()}`, 'info')
  }
}

function addInterpretation() {
  showToast('Sincronizando nueva interpretación con la Red Neural...', 'success')
}

function getRoleLabel(roleId) {
  return roleId === 2 ? 'ADMINISTRADOR' : 'USUARIO'
}

function getRemainingTime(expiryDate) {
  if (!expiryDate) return '∞'
  const now = new Date()
  const diff = new Date(expiryDate) - now
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Expirado'
  if (days === 0) return 'Hoy'
  return `${days} ${days === 1 ? 'día' : 'días'}`
}



function saveConfig() {
  showToast('Configuración del Sistema guardada en el Núcleo.', 'success')
}

const filteredUsers = computed(() => {
  let list = users.value
  
  if (userFilter.value === 'subscribers') {
    list = list.filter(u => u.plan && u.plan !== 'NINGUNO')
  }

  if (selectedMonth.value) {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    list = list.filter(u => {
      const d = new Date(u.fecha_registro || u.createdAt)
      return MONTH_NAMES[d.getMonth()] === selectedMonth.value
    })
  }
  
  return list
})

function filterByMonth(month) {
  selectedMonth.value = month
  activeSection.value = 'users'
  userFilter.value = 'all'
}

const securityUsers = computed(() => {
  if (!userSearchQuery.value) return users.value
  const q = userSearchQuery.value.toLowerCase()
  return users.value.filter(u => 
    u.nombre?.toLowerCase().includes(q) || 
    u.email?.toLowerCase().includes(q)
  )
})

function openEditUser(user) {
  editingUser.value = JSON.parse(JSON.stringify(user)) // Deep clone for editing
  isEditModalOpen.value = true
}

async function saveUserChanges() {
  try {
    const userId = editingUser.value.id_usuario || editingUser.value.id
    const data = {
      nombre: editingUser.value.nombre,
      email: editingUser.value.email,
      id_rol: editingUser.value.id_rol,
      estado: editingUser.value.estado,
      plan: editingUser.value.plan
    }
    
    await usuariosService.update(userId, data)
    
    // Update local state
    const index = users.value.findIndex(u => (u.id_usuario || u.id) === userId)
    if (index !== -1) {
      users.value[index] = { ...editingUser.value }
    }
    
    showToast(`Perfil de ${editingUser.value.nombre} sincronizado con el Cosmos.`, 'success')
    isEditModalOpen.value = false
  } catch (err) {
    console.error(err)
    showToast('Error al sincronizar cambios. Se guardó localmente.', 'info')
    // Fallback local update
    const index = users.value.findIndex(u => (u.id_usuario || u.id) === (editingUser.value.id_usuario || editingUser.value.id))
    if (index !== -1) {
      users.value[index] = { ...editingUser.value }
    }
    isEditModalOpen.value = false
  }
}


function resetPassword(user) {
  showToast(`Enlace de restablecimiento enviado a ${user.email}.`, 'info')
}

// CONTENT MANAGEMENT HANDLERS
function syncVibration() {
  showToast(`Vibración del día sincronizada: ${vibracionDia.value}.`, 'success')
}


function openEditInterpretation(item) {
  editingInterpretation.value = { ...item }
  isEditInterpretationModalOpen.value = true
}

function saveInterpretation() {
  const index = interpretaciones.value.findIndex(i => i.id === editingInterpretation.value.id)
  if (index !== -1) {
    interpretaciones.value[index] = { ...editingInterpretation.value }
    showToast('Interpretación actualizada en la Red Neural.', 'success')
    isEditInterpretationModalOpen.value = false
  }
}

function addNewInterpretation() {
  const newId = interpretaciones.value.length + 1
  const newItem = { id: newId, titulo: `Esencia del Número ${newId}`, descripcion: 'Escribe aquí la nueva sabiduría...' }
  interpretaciones.value.push(newItem)
  openEditInterpretation(newItem)
}



const activeSubscribersCount = computed(() => {
  return users.value.filter(u => u.plan && u.plan !== 'NINGUNO').length
})

</script>

<template>
  <div class="admin-layout">
    <div class="stars-overlay"></div>
    
    <!-- SIDEBAR -->
    <aside class="admin-sidebar">
      <div class="sidebar-logo">
        <div class="logo-inner">N</div>
        <span>NUMERIX <strong>ADMIN</strong></span>
      </div>
      
      <nav class="sidebar-nav">
        <button 
          v-for="item in menuItems" 
          :key="item.id"
          :class="['nav-item', { active: activeSection === item.id }]"
          @click="activeSection = item.id"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="btn-exit" @click="router.push('/home')">
          <span>←</span> VOLVER AL NODO
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="admin-main">
      <header class="main-header">
        <div class="breadcrumb">PANEL / {{ activeSection.toUpperCase() }}</div>
        <div class="admin-badge">SANTIAGO CISNEROS // GUÍA SUPREMO</div>
      </header>

      <div class="content-scroll">
        <!-- SECCIÓN: OVERVIEW (Visión General) -->
        <section v-if="activeSection === 'overview' || activeSection === 'analytics'" class="admin-section">
          <div class="section-title">
            <h2>RESUMEN CÓSMICO</h2>
            <p>Estado actual de la Red Neural.</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card" @click="activeSection = 'users'; userFilter = 'all'" style="cursor: pointer;">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <span class="stat-label">VIAJEROS</span>
                <span class="stat-value">{{ users.length }}</span>
              </div>
            </div>
            <div class="stat-card" @click="activeSection = 'users'; userFilter = 'subscribers'" style="cursor: pointer;">
              <div class="stat-icon highlight">✨</div>
              <div class="stat-info">
                <span class="stat-label">ACTIVOS</span>
                <span class="stat-value">{{ activeSubscribersCount }}</span>
              </div>
            </div>
             <div class="stat-card">
              <div class="stat-icon monetization">💰</div>
              <div class="stat-info">
                <span class="stat-label">RECAUDACIÓN</span>
                <span class="stat-value">${{ parseFloat(payments.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0)).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- NUEVA SECCIÓN: FLUJO MENSUAL -->
          <div class="flow-container">
            <h3 class="panel-subtitle">📈 FLUJO TEMPORAL (ÚLTIMOS 3 MESES)</h3>
            <div class="flow-grid">
              <div v-for="item in monthlyFlow" :key="item.month" class="flow-item clickable" @click="filterByMonth(item.month)">
                <div class="flow-label">
                  <strong>{{ item.month }}</strong>
                  <span>{{ item.users }} viajeros / {{ item.subs }} planes</span>
                </div>
                <div class="flow-bar-container">
                  <div class="flow-bar users" :style="{ width: (item.users / 50 * 100) + '%' }"></div>
                  <div class="flow-bar subs" :style="{ width: (item.subs / 50 * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

          <!-- SECTION 2: CONTENT MANAGEMENT -->
        <section v-if="activeSection === 'content'" class="dashboard-section animate-fade">
          <div class="section-title">
            <h2>🧠 GESTIÓN DE CONTENIDO</h2>
            <p>Mantenimiento vital de la base de conocimientos numerológicos.</p>
          </div>
          <div class="content-grid">
            <div class="content-panel interpretations">
              <div class="panel-header">
                <h3>Interpretaciones</h3>
                <button class="btn-blue mini" @click="addNewInterpretation">+ NUEVA</button>
              </div>
              <div class="interpretation-list">
                <div v-for="item in interpretaciones" :key="item.id" class="interpretation-item">
                  <div class="item-info">
                    <span class="item-id">#{{ item.id }}</span>
                    <span class="item-title">{{ item.titulo }}</span>
                  </div>
                  <button class="btn-outline mini" @click="openEditInterpretation(item)">EDITAR</button>
                </div>
              </div>
            </div>
            <div class="content-panel articles">
              <h3>Artículos Destacados</h3>
              <p class="dim">Significado del 7 en la era Acuario, Ciclos de 9 años...</p>
              <button class="btn-outline" @click="showToast('Cargando biblioteca de artículos...', 'info')">VER TODOS</button>
            </div>
            <div class="content-panel vibration">
              <h3>Vibración del Día</h3>
              <div class="vibration-edit">
                <label>Vibración Actual</label>
                <input type="number" v-model="vibracionDia" class="input-light" min="1" max="33">
                <button class="btn-blue" @click="syncVibration">SINCRONIZAR</button>
              </div>
            </div>
          </div>
        </section>

        <!-- SECCIÓN: USERS (Gestión de Usuarios) -->
        <section v-if="activeSection === 'users'" class="admin-section">
          <div class="section-title">
          <div class="tool-header">
            <div>
              <h2>👥 {{ selectedMonth ? `VIAJEROS DE ${selectedMonth.toUpperCase()}` : (userFilter === 'subscribers' ? 'SUSCRIPTORES ACTIVOS' : 'VIAJEROS DEL COSMOS') }}</h2>
              <p>{{ selectedMonth ? `Viendo almas registradas en ${selectedMonth}.` : (userFilter === 'subscribers' ? 'Lista detallada de almas con planes activos.' : 'Control de acceso y perfiles de usuario.') }}</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button v-if="userFilter !== 'all' || selectedMonth" class="btn-outline" @click="userFilter = 'all'; selectedMonth = null">👁️ VER TODOS</button>
              <button class="btn-outline" @click="fetchData">🔄 SINCRONIZAR</button>
            </div>
          </div>
          </div>

          <div class="table-container">
            <table class="cosmic-table">
              <thead>
                <tr>
                  <th>VIAJERO</th>
                  <th>CORREO</th>
                  <th>ROL</th>
                  <th>PLAN</th>
                  <th>VENCIMIENTO</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id_usuario || user.id">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar-small">{{ user.nombre?.charAt(0) || '?' }}</div>
                      <span>{{ user.nombre }}</span>
                    </div>
                  </td>
                  <td class="dim">{{ user.email }}</td>
                  <td>
                    <span :class="['admin-badge', { 'highlight-gold': (user.id_rol || user.role_id) === 2 }]">
                      {{ getRoleLabel(user.id_rol || user.role_id) }}
                    </span>
                  </td>
                  <td>
                    <span :class="['plan-tag-mini', user.plan]">
                      {{ user.plan || 'NINGUNO' }}
                    </span>
                  </td>
                  <td>
                    <span :class="['time-left', { 'critical': (user.plan && user.plan !== 'NINGUNO' && getRemainingTime(user.vencimiento).includes('1 día')) }]">
                      {{ getRemainingTime(user.vencimiento) }}
                    </span>
                  </td>
                  <td>
                    <span :class="['status-dot', user.estado === 'inactivo' ? 'inactive' : 'active']"></span>
                    {{ user.estado || 'activo' }}
                  </td>
                  <td>
                    <button class="btn-action" @click="toggleUserStatus(user)">
                      {{ user.estado === 'inactivo' ? 'ACTIVAR' : 'SUSPENDER' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- SECCIÓN: MONETIZATION (Pagos) -->
        <section v-if="activeSection === 'monetization'" class="admin-section">
          <div class="section-title">
            <h2>💰 MONETIZACIÓN</h2>
            <p>Control de ingresos, suscripciones y pedidos.</p>
          </div>

          <div class="stats-grid mini">
            <div class="stat-card thin">
              <span class="stat-label">Ingresos Hoy</span>
              <span class="stat-value">$1,250</span>
            </div>
            <div class="stat-card thin clickable" @click="activeSection = 'users'; userFilter = 'subscribers'">
              <span class="stat-label">Suscripciones Activas</span>
              <span class="stat-value">{{ activeSubscribersCount }}</span>
            </div>
            <div class="stat-card thin" style="grid-column: span 2;">
              <span class="stat-label">CONTROL DE COSTOS (USD)</span>
              <div style="display: flex; gap: 0.8rem; width: 100%; margin-top: 0.5rem; flex-wrap: wrap;">
                <div class="input-light-group" style="flex: 1; min-width: 100px; margin-bottom: 0;">
                  <label>Plan Lunar</label>
                  <input type="number" v-model="planCosts.lunar" class="input-light" step="1">
                </div>
                <div class="input-light-group" style="flex: 1; min-width: 100px; margin-bottom: 0;">
                  <label>Plan Planetario</label>
                  <input type="number" v-model="planCosts.planetario" class="input-light" step="1">
                </div>
                <div class="input-light-group" style="flex: 1; min-width: 100px; margin-bottom: 0;">
                  <label>Plan Supernova</label>
                  <input type="number" v-model="planCosts.supernova" class="input-light" step="1">
                </div>
              </div>
            </div>
          </div>

          <div class="table-container">
            <table class="cosmic-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>MONTO</th>
                  <th>PLAN</th>
                  <th>FECHA</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pay in payments" :key="pay.id_pago">
                  <td class="mono">#{{ pay.id_pago }}</td>
                  <td class="highlight-gold">${{ pay.monto }}</td>
                  <td><span class="badge-plan">{{ pay.plan || 'PREMIUM' }}</span></td>
                  <td class="dim">{{ formatDate(pay.fecha_pago) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- SECTION 7: SECURITY & PRIVACY -->
        <section v-if="activeSection === 'security'" class="dashboard-section animate-fade">
          <div class="section-title">
            <h2>🛡️ SEGURIDAD Y CONTROL DE ALMAS</h2>
            <p>Protección de la red y administración profunda de perfiles.</p>
          </div>
          
          <div class="search-box-container">
            <input 
              type="text" 
              v-model="userSearchQuery" 
              placeholder="🔍 Buscar por nombre o correo..." 
              class="search-input"
            >
          </div>

          <div class="user-table-container">
            <table class="user-table">
              <thead>
                <tr>
                  <th>VIAJERO</th>
                  <th>CORREO</th>
                  <th>ROL</th>
                  <th>PLAN</th>
                  <th>ESTADO</th>
                  <th>ACCIONES DE SEGURIDAD</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in securityUsers" :key="user.id_usuario">
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar-small">{{ user.nombre?.charAt(0) || '?' }}</div>
                      <span>{{ user.nombre }}</span>
                    </div>
                  </td>
                  <td class="dim">{{ user.email }}</td>
                  <td>
                    <span :class="['admin-badge', { 'highlight-gold': (user.id_rol || user.role_id) === 2 }]">
                      {{ getRoleLabel(user.id_rol || user.role_id) }}
                    </span>
                  </td>
                  <td>
                    <span :class="['plan-tag-mini', user.plan]">
                      {{ user.plan || 'NINGUNO' }}
                    </span>
                  </td>
                  <td>
                    <span :class="['status-dot', user.estado === 'inactivo' ? 'inactive' : 'active']"></span>
                    {{ user.estado || 'activo' }}
                  </td>
                  <td>
                    <div style="display: flex; gap: 0.5rem;">
                      <button class="btn-action mini" @click="openEditUser(user)">⚙️ GESTIONAR</button>
                      <button class="btn-action mini warn" @click="resetPassword(user)">🔑 RESET PASS</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>

    <!-- TOAST NOTIFICATION -->
    <transition name="toast">
      <div v-if="toast.show" :class="['cosmic-toast', toast.type]">
        <div class="toast-icon">{{ toast.type === 'success' ? '✨' : '⚠️' }}</div>
        <div class="toast-message">{{ toast.message }}</div>
      </div>
    </transition>

    <!-- USER EDIT MODAL -->
    <transition name="modal">
      <div v-if="isEditModalOpen" class="modal-overlay" @click.self="isEditModalOpen = false">
        <div class="modal-content animate-slide-up">
          <div class="modal-header">
            <h3>⚙️ GESTIÓN DE PERFIL ESTELAR</h3>
            <button class="btn-close" @click="isEditModalOpen = false">&times;</button>
          </div>
          <div class="modal-body" v-if="editingUser">
            <div class="input-group-grid">
              <div class="input-light-group">
                <label>Nombre Completo</label>
                <input type="text" v-model="editingUser.nombre" class="input-light">
              </div>
              <div class="input-light-group">
                <label>Correo Electrónico</label>
                <input type="email" v-model="editingUser.email" class="input-light">
              </div>
              <div class="input-light-group">
                <label>Plan Cosmico</label>
                <select v-model="editingUser.plan" class="input-light">
                  <option value="NINGUNO">NINGUNO</option>
                  <option value="LUNAR">LUNAR</option>
                  <option value="PLANETARIO">PLANETARIO</option>
                  <option value="SUPERNOVA">SUPERNOVA</option>
                </select>
              </div>
              <div class="input-light-group">
                <label>Estado de Cuenta</label>
                <select v-model="editingUser.estado" class="input-light">
                  <option value="activo">ACTIVO</option>
                  <option value="inactivo">INACTIVO</option>
                </select>
              </div>
              <div class="input-light-group">
                <label>Rol de Acceso</label>
                <select v-model="editingUser.id_rol" class="input-light">
                  <option :value="1">USUARIO</option>
                  <option :value="2">ADMINISTRADOR</option>
                </select>
              </div>
              <div class="input-light-group" style="flex: 1;">
                <label>Última Conexión Astral</label>
                <input type="text" value="Hoy, 20:45" class="input-light" disabled>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-outline" @click="isEditModalOpen = false">CANCELAR</button>
            <button class="btn-blue" @click="saveUserChanges">GUARDAR CAMBIOS</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- INTERPRETATION EDIT MODAL -->
    <transition name="modal">
      <div v-if="isEditInterpretationModalOpen" class="modal-overlay" @click.self="isEditInterpretationModalOpen = false">
        <div class="modal-content animate-slide-up">
          <div class="modal-header">
            <h3>🧠 EDITAR SABIDURÍA NUMERAL</h3>
            <button class="btn-close" @click="isEditInterpretationModalOpen = false">&times;</button>
          </div>
          <div class="modal-body" v-if="editingInterpretation">
            <div class="input-light-group">
              <label>Título de la Interpretación</label>
              <input type="text" v-model="editingInterpretation.titulo" class="input-light">
            </div>
            <div class="input-light-group" style="margin-top: 1.5rem;">
              <label>Contenido Estelar</label>
              <textarea v-model="editingInterpretation.descripcion" class="input-light" rows="5" style="resize: none; border-radius: 8px; padding: 1rem;"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-outline" @click="isEditInterpretationModalOpen = false">CANCELAR</button>
            <button class="btn-blue" @click="saveInterpretation">ACTUALIZAR RED NEURAL</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>


<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background: #0f172a;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  overflow: hidden;
}

.stars-overlay {
  position: fixed;
  inset: 0;
  background-image: radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0));
  background-size: 200px 200px;
  opacity: 0.05;
  pointer-events: none;
}

/* SIDEBAR */
.admin-sidebar {
  width: 240px;
  height: 100vh;
  background: rgba(15, 23, 42, 0.9);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 1.2rem 1rem;
  transition: 0.3s;
  z-index: 100;
  backdrop-filter: blur(20px);
  box-sizing: border-box;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-left: 0.5rem;
}

.logo-inner {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #c9a96e, #a855f7);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.5rem;
  color: #0f172a;
}

.sidebar-logo span {
  font-size: 0.9rem;
  letter-spacing: 2px;
  color: #c9a96e;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  overflow-y: auto;
  padding-right: 0.2rem;
}

.sidebar-nav::-webkit-scrollbar {
  width: 3px;
}
.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0.8rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 600;
  font-size: 0.75rem;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
}

.nav-item.active {
  background: rgba(201, 169, 110, 0.1);
  color: #c9a96e;
  border-left-color: #c9a96e;
}

.nav-icon { font-size: 1rem; }

.sidebar-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-exit {
  width: 100%;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  padding: 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.75rem;
  transition: 0.3s;
}

.btn-exit:hover { background: rgba(239, 68, 68, 0.1); }

/* MAIN CONTENT */
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.main-header {
  height: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
}

.breadcrumb {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;
}

.admin-badge {
  font-size: 0.65rem;
  font-weight: 700;
  color: #c9a96e;
  letter-spacing: 1px;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.admin-section {
  animation: fadeIn 0.5s ease-out;
  max-width: 1200px;
}

.section-title { margin-bottom: 1.5rem; }
.section-title h2 { font-size: 1.4rem; letter-spacing: 2px; margin-bottom: 0.3rem; color: #fff; }
.section-title p { color: rgba(255, 255, 255, 0.4); font-size: 0.75rem; }

/* STATS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon { font-size: 1.5rem; opacity: 0.8; }
.stat-label { font-size: 0.65rem; color: rgba(255, 255, 255, 0.4); letter-spacing: 1px; }
.stat-value { font-size: 1.2rem; font-weight: 800; display: block; margin-top: 0.1rem; }

/* TOOLS GRID */
.grid-tools {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.tool-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.2rem;
  transition: 0.3s;
}

.tool-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.04); }
.tool-card h3 { font-size: 1rem; color: #c9a96e; margin-bottom: 0.8rem; }
.tool-card p { font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); line-height: 1.5; margin-bottom: 1.2rem; }

.btn-outline {
  background: transparent;
  border: 1px solid #c9a96e;
  color: #c9a96e;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.btn-outline:hover { background: #c9a96e; color: #0f172a; }

/* TABLES */
.table-container {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
}

.cosmic-table { width: 100%; border-collapse: collapse; }
.cosmic-table th { background: rgba(255,255,255,0.02); text-align: left; padding: 0.6rem 1rem; font-size: 0.6rem; color: rgba(255,255,255,0.4); letter-spacing: 1px; }
.cosmic-table td { padding: 0.6rem 1rem; border-top: 1px solid rgba(255,255,255,0.03); font-size: 0.75rem; }

.user-cell { display: flex; align-items: center; gap: 0.8rem; }
.user-avatar-small { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #a855f7); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.7rem; }

.dim { color: rgba(255,255,255,0.4); }
.highlight-gold { color: #c9a96e; text-shadow: 0 0 10px rgba(201, 169, 110, 0.3); }

/* PLAN TAGS */
.plan-tag-mini {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: 1px;
}

.plan-tag-mini.LUNAR { color: #60a5fa; border-color: rgba(96, 165, 250, 0.3); background: rgba(96, 165, 250, 0.05); }
.plan-tag-mini.PLANETARIO { color: #818cf8; border-color: rgba(129, 140, 248, 0.3); background: rgba(129, 140, 248, 0.05); }
.plan-tag-mini.SUPERNOVA { color: #fbbf24; border-color: rgba(251, 191, 36, 0.3); background: rgba(251, 191, 36, 0.05); }
.plan-tag-mini.NINGUNO { opacity: 0.3; }

.time-left {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.time-left.critical {
  color: #f87171;
  font-weight: 800;
  text-shadow: 0 0 8px rgba(248, 113, 113, 0.4);
}


.mono { font-family: monospace; }
.status-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 8px; }
.status-dot.active { background: #4ade80; box-shadow: 0 0 10px #4ade80; }
.status-dot.inactive { background: #f87171; }

.btn-action { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.65rem; cursor: pointer; }
.btn-action:hover { background: #fff; color: #0f172a; }

.alert-info { background: rgba(99, 102, 241, 0.05); border: 1px solid rgba(99, 102, 241, 0.2); color: #818cf8; padding: 1.5rem; border-radius: 12px; font-size: 0.9rem; margin-top: 2rem; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* NEW ADMIN STYLES */
.tool-card.expanded {
  grid-column: span 1;
  display: flex;
  flex-direction: column;
}

.tool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.mini-list {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
}

.mini-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.8rem;
}

.item-id { color: #c9a96e; font-weight: 800; width: 30px; }
.item-name { flex: 1; color: rgba(255, 255, 255, 0.7); }

.btn-primary-small {
  background: #c9a96e;
  border: none;
  color: #0f172a;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
}

.btn-action-icon {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.5);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6rem;
  cursor: pointer;
}

.input-light-group { margin-bottom: 1.5rem; }
.input-light-group label { display: block; font-size: 0.7rem; color: #c9a96e; margin-bottom: 0.5rem; }

.input-light {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.6rem;
  color: #fff;
  font-size: 0.85rem;
  outline: none;
}

.config-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
.config-item label { display: block; font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.4rem; }

.stats-grid.mini { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 2rem; }
.stat-card.thin { padding: 1rem 1.5rem; flex-direction: column; align-items: flex-start; gap: 0.2rem; }
.stat-card.clickable { cursor: pointer; transition: transform 0.2s, background 0.2s; }
.stat-card.clickable:hover { transform: translateY(-3px); background: rgba(255, 255, 255, 0.08); border-color: #c9a96e; }


/* COSMIC TOAST */
.cosmic-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(201, 169, 110, 0.3);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(201, 169, 110, 0.1);
  z-index: 10000;
  backdrop-filter: blur(10px);
  min-width: 300px;
}

.cosmic-toast.info { border-color: rgba(99, 102, 241, 0.3); }
.toast-icon { font-size: 1.2rem; }
.toast-message { font-size: 0.85rem; font-weight: 600; color: #fff; letter-spacing: 0.5px; }
.stat-value { font-size: 1.4rem; font-weight: 800; color: #fff; line-height: 1; }
.stat-icon.highlight { color: #fbbf24; }
.stat-icon.monetization { color: #4ade80; }

/* SEARCH & SECURITY */
.search-box-container {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #c9a96e;
  box-shadow: 0 0 15px rgba(201, 169, 110, 0.2);
}

.btn-action.mini {
  padding: 0.4rem 0.8rem;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.05);
}

.btn-action.mini.warn {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.2);
}

/* MODAL SYSTEM */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #0d1117;
  width: 90%;
  max-width: 550px;
  border-radius: 16px;
  border: 1px solid rgba(201, 169, 110, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 { font-size: 1rem; color: #c9a96e; margin: 0; }
.btn-close { background: none; border: none; color: #fff; fontSize: 1.5rem; cursor: pointer; opacity: 0.5; }
.btn-close:hover { opacity: 1; }

.modal-body { padding: 2rem; }
.input-group-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

.modal-footer {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* ANIMATIONS */
.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }


/* FLOW ANALYTICS */
.flow-container {
  margin-top: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-subtitle {
  font-size: 0.75rem;
  color: #c9a96e;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  font-weight: 800;
}

.flow-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.flow-item {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.flow-item.clickable {
  cursor: pointer;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.flow-item.clickable:hover {
  background: rgba(255, 255, 255, 0.05);
}


.flow-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.flow-label strong { color: #fff; letter-spacing: 1px; }
.flow-label span { color: rgba(255, 255, 255, 0.4); font-size: 0.7rem; }

.flow-bar-container {
  height: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 2px;
}

.flow-bar {
  height: 4px;
  border-radius: 2px;
  transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.flow-bar.users {
  background: linear-gradient(90deg, #6366f1, #818cf8);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
}

.flow-bar.subs {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
}

/* TRANSITIONS */
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-enter-from { opacity: 0; transform: translateY(20px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }


@media (max-width: 1024px) {
  .admin-sidebar { width: 80px; padding: 2rem 0.5rem; }
  .nav-label, .sidebar-logo span, .sidebar-footer span { display: none; }
  .logo-inner { margin: 0 auto; }
  .nav-item { justify-content: center; }
}

/* CONTENT MANAGEMENT */
.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
}

.content-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
}

.interpretations { grid-row: span 2; }

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.interpretation-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.interpretation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.item-id { color: #c9a96e; font-weight: bold; margin-right: 1rem; font-size: 0.8rem; }
.item-title { font-size: 0.9rem; }

.vibration-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

</style>

