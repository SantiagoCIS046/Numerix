<template>
  <div class="terminal-page">
    <div class="stars-bg"></div>
    <div class="nebula-glow"></div>
    <div class="scanline"></div>

    <!-- Notificación Superior (Cosmic Alert) -->
    <div 
      v-if="bootstrapAlert.show" 
      :class="['alert', `alert-${bootstrapAlert.type}`, 'alert-dismissible', 'fade', 'show', 'cosmic-alert-top']" 
      role="alert"
    >
      <span class="alert-icon">{{ bootstrapAlert.type === 'success' ? '✨' : '⚠️' }}</span>
      {{ bootstrapAlert.message }}
      <button type="button" class="btn-close btn-close-white" @click="bootstrapAlert.show = false" aria-label="Close"></button>
    </div>

    <!-- Header de la Terminal (Consistente con payment.vue) -->
    <header class="terminal-header">
      <div class="header-left">
        <div class="terminal-icon">✦</div>
        <div>
          <h1>SISTEMA DE VERIFICACIÓN</h1>
          <p class="subtitle">SERVICIO DE SINCRONIZACIÓN ASTRAL</p>
        </div>
      </div>
      <div class="header-center" v-if="loading">
         <button class="test-mode-btn success" @click="simulateSuccess">🛸 SIMULAR ÉXITO</button>
         <button class="test-mode-btn error" @click="simulateError">💥 SIMULAR FALLO</button>
      </div>
      <div class="header-right">
        <div class="connection-status">
          <span class="status-label">ESTADO DE TRANSFERENCIA</span>
          <span class="status-value uppercase">{{ loading ? 'PROCESANDO...' : status }} <span class="pulse-dot"></span></span>
        </div>
      </div>
    </header>

    <main class="terminal-main">
      <section class="result-card-section">
        <div class="result-card" :class="statusClass">
          <div class="card-glass"></div>
          <div class="card-content">
            <!-- Cargando -->
            <div v-if="loading" class="state-view">
              <div class="cosmic-spinner">
                <div class="orbit"></div>
                <div class="core">✧</div>
              </div>
              <h2 class="loading-text">INTERPRETANDO SEÑALES...</h2>
              <p>Estamos validando tu transacción con la red de Mercado Pago. No cierres esta ventana.</p>
            </div>

            <!-- Éxito -->
            <div v-else-if="status === 'approved'" class="state-view">
              <div class="result-icon success-icon">✨</div>
              <h2 class="success-text">SINCRONIZACIÓN COMPLETADA</h2>
              <p>Tu frecuencia ha sido alineada con el nuevo nivel de conciencia. Tu membresía está activa ahora mismo.</p>
              <div class="transaction-details">
                <span class="detail-label">NODO DE ACCESO:</span> 
                <span class="detail-value">#{{ $route.query.payment_id || 'AUTO_AUTH' }}</span>
              </div>
            </div>

            <!-- Pendiente -->
            <div v-else-if="status === 'pending' || status === 'in_process'" class="state-view">
                <div class="result-icon pending-icon">⏳</div>
                <h2 class="pending-text">TRANSACCIÓN EN SUSPENSO</h2>
                <p>El éter financiero está procesando tu solicitud. Te notificaremos cuando la energía se materialice.</p>
            </div>

            <!-- Error / Fallo -->
            <div v-else class="state-view">
              <div class="result-icon error-icon">✕</div>
              <h2 class="error-text">INTERFERENCIA DETECTADA</h2>
              <p>Hubo un desequilibrio en el flujo de activos. La transacción no se pudo completar con éxito.</p>
              <button class="retry-btn" @click="$router.push('/pagos')">REINTENTAR ACCESO</button>
            </div>

            <button class="home-btn" @click="goToHome">VOLVER AL DASHBOARD</button>
          </div>
        </div>
      </section>
    </main>

    <footer class="terminal-footer">
      <p>PROTOCOLOS DE SEGURIDAD CUÁNTICA ACTIVOS // VERIFICACIÓN INDEPENDIENTE</p>
      <div class="footer-icons">
        <span>🛡️</span> <span>🔒</span> <span>✅</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { mercadoPagoService } from '../services/api.js';
import { useAuthStore } from '../store/auth.js';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const loading = ref(true);
const status = ref('');

// Sistema de Alertas
const bootstrapAlert = ref({ show: false, message: '', type: 'info' });

function showAlert(message, type = 'info') {
  bootstrapAlert.value = { show: true, message, type };
  if (type !== 'error') {
    setTimeout(() => { bootstrapAlert.value.show = false; }, 5000);
  }
}

const statusClass = computed(() => {
  if (loading.value) return 'state-loading';
  if (status.value === 'approved') return 'state-success';
  if (status.value === 'pending' || status.value === 'in_process') return 'state-pending';
  return 'state-error';
});

// Funciones de Simulación
const simulateSuccess = () => {
  loading.value = false;
  status.value = 'approved';
  if (auth.usuario) auth.usuario.estado = 1;
  showAlert('¡Sincronización Exitosa! Todas las funcionalidades han sido desbloqueadas.', 'success');
};

const simulateError = () => {
  loading.value = false;
  status.value = 'rejected';
  showAlert('Error en la transferencia estelar.', 'danger');
};

onMounted(async () => {
  // 1. Obtener ID de pago de la URL (Paso 9 de la Guía)
  const paymentId = route.query.payment_id;
  
  if (paymentId) {
    try {
      // 2. Llamar a verificarPago (Paso 10 de la Guía)
      const response = await mercadoPagoService.verificarPago(paymentId);
      status.value = response.status || 'rejected';

      // 3. Activar usuario si fue aprobado
      if (status.value === 'approved' && response.usuario) {
        auth.setAuth({ token: auth.token, usuario: response.usuario });
      }
    } catch (error) {
      console.error('Error al verificar pago:', error);
      status.value = 'error';
    } finally {
      loading.value = false;
    }
  } else {
    // Si no hay ID (pago cancelado o error directo de MP), tomamos el estado de la URL
    status.value = route.query.status || 'rejected';
    loading.value = false;
  }
});

const goToHome = () => {
  router.push('/home');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&family=Space+Mono&display=swap');

.terminal-page {
  min-height: 100vh;
  background-color: #030308;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow: hidden;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.stars-bg {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)), radial-gradient(1px 1px at 150px 150px, #fff, rgba(0,0,0,0));
  background-size: 400px 400px;
  opacity: 0.1;
  z-index: 0;
}

.nebula-glow {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw; height: 100vh;
  background: radial-gradient(circle, rgba(130, 80, 255, 0.05) 0%, transparent 70%);
  z-index: 0;
}

.scanline {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.01) 50%, transparent 50%);
  background-size: 100% 4px;
  z-index: 10;
  opacity: 0.2;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  z-index: 20;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.terminal-icon { font-size: 2rem; color: #8250ff; }
h1 { font-family: 'Cinzel', serif; font-size: 1.2rem; letter-spacing: 4px; margin: 0; }
.subtitle { font-size: 0.6rem; color: #8250ff; letter-spacing: 2px; }

.status-value { color: #8250ff; font-weight: bold; font-size: 0.7rem; }

.terminal-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.result-card-section {
  width: 100%;
  max-width: 600px;
}

/* Card Styles */
.result-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-glass {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 20, 35, 0.4);
  backdrop-filter: blur(20px);
  z-index: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.state-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Icons */
.result-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-icon { text-shadow: 0 0 30px #4caf50; }
.error-icon { color: #fe5555; text-shadow: 0 0 30px #fe5555; font-family: sans-serif; }
.pending-icon { text-shadow: 0 0 30px #fbbf24; }

h2 {
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  letter-spacing: 3px;
  margin: 0;
}

.success-text { color: #4caf50; }
.error-text { color: #fe5555; }
.pending-text { color: #fbbf24; }

p {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.6;
  max-width: 400px;
}

/* Details */
.transaction-details {
  background: rgba(255,255,255,0.03);
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
  font-family: 'Space Mono', monospace;
  font-size: 0.7rem;
}

.detail-label { color: rgba(255,255,255,0.4); margin-right: 0.5rem; }
.detail-value { color: #8250ff; }

/* Buttons */
.home-btn {
  margin-top: 2rem;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  letter-spacing: 2px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s;
}

.home-btn:hover { background: #fff; color: #000; }

.retry-btn {
  background: #fe5555;
  border: none;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(254, 85, 85, 0.2);
  transition: all 0.3s;
}

.retry-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 25px rgba(254, 85, 85, 0.4); }

/* Spinner */
.cosmic-spinner {
  position: relative;
  width: 80px; height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit {
  position: absolute;
  width: 100%; height: 100%;
  border: 2px solid rgba(130, 80, 255, 0.1);
  border-top: 2px solid #8250ff;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.core {
  font-size: 1.5rem;
  color: #8250ff;
  text-shadow: 0 0 10px #8250ff;
  animation: pulse-core 2s ease-in-out infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse-core { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } }

/* Status modifiers */
.state-success { border-color: rgba(76, 175, 80, 0.3); box-shadow: 0 0 50px rgba(76, 175, 80, 0.05); }
.state-error { border-color: rgba(254, 85, 85, 0.3); box-shadow: 0 0 50px rgba(254, 85, 85, 0.05); }
.state-pending { border-color: rgba(251, 191, 36, 0.3); box-shadow: 0 0 50px rgba(251, 191, 36, 0.05); }

.terminal-footer { text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.03); }
.terminal-footer p { font-size: 0.6rem; color: rgba(255,255,255,0.2); letter-spacing: 2px; max-width: 100%; }

.uppercase { text-transform: uppercase; }

.pulse-dot {
  width: 6px; height: 6px;
  background: #8250ff;
  border-radius: 50%;
  display: inline-block;
  margin-left: 0.5rem;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } }

/* Cosmic Alert Top */
.cosmic-alert-top {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  background: rgba(15, 12, 41, 0.95);
  border: 1px solid rgba(130, 80, 255, 0.4);
  color: #fff;
  backdrop-filter: blur(15px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(130, 80, 255, 0.2);
  font-family: 'Outfit', sans-serif;
  letter-spacing: 1px;
  min-width: 450px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  animation: slideDownAlert 0.4s ease-out;
}

@keyframes slideDownAlert {
  from { transform: translate(-50%, -120%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

.alert-icon { font-size: 1.2rem; }
.btn-close-white { filter: invert(1); border: none; background: transparent; color: #fff; font-size: 1.2rem; cursor: pointer; }

/* Botones de Prueba */
.header-center {
  display: flex;
  gap: 1rem;
}

.test-mode-btn {
  background: rgba(130, 80, 255, 0.05);
  border: 1px dashed rgba(130, 80, 255, 0.5);
  color: rgba(255, 255, 255, 0.7);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.6rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.test-mode-btn.success:hover { background: #4caf50; color: #fff; border-style: solid; border-color: #4caf50; }
.test-mode-btn.error:hover { background: #fe5555; color: #fff; border-style: solid; border-color: #fe5555; }
</style>

