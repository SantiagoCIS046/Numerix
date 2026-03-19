<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToSubscription() {
  router.push('/suscripcion')
}
</script>

<template>
  <div class="subscription-overlay">
    <div class="overlay-content">
      <div class="lock-icon">🔒</div>
      <h2 class="overlay-title">ACCESO RESTRINGIDO</h2>
      <p class="overlay-desc">
        Para acceder a las lecturas personalizadas y el horóscopo detallado, necesitas una suscripción activa.
      </p>
      <div class="overlay-actions">
        <button class="btn-subscribe" @click="goToSubscription">
          VER DIMENSIONES CÓSMICAS
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subscription-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(5, 5, 8, 0.7);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
  box-sizing: border-box;
}

.overlay-content {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4rem 3rem;
  border-radius: 24px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.lock-icon {
  font-size: 3rem;
  margin-bottom: 2rem;
  filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.5));
}

.overlay-title {
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  letter-spacing: 4px;
  margin-bottom: 1.5rem;
  color: #fff;
}

.overlay-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 3rem;
}

.btn-subscribe {
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.btn-subscribe:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 40px rgba(99, 102, 241, 0.5);
  background: #4f46e5;
}

@media (max-width: 768px) {
  .overlay-content {
    padding: 3rem 2rem;
  }
  .overlay-title {
    font-size: 1.4rem;
  }
}
</style>
