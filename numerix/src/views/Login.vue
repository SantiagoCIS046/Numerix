<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../services/api.js";
import { useI18n } from "@/composables/useI18n";
import { authStore } from "@/store/auth.js";
import { validateEmail, firstError, required } from "@/utils/validators.js";

const { t } = useI18n();

const router = useRouter();
const step = ref(1); // 1: Seleccionar Rol, 2: Auth
const mode = ref("login"); // 'login' | 'register'
const loading = ref(false);
const error = ref("");
const success = ref("");
const selectedRole = ref(null);
const passwordVisible = ref(false);

const bootstrapAlert = ref({ show: false, message: '', type: 'info' })

function showAlert(message, type = 'info') {
  bootstrapAlert.value = { show: true, message, type }
  setTimeout(() => {
    bootstrapAlert.value.show = false
  }, 4000)
}

const roles = computed(() => [
  {
    id: 1,
    name: t('auth.roles.traveler.name'),
    label: t('auth.roles.traveler.label'),
    description: t('auth.roles.traveler.desc'),
    icon: "✦",
  },
  {
    id: 2,
    name: t('auth.roles.guide.name'),
    label: t('auth.roles.guide.label'),
    description: t('auth.roles.guide.desc'),
    icon: "🔭",
  },
])

const loginForm = reactive({ email: "", password: "" });
const registerForm = reactive({
  nombre: "",
  email: "",
  password: "",
  fecha_nacimiento: "",
  id_rol: null,
});

function selectRole(roleId) {
  selectedRole.value = roleId;
  registerForm.id_rol = roleId;
  step.value = 2;
}

function goBack() {
  step.value = 1;
  selectedRole.value = null;
  registerForm.id_rol = null;
}

function switchMode(newMode) {
  mode.value = newMode;
  error.value = "";
  success.value = "";
  passwordVisible.value = false;
}

async function handleLogin() {
  error.value = "";

  // Validar con utils/validators.js
  const validationError = firstError(
    required(loginForm.email, 'El email'),
    validateEmail(loginForm.email),
    required(loginForm.password, 'La contraseña'),
  )
  if (validationError) {
    error.value = validationError;
    return;
  }

  loading.value = true;
  try {
    const data = await authService.login(loginForm.email, loginForm.password);

    // Usar authStore en lugar de setItem directo
    authStore.setSession(data.token, data.user[0]);

    router.push("/alineacion");
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  error.value = "";
  success.value = "";

  const { nombre, email, password, fecha_nacimiento } = registerForm;
  if (!nombre || !email || !password || !fecha_nacimiento) {
    error.value = t('auth.alerts.fillFields');
    return;
  }

  loading.value = true;
  try {
    await authService.register(nombre, email, password, fecha_nacimiento);
    success.value = t('auth.alerts.success');
    switchMode("login");
    loginForm.email = email;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="stars-overlay"></div>

    <!-- Bootstrap Alert -->
    <div 
      v-if="bootstrapAlert.show" 
      :class="['alert', `alert-${bootstrapAlert.type}`, 'alert-dismissible', 'fade', 'show', 'cosmic-alert-top']" 
      role="alert"
    >
      <span class="alert-icon">✨</span>
      {{ bootstrapAlert.message }}
      <button type="button" class="btn-close btn-close-white" @click="bootstrapAlert.show = false" aria-label="Close"></button>
    </div>

    <!-- STEP 1: ROLE SELECTION -->
    <div v-if="step === 1" class="role-selection">
      <div class="selection-header">
        <h1 class="stellar-title">{{ t('auth.identity') }}</h1>
        <p class="stellar-subtitle">{{ t('auth.subtitle') }}</p>
      </div>

      <div class="role-grid">
        <div
          v-for="role in roles"
          :key="role.id"
          class="role-card"
          @click="selectRole(role.id)"
        >
          <div class="role-glow"></div>
          <div class="role-content">
            <span class="role-icon">{{ role.icon }}</span>
            <h2 class="role-name">{{ role.name }}</h2>
            <p class="role-desc">{{ role.description }}</p>
            <div class="role-select-btn">{{ t('auth.chooseEssence') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 2: LOGIN / REGISTER -->
    <div v-else class="auth-card">
      <button class="back-btn" @click="goBack"><span>←</span> {{ t('auth.back') }}</button>

      <div class="auth-header">
        <div class="logo-icon">✦</div>
        <h1 class="brand">{{ t('auth.access') }}</h1>
        <p class="subtitle" v-if="selectedRole">
          {{ t('auth.syncingAs') }}
          {{ roles.find((r) => r.id === selectedRole)?.name }}
        </p>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          :class="['tab', { active: mode === 'login' }]"
          @click="switchMode('login')"
        >
          {{ t('auth.tabs.sync') }}
        </button>
        <button
          :class="['tab', { active: mode === 'register' }]"
          @click="switchMode('register')"
        >
          {{ t('auth.tabs.transcend') }}
        </button>
      </div>

      <!-- Mensajes -->
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <!-- LOGIN FORM -->
      <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="form">
        <div class="field">
          <label>{{ t('auth.fields.identityLabel') }}</label>
          <div class="input-wrapper">
            <input
              v-model="loginForm.email"
              type="email"
              :placeholder="t('auth.fields.identityPlaceholder')"
              autocomplete="email"
            />
            <span class="input-icon">🌍</span>
          </div>
        </div>
        <div class="field">
          <label>{{ t('auth.fields.sigilLabel') }}</label>
          <div class="input-wrapper">
            <input
              v-model="loginForm.password"
              :type="passwordVisible ? 'text' : 'password'"
              :placeholder="t('auth.fields.sigilPlaceholder')"
              autocomplete="current-password"
            />
            <span
              class="password-toggle"
              @click="passwordVisible = !passwordVisible"
            >
              <svg
                v-if="passwordVisible"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </span>
          </div>
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            <input type="checkbox" />
            <span class="checkmark"></span>
            {{ t('auth.options.anchor') }}
          </label>
          <a href="#" class="forgot-link">{{ t('auth.options.forgot') }}</a>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <div v-if="loading" class="lds-hourglass"></div>
          <span v-else>{{ t('auth.buttons.login') }}</span>
        </button>

        <div class="divider">
          <span>{{ t('auth.options.others') }}</span>
        </div>

        <div class="social-login">
          <button type="button" class="btn-social">
            <span class="social-icon">G</span> {{ t('auth.options.oracle') }}
          </button>
          <button type="button" class="btn-social">
            <span class="social-icon">☁</span> {{ t('auth.options.ether') }}
          </button>
        </div>
      </form>

      <!-- REGISTER FORM -->
      <form v-else @submit.prevent="handleRegister" class="form">
        <div class="field">
          <label>{{ t('auth.fields.nameLabel') }}</label>
          <input
            v-model="registerForm.nombre"
            type="text"
            :placeholder="t('auth.fields.namePlaceholder')"
            autocomplete="name"
          />
        </div>
        <div class="field">
          <label>{{ t('auth.fields.emailLabel') }}</label>
          <input
            v-model="registerForm.email"
            type="email"
            :placeholder="t('auth.fields.identityPlaceholder')"
            autocomplete="email"
          />
        </div>
        <div class="field">
          <label>{{ t('auth.fields.passLabel') }}</label>
          <div class="input-wrapper">
            <input
              v-model="registerForm.password"
              :type="passwordVisible ? 'text' : 'password'"
              :placeholder="t('auth.fields.passPlaceholder')"
              autocomplete="new-password"
            />
            <span
              class="password-toggle"
              @click="passwordVisible = !passwordVisible"
            >
              <svg
                v-if="passwordVisible"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </span>
          </div>
        </div>
        <div class="field">
          <label>{{ t('auth.fields.dateLabel') }}</label>
          <input v-model="registerForm.fecha_nacimiento" type="date" />
        </div>

        <!-- Role Select within Register (if not selected) -->
        <div class="field" v-if="!selectedRole">
          <label>{{ t('auth.chooseEssence') }}</label>
          <select v-model="registerForm.id_rol" class="stellar-select">
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <div v-if="loading" class="lds-hourglass"></div>
          <span v-else>{{ t('auth.buttons.register') }}</span>
        </button>
      </form>

      <div class="auth-footer">
        <div class="footer-links">
          <span @click="showAlert(t('auth.alerts.ethicsMsg'), 'info')">{{ t('auth.footer.ethics') }}</span>
          <span @click="showAlert(t('auth.alerts.harmonyMsg'), 'info')">{{ t('auth.footer.harmony') }}</span>
          <span @click="showAlert(t('auth.alerts.voidMsg'), 'info')">{{ t('auth.footer.void') }}</span>
        </div>
        <div class="footer-tag">{{ t('auth.footer.tagline') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    circle at center,
    #24243e 0%,
    #1b1641 50%,
    #0f0c29 100%
  );
  padding: 2rem;
  position: relative;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}

.stars-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      1px 1px at 20px 30px,
      #fff,
      rgba(0, 0, 0, 0)
    ),
    radial-gradient(1px 1px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(1px 1px at 50px 160px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 90px 40px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 130px 80px, #fff, rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.3;
  pointer-events: none;
}

/* ROLE SELECTION STYLES */
.role-selection {
  width: 100%;
  max-width: 900px;
  z-index: 10;
  animation: fadeIn 0.8s ease-out;
}

.selection-header {
  text-align: center;
  margin-bottom: 4rem;
}

.stellar-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5rem;
  text-shadow: 0 0 20px rgba(201, 169, 110, 0.4);
  margin-bottom: 1rem;
}

.stellar-subtitle {
  color: #c9a96e;
  font-size: 1.2rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
}

.role-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 3rem 2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  text-align: center;
}

.role-card:hover {
  transform: translateY(-10px);
  border-color: #c9a96e;
  background: rgba(201, 169, 110, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.role-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  background: radial-gradient(
    circle,
    rgba(201, 169, 110, 0.15) 0%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.4s;
}

.role-card:hover .role-glow {
  opacity: 1;
}

.role-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: block;
  filter: drop-shadow(0 0 10px rgba(201, 169, 110, 0.5));
}

.role-name {
  color: #fff;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  letter-spacing: 1px;
}

.role-desc {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.role-select-btn {
  display: inline-block;
  padding: 0.8rem 2rem;
  border: 1px solid #c9a96e;
  border-radius: 50px;
  color: #c9a96e;
  font-weight: 600;
  transition: all 0.3s;
}

.role-card:hover .role-select-btn {
  background: #c9a96e;
  color: #0f0c29;
}

/* AUTH CARD */
.auth-card {
  background: rgba(20, 15, 45, 0.7);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(201, 169, 110, 0.2);
  border-radius: 32px;
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 10;
  animation: slideUp 0.6s ease-out;
}

.back-btn {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.back-btn:hover {
  color: #c9a96e;
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-icon {
  font-size: 3rem;
  color: #c9a96e;
  margin-bottom: 1rem;
  animation: pulse 3s infinite;
}

.brand {
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 4px;
  margin: 0;
}

.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 6px;
  margin-bottom: 2rem;
}

.tab {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.4);
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.tab.active {
  background: #c9a96e;
  color: #0f0c29;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  color: #c9a96e;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-bottom: 0.6rem;
}

.input-wrapper {
  position: relative;
}

.field input,
.stellar-select {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem 1.2rem;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s;
}

.input-wrapper input {
  padding-right: 3rem;
}

.input-icon {
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  opacity: 0.5;
}

.password-toggle {
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s;
  user-select: none;
  z-index: 2;
  display: flex;
  align-items: center;
}

.password-toggle:hover {
  opacity: 1;
  transform: translateY(-50%) scale(1.1);
  color: #c9a96e;
}

.field input:focus,
.stellar-select:focus {
  border-color: #c9a96e;
  background: rgba(201, 169, 110, 0.05);
  box-shadow: 0 0 15px rgba(201, 169, 110, 0.1);
}

.btn-primary {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #c9a96e 0%, #a07840 100%);
  border: none;
  border-radius: 12px;
  color: #0f0c29;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  letter-spacing: 1px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(201, 169, 110, 0.3);
}

.alert {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  letter-spacing: 1px;
}

.forgot-link {
  color: #c9a96e;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 1px;
}

.divider {
  text-align: center;
  margin: 2rem 0;
  position: relative;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.divider span {
  background: #140f2d;
  padding: 0 1rem;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.7rem;
  letter-spacing: 2px;
  position: relative;
  z-index: 2;
}

.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-social {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.8rem;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-social:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.social-icon {
  font-size: 1.1rem;
  color: #c9a96e;
}

.auth-footer {
  margin-top: 3rem;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.7rem;
  letter-spacing: 2px;
  margin-bottom: 2rem;
}

.footer-links span {
  cursor: pointer;
  transition: color 0.3s;
}

.footer-links span:hover {
  color: #c9a96e;
}

.footer-tag {
  color: rgba(255, 255, 255, 0.1);
  font-size: 0.6rem;
  letter-spacing: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 50px;
}
.alert-success {
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* HOURGLASS SPINNER */
.lds-hourglass {
  display: inline-block;
  position: relative;
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
.lds-hourglass:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 0;
  box-sizing: border-box;
  border: 12px solid #0f0c29;
  border-color: #0f0c29 transparent #0f0c29 transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}

/* Media Queries */
@media (max-width: 600px) {
  .stellar-title {
    font-size: 2rem;
  }
  .auth-card {
    padding: 2rem;
  }
}
</style>
