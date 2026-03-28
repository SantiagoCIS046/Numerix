<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: #050508;
}

/* Global Cosmic Alert Top */
.cosmic-alert-top {
  position: fixed;
  top: 1.2rem;
  right: 1.2rem;
  z-index: 99999;
  background: rgba(10, 10, 20, 0.96);
  border: 1px solid rgba(130, 80, 255, 0.6);
  color: #fff;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 15px rgba(130, 80, 255, 0.2);
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  width: auto;
  min-width: 280px;
  max-width: 380px;
  border-radius: 10px;
  display: flex !important;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: slideInRightCosmic 0.5s ease-out;
}

@keyframes slideInRightCosmic {
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Modificadores de color para Alertas */
.alert-danger { border-color: #ff3366 !important; box-shadow: 0 0 25px rgba(255, 51, 102, 0.4); }
.alert-success { border-color: #00ffaa !important; box-shadow: 0 0 25px rgba(0, 255, 170, 0.4); }
.alert-warning { border-color: #fbbf24 !important; box-shadow: 0 0 25px rgba(251, 191, 36, 0.4); }

.alert-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 5px currentColor);
}

.btn-close-white {
  filter: invert(1);
}

@media print {
  .cosmic-alert-top { display: none !important; }
}
</style>
