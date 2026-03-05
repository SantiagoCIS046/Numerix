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
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background: rgba(15, 12, 41, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255, 255, 255, 0.1);
  font-family: 'Outfit', sans-serif;
  letter-spacing: 1px;
  width: 90%;
  max-width: 450px;
  border-radius: 12px;
  display: flex !important;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  transition: all 0.3s ease;
}

@media (max-width: 576px) {
  .cosmic-alert-top {
    top: 1rem;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
}

.alert-icon {
  font-size: 1.2rem;
}

.btn-close-white {
  filter: invert(1);
}

@media print {
  .cosmic-alert-top { display: none !important; }
}
</style>
