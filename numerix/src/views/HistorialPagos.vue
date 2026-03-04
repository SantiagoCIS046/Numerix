<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const router = useRouter()

// Get user data from localStorage consistently with PagPrincipal.vue
const user = computed(() => {
  const stored = localStorage.getItem('user')
  const alignment = localStorage.getItem('alignmentProfile')
  const userData = stored ? JSON.parse(stored) : null
  const alignmentData = alignment ? JSON.parse(alignment) : null
  
  const nombre = alignmentData?.fullName || userData?.nombre || userData?.name || 'VIAJERO ASTRAL'
  const rank = userData?.role === 'SUPERNOVA' ? t('subscriptions.plans.supernova.name') : 
               userData?.role === 'PLANETARIO' ? t('subscriptions.plans.planetario.name') : 
               t('subscriptions.plans.lunar.name')
  
  return {
    name: nombre,
    rank: rank,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)} background=6366f1&color=fff`
  }
})

// Transactions data - Fetched from cosmic_history in localStorage
const transactions = ref([])

onMounted(() => {
  const storedHistory = localStorage.getItem('cosmic_history')
  if (storedHistory) {
    transactions.value = JSON.parse(storedHistory)
  }
})

const hasTransactions = computed(() => transactions.value.length > 0)

const stats = computed(() => {
  // Calculate total energy
  const total = transactions.value.reduce((acc, curr) => {
    const val = parseFloat(curr.amount.replace('$', ''))
    return acc + (isNaN(val) ? 0 : val)
  }, 0)

  // Calculate days remaining if there's a recent transaction
  let daysRemaining = '30' // Default
  if (hasTransactions.value) {
    const lastTx = new Date(transactions.value[0].date)
    const nextTx = new Date(lastTx)
    nextTx.setMonth(nextTx.getMonth() + 1)
    const diff = nextTx - new Date()
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))).toString()
  }

  return [
    {
      label: t('payments.stats.totalLabel'),
      value: `$${total.toFixed(2)}`,
      currency: 'USD',
      trend: hasTransactions.value ? t('payments.stats.trendLive') : t('payments.stats.trendBase'),
      trendUp: hasTransactions.value
    },
    {
      label: t('payments.stats.astralLabel'),
      value: user.value.rank,
      icon: '✨',
      footer: t('payments.stats.nextAlign')
    },
    {
      label: t('payments.stats.nextLabel'),
      value: daysRemaining,
      subValue: t('payments.stats.daysLeft'),
      progress: Math.min(100, Math.max(0, (parseInt(daysRemaining) / 30) * 100))
    }
  ]
})

function goBack() {
  router.back()
}

function navigateTo(path) {
  router.push(path)
}

function startJourney() {
  router.push('/suscripcion')
}
</script>

<template>
  <div class="history-page">
    <div class="stars-overlay"></div>
    <div class="nebula-glow"></div>

    <aside class="sidebar">
      <div class="brand" @click="navigateTo('/home')" style="cursor: pointer;">
        <div class="logo-container">
          <span class="logo-spark">✦</span>
        </div>
        <h1 class="brand-name">ASTR<span>ALIS</span></h1>
      </div>

      <nav class="side-nav">
        <a href="#" class="nav-item" @click.prevent="navigateTo('/home')">
          <span class="nav-icon">🧭</span> <span class="nav-text">{{ t('payments.sidebar.map') }}</span>
        </a>
        <a href="#" class="nav-item active" @click.prevent="navigateTo('/suscripcion')">
          <span class="nav-icon">💳</span> <span class="nav-text">{{ t('payments.sidebar.vault') }}</span>
        </a>
        <a href="#" class="nav-item" @click.prevent="navigateTo('/ajustes')">
          <span class="nav-icon">⚙️</span> <span class="nav-text">{{ t('payments.sidebar.settings') }}</span>
        </a>
      </nav>

      <div class="user-profile">
        <div class="avatar">
          <img :src="user.avatar" alt="User Avatar" />
        </div>
        <div class="user-info">
          <p class="user-name">{{ user.name }}</p>
          <p class="user-rank">{{ t('payments.sidebar.level') }} {{ user.rank }}</p>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <header class="content-header">
        <div class="header-breadcrumb">
          <span @click="goBack" class="back-link">{{ t('payments.header.back') }}</span>
        </div>
        <h2 class="page-title">{{ t('payments.header.title') }}</h2>
        <p class="page-subtitle">{{ t('payments.header.subtitle') }}</p>
      </header>

      <section class="stats-grid">
        <div v-for="(stat, index) in stats" :key="index" class="stat-card" :class="{ 'stat-highlight': index === 0 }">
          <p class="stat-label">{{ stat.label }}</p>
          <div class="stat-main">
            <h3 class="stat-value">
              {{ stat.value }}
              <span v-if="stat.currency" class="stat-currency">{{ stat.currency }}</span>
            </h3>
            <span v-if="stat.icon" class="stat-icon-large">{{ stat.icon }}</span>
          </div>
          <p v-if="stat.trend" class="stat-footer" :class="{ 'trend-up': stat.trendUp }">
            <span v-if="stat.trendUp" class="trend-icon">↗</span> {{ stat.trend }}
          </p>
          <p v-if="stat.footer" class="stat-footer">{{ stat.footer }}</p>
          <div v-if="stat.progress" class="progress-container">
            <span class="sub-value">{{ stat.subValue }}</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: stat.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="history-container">
        <header class="table-header">
          <div class="table-title">
            <span class="history-icon">🕒</span>
            <h3>{{ t('payments.history.title') }}</h3>
          </div>
          <div class="table-actions" v-if="hasTransactions">
            <button class="btn-secondary">{{ t('payments.history.filter') }}</button>
            <button class="btn-primary">{{ t('payments.history.export') }}</button>
          </div>
        </header>

        <!-- Transaction Table -->
        <div v-if="hasTransactions" class="table-responsive">
          <table class="cosmic-table">
            <thead>
              <tr>
                <th>{{ t('payments.history.date') }}</th>
                <th>{{ t('payments.history.detail') }}</th>
                <th>{{ t('payments.history.amount') }}</th>
                <th>{{ t('payments.history.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in transactions" :key="index">
                <td class="td-date">
                  <span class="date-main">{{ item.date }}</span>
                  <span class="date-sub">{{ t('payments.history.levelLabel') }} {{ item.level }}</span>
                </td>
                <td class="td-name">
                  <div class="name-container">
                    <span class="status-dot" :class="item.status"></span>
                    {{ item.name }}
                  </div>
                </td>
                <td class="td-amount">
                  <span class="amount-value">{{ item.amount }}</span>
                </td>
                <td class="td-action">
                  <button class="btn-invoice">
                    <span class="invoice-icon">🧾</span> {{ t('payments.history.invoice') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon-container">
            <div class="empty-glow"></div>
            <span class="empty-icon">☄️</span>
          </div>
          <h4 class="empty-title">{{ t('payments.empty.title') }}</h4>
          <p class="empty-desc">
            {{ t('payments.empty.desc') }}
          </p>
          <button class="btn-journey" @click="startJourney">{{ t('payments.empty.btn') }}</button>
        </div>

        <footer class="table-footer" v-if="hasTransactions">
          <p class="display-text">{{ t('payments.history.footerPrefix') }}{{ transactions.length }}{{ t('payments.history.footerSuffix') }}</p>
          <div class="pagination">
            <button class="page-btn active">1</button>
          </div>
        </footer>
      </section>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&family=Space+Mono&display=swap');

.history-page {
  min-height: 100vh;
  background-color: #03030b;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  display: flex;
  position: relative;
  overflow: hidden;
}

.stars-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 100px 150px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 200px 80px, #fff, rgba(0,0,0,0));
  background-size: 300px 300px;
  opacity: 0.1;
  pointer-events: none;
}

.nebula-glow {
  position: fixed;
  top: 0; right: 0;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* Sidebar */
.sidebar {
  width: 280px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(5, 5, 20, 0.9);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  padding: 2.5rem 0;
  z-index: 10;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 2rem;
  margin-bottom: 4rem;
}

.logo-container {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
}

.logo-spark { font-size: 1.2rem; color: #fff; }

.brand-name {
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  letter-spacing: 3px;
  font-weight: 700;
}

.brand-name span { font-weight: 400; color: rgba(255,255,255,0.7); }

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 0.9rem;
  letter-spacing: 1px;
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-item:hover, .nav-item.active {
  background: rgba(255,255,255,0.05);
  color: #fff;
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.1), transparent);
  border-left: 3px solid #6366f1;
}

.nav-icon { font-size: 1.1rem; }

.user-profile {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.1);
}

.avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-name { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.2rem; }
.user-rank { font-size: 0.75rem; color: rgba(255,255,255,0.5); }

/* Main Content */
.main-content {
  flex: 1;
  padding: 3rem 5%;
  overflow-y: auto;
  z-index: 5;
}

.content-header { margin-bottom: 3rem; }

.header-breadcrumb { margin-bottom: 1.5rem; }
.back-link {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: color 0.3s;
}
.back-link:hover { color: #fff; }

.page-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 5vw, 2.8rem);
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.5px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba(15, 20, 35, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s;
}

.stat-highlight { border: 1px solid rgba(99, 102, 241, 0.3); background: rgba(99, 102, 241, 0.05); }

.stat-label { font-size: 0.7rem; letter-spacing: 2px; color: #6366f1; font-weight: 700; }
.stat-main { display: flex; justify-content: space-between; align-items: center; }
.stat-value { font-size: 2rem; font-weight: 600; display: flex; align-items: baseline; gap: 0.5rem; }
.stat-currency { font-size: 0.8rem; opacity: 0.5; }
.stat-icon-large { font-size: 1.5rem; background: rgba(99, 102, 241, 0.1); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }

.stat-footer { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
.trend-up { color: #10b981; }

.progress-bar { height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); }

/* History Container */
.history-container {
  background: rgba(10, 10, 25, 0.4);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 2rem;
}

.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; }
.table-title { display: flex; align-items: center; gap: 0.8rem; }
.table-title h3 { font-size: 1.1rem; }

.table-actions { display: flex; gap: 0.8rem; }
.btn-secondary, .btn-primary { padding: 0.6rem 1.2rem; border-radius: 6px; font-size: 0.7rem; cursor: pointer; transition: all 0.3s; }
.btn-secondary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; }
.btn-primary { background: #6366f1; border: none; color: #fff; font-weight: 600; }

.cosmic-table { width: 100%; border-collapse: collapse; }
.cosmic-table th { text-align: left; padding: 1rem 0; font-size: 0.7rem; color: rgba(255,255,255,0.3); letter-spacing: 1px; }
.cosmic-table td { padding: 1.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.02); }

.date-main { display: block; font-weight: 600; font-size: 0.95rem; }
.date-sub { font-size: 0.7rem; opacity: 0.4; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.status-dot.active { background: #10b981; box-shadow: 0 0 10px #10b981; }
.status-dot.warning { background: #f59e0b; box-shadow: 0 0 10px #f59e0b; }

.amount-value { font-weight: 600; }
.btn-invoice { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.65rem; cursor: pointer; font-family: 'Space Mono', monospace; }

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.empty-icon-container { position: relative; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; }
.empty-glow { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%); animation: pulse 3s infinite; }
.empty-icon { font-size: 2.5rem; position: relative; }

.empty-title { font-family: 'Cinzel', serif; font-size: 1.5rem; letter-spacing: 2px; }
.empty-desc { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.6; }

.btn-journey {
  background: transparent;
  border: 1px solid #6366f1;
  color: #6366f1;
  padding: 0.8rem 2.5rem;
  border-radius: 4px;
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}
.btn-journey:hover { background: #6366f1; color: #fff; box-shadow: 0 0 30px rgba(99, 102, 241, 0.4); }

@keyframes pulse { 0% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 0.8; } 100% { transform: scale(1); opacity: 0.5; } }

/* Responsive */
@media (max-width: 1024px) {
  .sidebar { width: 80px; }
  .nav-text, .brand-name, .user-info { display: none; }
  .brand, .user-profile { justify-content: center; padding: 2rem 0; }
  .nav-item { justify-content: center; padding: 1.2rem; }
}

@media (max-width: 768px) {
  .history-page { flex-direction: column; }
  .sidebar { width: 100%; height: auto; flex-direction: row; padding: 1rem; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .brand { margin-bottom: 0; padding: 0 1rem; }
  .side-nav { flex-direction: row; gap: 1rem; padding: 0 1rem; }
  .user-profile { display: none; }
  .main-content { padding: 2rem 1.5rem; }
  .table-header { flex-direction: column; align-items: flex-start; }
  .td-date { width: auto; }
}
</style>
