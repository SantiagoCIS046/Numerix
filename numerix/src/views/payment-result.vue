<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authStore } from '../store/auth.js';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const status = ref('approved');

onMounted(async () => {
  // Modo Mock: Aprobamos automáticamente
  status.value = route.query.status || 'approved';
  
  if (status.value === 'approved') {
    const user = authStore.currentUser.value;
    if (user) {
      // Simulamos actualización de plan en el perfil local
      const storedPlan = localStorage.getItem('selectedPlanTemp');
      const planName = storedPlan ? JSON.parse(storedPlan).name : 'Plan Estelar';
      authStore.setSession(authStore.token.value, { ...user, plan: planName });
    }
  }
});

const goToHome = () => {
  router.push('/home');
};
</script>

<template>
  <div class="terminal-page mx-auto">
    <div class="stars-bg"></div>
    <div class="scanline"></div>
    <div class="result-container" style="position: relative; z-index: 10;">
      <div v-if="loading">
        <div class="spinner"></div>
        <h1>Sincronizando...</h1>
        <p>Por favor espera un momento mientras validamos tu acceso.</p>
      </div>
      <div v-else>
        <div v-if="status === 'approved'">
          <h1 class="success">✨ ¡Plan Activado!</h1>
          <p>Tu membresía ha sido configurada exitosamente. Bienvenido a tu nuevo ciclo cósmico.</p>
        </div>
        <div v-else>
          <h1 class="error">❌ Sincronización Fallida</h1>
          <p>Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo.</p>
        </div>
        <button class="sync-btn" @click="goToHome">Volver al Dashboard</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Outfit:wght@300;400;600&family=Space+Mono&display=swap');
.terminal-page { min-height: 100vh; background-color: #050510; color: #fff; font-family: 'Outfit', sans-serif; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.stars-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: radial-gradient(1px 1px at 10% 20%, #fff 100%, transparent); background-size: 300px 300px; opacity: 0.1; z-index: 0; }
.scanline { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(130, 80, 255, 0.05) 50%, transparent 50%); background-size: 100% 4px; pointer-events: none; z-index: 10; opacity: 0.3; }
.result-container { background: rgba(255, 255, 255, 0.05); padding: 50px; border-radius: 12px; border: 1px solid rgba(130, 80, 255, 0.4); text-align: center; max-width: 500px; backdrop-filter: blur(10px); }
h1 { font-family: 'Cinzel', serif; margin-bottom: 15px; }
.success { color: #4caf50; }
.pending { color: #ffeb3b; }
.error { color: #ff5252; text-shadow: 0 0 10px rgba(255, 82, 82, 0.3); }
p { color: rgba(255, 255, 255, 0.8); line-height: 1.6; }
.sync-btn { background: #582acc; border: none; color: #fff; padding: 12px 25px; font-size: 1rem; border-radius: 6px; cursor: pointer; margin-top: 25px; transition: transform 0.2s, background 0.2s; font-weight: 600; }
.sync-btn:hover { background: #6a34eb; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(88, 42, 204, 0.3); }

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(130, 80, 255, 0.3);
  border-top-color: #8257ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
