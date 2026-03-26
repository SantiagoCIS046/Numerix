<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const monto = ref(0);
const titulo = ref('');
const loading = ref(false);
const error = ref('');

onMounted(() => {
  // ... (rest of onMounted stays same)
});

const iniciarPago = async () => {
  if (monto.value <= 0) return;
  loading.value = true;
  error.value = '';
  
  // Simulación de proceso de activación
  setTimeout(() => {
    loading.value = false;
    router.push({ 
      path: '/pagos/exito', 
      query: { status: 'approved' } 
    });
  }, 1500);
};
</script>

<template>
  <div class="terminal-page mx-auto">
    <div class="stars-bg"></div>
    <div class="scanline"></div>
    <div class="payment-container" style="position: relative; z-index: 10;">
      <h1>Confirmación de Membresía</h1>
      <div v-if="monto > 0">
        <p>Has seleccionado el plan: <span class="highlight">{{ titulo }}</span></p>
        <p class="price-val">Inversión Astral: ${{ monto.toLocaleString() }}</p>
        <button class="sync-btn" @click="iniciarPago" :disabled="loading">
          {{ loading ? 'Sincronizando...' : 'Confirmar Suscripción' }}
        </button>
      </div>
      <div v-else>
        <p>Error: No se ha seleccionado un plan válido.</p>
        <button class="sync-btn" @click="$router.push('/suscripcion')">Volver</button>
      </div>
      <p v-if="error" class="error-msg">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&family=Space+Mono&display=swap');
.terminal-page { min-height: 100vh; background-color: #050510; color: #fff; font-family: 'Outfit', sans-serif; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.stars-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: radial-gradient(1px 1px at 10% 20%, #fff 100%, transparent), radial-gradient(1px 1px at 50% 50%, #fff 100%, transparent); background-size: 300px 300px; opacity: 0.1; z-index: 0; }
.scanline { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(130, 80, 255, 0.05) 50%, transparent 50%); background-size: 100% 4px; pointer-events: none; z-index: 10; opacity: 0.3; }
.payment-container { background: rgba(255, 255, 255, 0.05); padding: 40px; border-radius: 12px; border: 1px solid rgba(130, 80, 255, 0.4); text-align: center; max-width: 500px; width: 100%; backdrop-filter: blur(10px); }
h1 { font-family: 'Cinzel', serif; color: #8257ff; margin-bottom: 20px; }
.highlight { font-weight: 700; color: #fff; }
.price-val { font-size: 1.5rem; font-family: 'Space Mono', monospace; font-weight: bold; margin: 15px 0; }
.sync-btn { background: #582acc; border: none; color: #fff; padding: 15px 30px; font-size: 1rem; border-radius: 6px; cursor: pointer; margin-top: 20px; font-weight: 600; transition: transform 0.2s, background 0.2s; }
.sync-btn:hover:not(:disabled) { background: #6a34eb; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(88, 42, 204, 0.4); }
.sync-btn:disabled { opacity: 0.7; cursor: wait; }
.error-msg { color: #ff5252; margin-top: 15px; font-size: 0.9rem; }
</style>
