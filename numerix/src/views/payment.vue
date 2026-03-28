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

    <!-- Header de la Terminal -->
    <header class="terminal-header">
      <div class="header-left">
        <button class="back-btn-cosmic" @click="$router.push('/suscripcion')">← <span>VOLVER A PLANES</span></button>
        <div class="terminal-icon">✦</div>
        <div>
          <h1>TERMINAL CÓSMICA</h1>
          <p class="subtitle">TRANSACCIÓN ASTRAL ASEGURADA</p>
        </div>
      </div>
      <div class="header-center">
         <button class="test-mode-btn" @click="fillRandomData">🛸 MODO PRUEBA: AUTO-RELLENAR</button>
      </div>
      <div class="header-right">
        <div class="connection-status">
          <span class="status-label">ESTADO DE CONEXIÓN</span>
          <span class="status-value">ÓRBITA_ESTABLE <span class="pulse-dot"></span></span>
        </div>
        <button class="settings-btn">⚙</button>
      </div>
    </header>

    <main class="terminal-main">
      <!-- Columna Izquierda: Formulario -->
      <section class="payment-form-section">
        <div class="tabs">
          <button class="tab active">
            <span class="tab-icon">💳</span> Tarjeta Astral
          </button>
        </div>

        <div class="form-container">
          <div class="field">
            <label>NOMBRE DE AUTORIDAD DEL NAVEGANTE</label>
            <div class="input-wrapper">
              <input 
                ref="cardNameInput"
                v-model="form.name" 
                type="text" 
                placeholder="ELARA VANCE"
                maxlength="30"
              />
              <span class="field-icon">👤</span>
            </div>
          </div>

          <div class="field">
            <label>ID DE SECUENCIA INTERESTELAR</label>
            <div class="input-wrapper">
              <input 
                ref="cardNumberInput"
                v-model="form.number" 
                type="text" 
                placeholder="XXXX XXXX XXXX XXXX"
                @input="formatCardNumber"
                maxlength="19"
              />
              <span class="field-icon">🔢</span>
            </div>
          </div>

          <div class="form-row">
            <div class="field">
              <label>LÍMITE TEMPORAL</label>
              <div class="input-wrapper">
                <input 
                  ref="cardExpiryInput"
                  v-model="form.expiry" 
                  type="text" 
                  placeholder="MM/YY"
                  maxlength="5"
                  @input="formatExpiry"
                />
                <span class="field-icon">📅</span>
              </div>
            </div>
            <div class="field">
              <label>CIFRADO DE ACCESO</label>
              <div class="input-wrapper">
                <input 
                  v-model="form.cvc" 
                  type="password" 
                  placeholder="***"
                  maxlength="3"
                />
                <span class="field-icon">🔒</span>
              </div>
            </div>
          </div>

          <button class="sync-btn" @click="iniciarPago" :disabled="loading">
            <span v-if="loading" class="loader"></span>
            <span v-else>⚡ SINCRONIZAR ACTIVOS</span>
          </button>

          <p v-if="error" class="error-msg">{{ error }}</p>

          <div class="secondary-options">
            <p class="opt-label">O VINCULAR VÍA NODO DIGITAL</p>
            <div class="opt-grid">
              <div class="opt-item">
                <span class="opt-icon"></span>
                <span>APPLE PAY</span>
              </div>
              <div class="opt-item">
                <span class="opt-icon">₿</span>
                <span>CRIPTO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Columna Derecha: Previsualización -->
      <section class="preview-section">
        <!-- Cuadro de Resumen del Plan (Ahora encima) -->
        <div class="plan-summary">
          <div class="summary-header">
            <span class="summary-icon">🔮</span>
            <span class="summary-title">RESUMEN DEL PLAN</span>
          </div>
          <div class="summary-body">
            <div class="summary-row">
              <span class="label">NIVEL SELECCIONADO:</span>
              <span class="value highlight-text">{{ titulo }}</span>
            </div>
            <div class="summary-row">
              <span class="label">COSTO DE ACCESO:</span>
              <span class="value cosmos-price">${{ monto.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="virtual-card">
          <div class="card-glass"></div>
          <div class="card-content">
            <div class="card-top">
              <div class="card-chip"></div>
              <div class="card-logo">🚀</div>
            </div>
            <div class="card-number">
              {{ form.number || '4425 9100 2481 0042' }}
            </div>
            <div class="card-footer">
              <div class="card-info">
                <span class="label">NOMBRE DE AUTORIDAD</span>
                <span class="value">{{ form.name || 'ELARA VANCE' }}</span>
              </div>
              <div class="card-info">
                <span class="label">VÁLIDO HASTA</span>
                <span class="value">{{ form.expiry || '12 / 29' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="terminal-stats">
          <div class="stat-item">
            <span class="stat-label">ÍNDICE DE ACTIVOS</span>
            <span class="stat-value">#A9-Z02</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">NIVEL DE SEGURIDAD</span>
            <span class="stat-value">QUANTUM_L5</span>
          </div>
        </div>
      </section>
    </main>

    <footer class="terminal-footer">
      <p>IMPULSADO POR EL PROTOCOLO LEDGER CÓSMICO</p>
      <div class="footer-icons">
        <span>🛡️</span> <span>🔒</span> <span>✅</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { authService, mercadoPagoService } from '../services/api.js';
import { useAuthStore } from '../store/auth.js';

const route = useRoute();
const authStore = useAuthStore();

const monto = ref(0);
const titulo = ref("");
const loading = ref(false);
const error = ref("");

// Sistema de Alertas (Bootstrap compatible con el diseño cósmico)
const bootstrapAlert = ref({ show: false, message: '', type: 'danger' });

function showAlert(message, type = 'danger') {
  bootstrapAlert.value = { show: true, message, type };
  setTimeout(() => { bootstrapAlert.value.show = false; }, 5000);
}

onMounted(() => {
  // 1. Obtener datos de la URL (Paso 1 de la Guía)
  if (route.query.monto) monto.value = Number(route.query.monto);
  if (route.query.titulo) titulo.value = route.query.titulo;

  // Fallback si no hay query params
  if (!monto.value) {
    const stored = localStorage.getItem('selectedPlanTemp');
    if (stored) {
      const plan = JSON.parse(stored);
      monto.value = Number(String(plan.price).replace(/[^0-9.]/g, ''));
      titulo.value = plan.name;
    }
  }
});

const iniciarPago = async () => {
  if (monto.value <= 0) {
    showAlert("Monto de pago no válido.", "warning");
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    // 2. Llamar al servicio simplificado (Paso 4 de la Guía)
    const response = await mercadoPagoService.crearPreferenciaPago(monto.value, titulo.value);
    
    if (response.success) {
      // 3. Redirigir a Mercado Pago (Paso 6 de la Guía)
      const redirectUrl = response.sandbox_init_point || response.init_point;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        error.value = 'Error: No se recibió enlace de pago de MP.';
      }
    } else {
      error.value = response.error || 'Error al procesar la preferencia.';
    }
  } catch (err) {
    console.error('Error al iniciar pago:', err);
    error.value = `Error de conexión: ${err.message || 'Intente más tarde'}`;
  } finally {
    loading.value = false;
  }
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
  overflow-x: hidden;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.stars-bg {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 150px 150px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 300px 50px, #fff, rgba(0,0,0,0));
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
  pointer-events: none;
  z-index: 0;
}

.scanline {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, rgba(255,255,255,0.02) 50%, transparent 50%);
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 10;
  opacity: 0.2;
}

/* Header */
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

.terminal-icon {
  font-size: 2rem;
  color: #8250ff;
  text-shadow: 0 0 15px rgba(130, 80, 255, 0.5);
}

h1 {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  letter-spacing: 4px;
  margin: 0;
}

.subtitle {
  font-size: 0.7rem;
  letter-spacing: 2px;
  color: #8250ff;
  opacity: 0.8;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.connection-status {
  text-align: right;
}

.status-label {
  display: block;
  font-size: 0.6rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 1px;
}

.status-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #8250ff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn-cosmic {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(130, 80, 255, 0.3);
  color: rgba(255, 255, 255, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.6rem;
  letter-spacing: 2px;
  margin-right: 1.5rem;
  transition: all 0.3s;
  font-family: 'Outfit', sans-serif;
}

.back-btn-cosmic:hover {
  background: rgba(130, 80, 255, 0.1);
  color: #fff;
  border-color: #8250ff;
}

.back-btn-cosmic span {
  font-weight: 700;
}

.test-mode-btn {
  background: rgba(130, 80, 255, 0.1);
  border: 1px dashed #8250ff;
  color: #8250ff;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 1px;
}

.test-mode-btn:hover {
  background: #8250ff;
  color: #fff;
  box-shadow: 0 0 15px rgba(130, 80, 255, 0.4);
}

.pulse-dot {
  width: 8px; height: 8px;
  background: #8250ff;
  border-radius: 50%;
  box-shadow: 0 0 8px #8250ff;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } }

.settings-btn {
  background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; opacity: 0.5;
}

/* Main Layout */
.terminal-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1000px;
  margin: 0 auto;
  z-index: 20;
  width: 100%;
  transform: scale(0.95);
  transform-origin: top center;
}

/* Payment Form */
.payment-form-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  background: rgba(255,255,255,0.03);
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.05);
}

.tab {
  flex: 1;
  padding: 1rem;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.4);
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab.active {
  background: #4e44ff;
  color: #fff;
  box-shadow: 0 4px 15px rgba(78, 68, 255, 0.3);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.field label {
  font-size: 0.7rem;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.4);
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1.2rem 1.2rem 1.2rem 3rem;
  color: #fff;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Space Mono', monospace;
  transition: all 0.3s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #8250ff;
  background: rgba(130, 80, 255, 0.05);
  box-shadow: 0 0 15px rgba(130, 80, 255, 0.1);
}

.field-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.4;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.sync-btn {
  margin-top: 1rem;
  padding: 1.5rem;
  background: #4e44ff;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'Cinzel', serif;
  font-weight: 700;
  letter-spacing: 3px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sync-btn:hover:not(:disabled) {
  background: #6259ff;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(78, 68, 255, 0.4);
}

.sync-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.error-msg {
  color: #ff5252;
  font-size: 0.8rem;
  text-align: center;
  background: rgba(255, 82, 82, 0.05);
  padding: 0.8rem;
  border-radius: 4px;
}

.secondary-options {
  margin-top: 2rem;
  text-align: center;
}

.opt-label {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
}

.opt-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.opt-item {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 1.5rem 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  font-size: 0.6rem;
  letter-spacing: 1px;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.opt-item:hover {
  background: rgba(255,255,255,0.05);
  color: #fff;
  border-color: rgba(255,255,255,0.2);
}

.opt-icon {
  font-size: 1.5rem;
}

/* Preview Section */
.preview-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.virtual-card {
  width: 450px;
  height: 280px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border: 1px solid rgba(255,255,255,0.1);
}

.card-glass {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  z-index: 1;
}

.card-content {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
  z-index: 2;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-chip {
  width: 50px; height: 40px;
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
  border-radius: 6px;
  opacity: 0.8;
}

.card-logo { font-size: 2rem; }

.card-number {
  font-family: 'Space Mono', monospace;
  font-size: 1.8rem;
  letter-spacing: 4px;
  text-shadow: 0 0 10px rgba(255,255,255,0.3);
}

.card-footer {
  display: flex;
  justify-content: space-between;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.card-info .label {
  font-size: 0.6rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 1.5px;
}

.card-info .value {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 2px;
}

.terminal-stats {
  display: flex;
  gap: 3rem;
  padding: 1.5rem 3rem;
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.6rem;
  color: rgba(130, 80, 255, 0.6);
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-family: 'Space Mono', monospace;
  font-size: 0.8rem;
  color: #fff;
  letter-spacing: 1px;
}

/* Plan Summary Box */
.plan-summary {
  width: 100%;
  background: rgba(130, 80, 255, 0.05);
  border: 1px solid rgba(130, 80, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  backdrop-filter: blur(10px);
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 0.5rem;
}

.summary-title {
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  letter-spacing: 2px;
  color: #8250ff;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.summary-row .label {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 1px;
}

.summary-row .value {
  font-family: 'Space Mono', monospace;
  font-size: 0.85rem;
}

.highlight-text {
  color: #fff;
  font-weight: bold;
}

.cosmos-price {
  color: #fbbf24;
  font-weight: bold;
  font-size: 1.2rem !important;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
}

/* Footer */
.terminal-footer {
  margin-top: auto;
  text-align: center;
  padding-top: 3rem;
  border-top: 1px solid rgba(255,255,255,0.03);
}

.terminal-footer p {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 3px;
}

.footer-icons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  opacity: 0.5;
}

@media (max-width: 1100px) {
  .terminal-main {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .virtual-card {
    width: 320px;
    height: 200px;
  }
  .card-content { padding: 1.5rem; }
  .card-number { font-size: 1.2rem; }
  .terminal-header { flex-direction: column; gap: 2rem; text-align: center; }
  .header-left { flex-direction: column; }
}
</style>

