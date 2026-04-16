<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { authService, passwordService } from "../services/api";
import { useAuthStore } from "../store/auth";
import { useNotificationStore } from '../store/notifications.js';
import { useI18n } from "@/composables/useI18n";
import { validateEmail, firstError, required } from "@/utils/validators.js";
import { httpClient } from "@/plugins/http.js";

const { t } = useI18n();

const router = useRouter();
const auth = useAuthStore();
const notifStore = useNotificationStore();
const step = ref(1); // 1: Seleccionar Rol, 2: Auth
const mode = ref("login"); // 'login' | 'register'
const loading = ref(false);
const error = ref("");
const success = ref("");
const selectedRole = ref(null);
const passwordVisible = ref(true);
const today = new Date().toISOString().split('T')[0];

const emailInput = ref(null);
const passwordInput = ref(null);
const nameInput = ref(null);
const birthInput = ref(null);

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
    showAlert(validationError, 'danger');
    error.value = validationError;
    
    // Enfocar el campo específico basado en el error
    if (validationError.toLowerCase().includes('email')) {
      emailInput.value?.focus();
    } else if (validationError.toLowerCase().includes('contraseña')) {
      passwordInput.value?.focus();
    }
    
    return;
  }

  loading.value = true;
  try {
    const res = await authService.login(loginForm.email, loginForm.password);
    console.log("RESPUESTA BACKEND:", res);

    const data = res;
    // El backend devuelve el usuario en un array: user[0]
    const userArray = data?.user || data?.usuario;

    if (!userArray || (Array.isArray(userArray) && userArray.length === 0)) {
      console.error("No hay usuario en la respuesta", data);
      error.value = "Error de sincronización: No se encontró perfil de usuario.";
      return;
    }

    let user = Array.isArray(userArray) ? userArray[0] : userArray;
    let rol = user.id_rol || user.role_id;
    console.log ("ROL DETECTADO:", rol);

    // 🛡️ ACCESO PRIVILEGIADO: Forzar Admin para cuenta específica
    if (loginForm.email.toLowerCase() === 'santiagocisneros046@gmail.com') {
      console.log("👑 ACCESO MAESTRO DETECTADO PARA:", loginForm.email);
      rol = 2; // Rango de Guía Cósmico (Admin)
      user.id_rol = 2; // Sincronizar en el objeto de usuario
    }

    console.log("ROL DETECTADO:", rol);

    // GUARDAR TOKEN + ROL (OBLIGATORIO)
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (rol) {
      localStorage.setItem("rol", rol);
    }
    
    // Sincronizar Pinia (espera el objeto usuario, no el array)
    auth.setAuth({ token: data.token, usuario: user });

    // REDIRECCIÓN: El router espera Rol 2 para el Dashboard Administrativo
    if (rol == 2 || rol === 'admin') {
      router.push("/guia-dashboard");
    } else {
      router.push("/home");
    }
  } catch (e) {
    error.value = e.message || "Falla en la Sincronización Estelar.";
    console.error("Login fatal error", e);
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  error.value = "";
  success.value = "";

  const { nombre, email, password, fecha_nacimiento } = registerForm;
  
  if (!nombre) {
    showAlert('Por favor, ingresa tu nombre para el registro astral.', 'danger');
    nameInput.value?.focus();
    return;
  }
  if (!email) {
    showAlert('El correo electrónico es esencial para sincronizar tu cuenta.', 'danger');
    emailInput.value?.focus();
    return;
  }
  const emailCheck = validateEmail(email);
  if (!emailCheck.valid) {
    showAlert(emailCheck.message, 'danger');
    emailInput.value?.focus();
    return;
  }
  if (!password) {
    showAlert('Debes definir un sigilo (contraseña) de acceso.', 'danger');
    passwordInput.value?.focus();
    return;
  }
  if (password.length < 6) {
    showAlert('El sigilo debe tener al menos 6 caracteres para ser seguro.', 'danger');
    passwordInput.value?.focus();
    return;
  }
  if (!fecha_nacimiento) {
    showAlert('La fecha de nacimiento es requerida para calcular tu carta.', 'danger');
    birthInput.value?.focus();
    return;
  }
  if (new Date(fecha_nacimiento) > new Date()) {
    showAlert('Tu fecha de nacimiento no puede ser en el futuro.', 'danger');
    birthInput.value?.focus();
    return;
  }
  if (!selectedRole.value && !registerForm.id_rol) {
    showAlert('Por favor, selecciona tu esencia (rol) antes de trascender.', 'danger');
    return;
  }

  loading.value = true;
  try {
    const res = await authService.register(nombre, email, password, fecha_nacimiento, selectedRole.value);
    
    // Si el backend devuelve los datos del usuario recién creado
    const newUser = res?.user || res?.usuario;
    const userObj = Array.isArray(newUser) ? newUser[0] : newUser;
    const userId = userObj?.id || userObj?._id;

    if (userId) {
      localStorage.setItem("user_id", userId);
      console.log("ID DE USUARIO REGISTRADO:", userId);
    }
    
    // Guardar fecha de nacimiento para pre-llenar Alineación más adelante
    localStorage.setItem("user_birth_date", fecha_nacimiento);

    notifStore.addNotification({
      title: 'BIENVENIDO AL COSMOS',
      desc: `Hola ${nombre}, tu viaje estelar en Numerix ha comenzado. ¡Explora tu destino!`,
      icon: '✨',
      type: 'success'
    });

    success.value = t('auth.alerts.success');
    switchMode("login");
    loginForm.email = email;
  } catch (e) {
    error.value = e.message || "Error en el Rito de Iniciación (Registro).";
  } finally {
    loading.value = false;
  }
}
// ─── Olvidé mi contraseña (flujo 2 pasos) ──────────────────────────
const showForgotModal = ref(false)
const forgotStep      = ref(1)        // 1 = email, 2 = código + nueva pw
const forgotEmail     = ref('')
const forgotCode      = ref('')
const forgotNewPw     = ref('')
const forgotLoading   = ref(false)
const forgotMsg       = ref({ text: '', type: '' })

function openForgotModal() {
  forgotEmail.value = loginForm.email || ''
  forgotCode.value  = ''
  forgotNewPw.value = ''
  forgotStep.value  = 1
  forgotMsg.value   = { text: '', type: '' }
  showForgotModal.value = true
}

// PASO 1: solicitar código al backend
async function requestResetCode() {
  forgotMsg.value = { text: '', type: '' }
  const emailVal = forgotEmail.value.trim()
  const emailCheck = validateEmail(emailVal)
  if (!emailCheck.valid) {
    forgotMsg.value = { text: emailCheck.message, type: 'error' }
    return
  }
  forgotLoading.value = true
  try {
    await passwordService.requestReset(emailVal)
    forgotMsg.value = { text: '✅ Código enviado a tu correo. Revisa tu bandeja de entrada.', type: 'success' }
    setTimeout(() => { forgotStep.value = 2; forgotMsg.value = { text: '', type: '' } }, 2000)
  } catch (err) {
    forgotMsg.value = { text: err.message || 'No se pudo enviar el código. Intenta de nuevo.', type: 'error' }
  } finally {
    forgotLoading.value = false
  }
}

// PASO 2: restablecer contraseña con el código recibido
async function confirmReset() {
  forgotMsg.value = { text: '', type: '' }
  if (!forgotCode.value || forgotCode.value.length < 4) {
    forgotMsg.value = { text: 'Ingresa el código recibido en tu correo.', type: 'error' }
    return
  }
  if (!forgotNewPw.value || forgotNewPw.value.length < 6) {
    forgotMsg.value = { text: 'La nueva contraseña debe tener al menos 6 caracteres.', type: 'error' }
    return
  }
  forgotLoading.value = true
  try {
    await passwordService.resetPassword(forgotEmail.value.trim(), forgotCode.value, forgotNewPw.value)
    forgotMsg.value = { text: '✅ Contraseña actualizada. Ya puedes iniciar sesión.', type: 'success' }
    setTimeout(() => { showForgotModal.value = false }, 3000)
  } catch (err) {
    forgotMsg.value = { text: err.message || 'Código inválido o expirado.', type: 'error' }
  } finally {
    forgotLoading.value = false
  }
}

// ─── Login con Google ────────────────────────────────────────
function handleGoogleLogin() {
  const baseUrl = import.meta.env.VITE_API_URL || ''
  // Redirige al endpoint OAuth de Google en el backend
  window.location.href = `${baseUrl}/api/auth/google`
}

// ─── Login con Éter (anónimo) ────────────────────────────────
const etherLoading = ref(false)

async function handleEtherLogin() {
  etherLoading.value = true
  error.value = ''
  try {
    // Usando el nuevo api (axios) para consistencia
    const res = await api.post('/usuarios/ether-login', {})
    auth.setAuth(res)
    router.push('/alineacion')
  } catch (err) {
    error.value = err.response?.data?.msg || err.message || 'Login Éter no disponible. Intenta con email y contraseña.'
  } finally {
    etherLoading.value = false
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
              ref="emailInput"
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
              ref="passwordInput"
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
          <button type="button" class="forgot-link" @click="openForgotModal">
            {{ t('auth.options.forgot') }}
          </button>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          <div v-if="loading" class="lds-hourglass"></div>
          <span v-else>{{ t('auth.buttons.login') }}</span>
        </button>

        <div class="divider">
          <span>{{ t('auth.options.others') }}</span>
        </div>

        <div class="social-login">
          <button type="button" class="btn-social" @click="handleGoogleLogin">
            <span class="social-icon">G</span> {{ t('auth.options.oracle') }}
          </button>
          <button type="button" class="btn-social ether-btn" @click="handleEtherLogin" :disabled="etherLoading">
            <span class="social-icon">☁</span>
            <span v-if="etherLoading">Conectando...</span>
            <span v-else>{{ t('auth.options.ether') }}</span>
          </button>
        </div>
      </form>

      <!-- REGISTER FORM -->
      <form v-else @submit.prevent="handleRegister" class="form">
        <div class="field">
          <label>{{ t('auth.fields.nameLabel') }}</label>
          <input
            ref="nameInput"
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
          <input ref="birthInput" v-model="registerForm.fecha_nacimiento" type="date" :max="today" />
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

      <!-- MODAL: Olvidé mi contraseña (2 pasos) -->
      <Transition name="modal-fade">
        <div v-if="showForgotModal" class="forgot-overlay" @click.self="showForgotModal = false">
          <div class="forgot-modal">
            <button class="modal-close" @click="showForgotModal = false">✕</button>
            <div class="modal-icon">🔑</div>
            <h3>Restablecer Contraseña</h3>

            <!-- Indicador de pasos -->
            <div class="forgot-steps">
              <span :class="['step-dot', { active: forgotStep === 1, done: forgotStep > 1 }]">1</span>
              <div class="step-line"></div>
              <span :class="['step-dot', { active: forgotStep === 2 }]">2</span>
            </div>

            <div v-if="forgotMsg.text" :class="['forgot-msg', forgotMsg.type]">{{ forgotMsg.text }}</div>

            <!-- PASO 1: Email -->
            <template v-if="forgotStep === 1">
              <p class="modal-desc">Ingresa tu correo y te enviaremos un código de verificación.</p>
              <div class="field">
                <label>CORREO ELECTRÓNICO</label>
                <input
                  v-model="forgotEmail"
                  type="email"
                  placeholder="tu@correo.com"
                  class="forgot-input"
                  @keyup.enter="requestResetCode"
                  autocomplete="email"
                />
              </div>
              <button class="btn-forgot-submit" @click="requestResetCode" :disabled="forgotLoading">
                <span v-if="forgotLoading">⏳ Enviando...</span>
                <span v-else>📨 ENVIAR CÓDIGO</span>
              </button>
            </template>

            <!-- PASO 2: Código + Nueva contraseña -->
            <template v-else>
              <p class="modal-desc">Ingresa el código recibido en <strong>{{ forgotEmail }}</strong> y tu nueva contraseña.</p>
              <div class="field">
                <label>CÓDIGO DE VERIFICACIÓN</label>
                <input
                  v-model="forgotCode"
                  type="text"
                  placeholder="Código recibido por correo"
                  class="forgot-input codigo-reset"
                  maxlength="10"
                  @keyup.enter="confirmReset"
                />
              </div>
              <div class="field" style="margin-top:1rem">
                <label>NUEVA CONTRASEÑA</label>
                <input
                  v-model="forgotNewPw"
                  type="password"
                  placeholder="Mín. 6 caracteres"
                  class="forgot-input"
                  @keyup.enter="confirmReset"
                  autocomplete="new-password"
                />
              </div>
              <div class="forgot-step2-actions">
                <button class="btn-back-step" @click="forgotStep = 1">← Volver</button>
                <button class="btn-forgot-submit" @click="confirmReset" :disabled="forgotLoading">
                  <span v-if="forgotLoading">⏳ Verificando...</span>
                  <span v-else>🔐 RESTABLECER</span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </Transition>

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
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    circle at center,
    #24243e 0%,
    #1b1641 50%,
    #0f0c29 100%
  );
  padding: 0.5rem;
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
  padding: 1rem 1.5rem;
  width: 100%;
  max-width: 550px;
  position: relative;
  z-index: 10;
  animation: slideUp 0.6s ease-out;
}

.back-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  padding: 0.3rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  transition: all 0.3s;
  z-index: 20;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #c9a96e;
  border-color: rgba(201, 169, 110, 0.3);
}

.auth-header {
  text-align: center;
  margin-bottom: 0.5rem;
}

.logo-icon {
  font-size: 1.8rem;
  color: #c9a96e;
  margin-bottom: 0.2rem;
  animation: pulse 3s infinite;
}

.brand {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 2px;
  margin: 0;
}

.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2px;
  margin-bottom: 0.5rem;
}

.tab {
  flex: 1;
  padding: 0.4rem;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.4);
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  font-size: 0.85rem;
}

.tab.active {
  background: #c9a96e;
  color: #0f0c29;
}

.field {
  margin-bottom: 0.4rem;
}

.field label {
  display: block;
  color: #c9a96e;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 0.2rem;
}

.input-wrapper {
  position: relative;
}

.field input,
.stellar-select {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #fff;
  font-size: 0.9rem;
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
  opacity: 0.9;
  color: #c9a96e;
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
  padding: 0.5rem;
  background: linear-gradient(135deg, #c9a96e 0%, #a07840 100%);
  border: none;
  border-radius: 8px;
  color: #0f0c29;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.4rem;
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
  margin-top: -0.2rem;
  margin-bottom: 1rem;
  font-size: 0.65rem;
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
  margin: 0.5rem 0;
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
  gap: 0.5rem;
}

.btn-social {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.4rem;
  color: #fff;
  font-size: 0.6rem;
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
  margin-top: 0.5rem;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.65rem;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
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
  font-size: 0.55rem;
  letter-spacing: 2px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: inline-block;
  padding: 0.5rem 1.5rem;
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

/* ─── Botón Olvid\u00e9 mi contraseña ──────────────────────────── */
.forgot-link {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-family: 'Outfit', sans-serif;
  transition: color 0.2s;
}
.forgot-link:hover { color: #a855f7; }

/* ─── Botón \u00c9ter ───────────────────────────────────────────── */
.ether-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* ─── Modal overlay ──────────────────────────────────────── */
.forgot-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.forgot-modal {
  background: linear-gradient(135deg, rgba(15,12,41,0.98), rgba(30,20,70,0.98));
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 24px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  position: relative;
  box-shadow: 0 0 60px rgba(168, 85, 247, 0.15);
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1.2rem;
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover { color: #fff; }

.modal-icon {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.forgot-modal h3 {
  text-align: center;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
}

.modal-desc {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.forgot-input {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 0.9rem 1rem;
  color: #fff;
  font-size: 0.95rem;
  font-family: 'Outfit', sans-serif;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.3s;
  margin-top: 0.5rem;
}
.forgot-input:focus { border-color: #a855f7; box-shadow: 0 0 12px rgba(168,85,247,0.2); }
.forgot-input::placeholder { color: rgba(255,255,255,0.3); }

.btn-forgot-submit {
  width: 100%;
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border: none;
  padding: 1rem;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 20px rgba(99,102,241,0.3);
}
.btn-forgot-submit:hover:not(:disabled) { transform: translateY(-2px); }
.btn-forgot-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.forgot-msg {
  font-size: 0.83rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.forgot-msg.success {
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.3);
  color: #4ade80;
}
.forgot-msg.error {
  background: rgba(255,50,50,0.1);
  border: 1px solid rgba(255,50,50,0.3);
  color: #ff6b6b;
}

/* Transici\u00f3n del modal */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* Indicador de pasos del modal */
.forgot-steps { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin: 1rem 0 1.5rem; }
.step-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; border: 2px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.35); transition: all 0.3s; }
.step-dot.active { background: linear-gradient(135deg, #6366f1, #a855f7); border-color: #a855f7; color: #fff; box-shadow: 0 0 12px rgba(168,85,247,0.4); }
.step-dot.done { background: rgba(34,197,94,0.2); border-color: #4ade80; color: #4ade80; }
.step-line { flex: 1; max-width: 60px; height: 1px; background: rgba(255,255,255,0.1); }
.forgot-step2-actions { display: flex; gap: 0.8rem; margin-top: 1.5rem; }
.btn-back-step { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.9rem 1.2rem; border-radius: 12px; color: rgba(255,255,255,0.6); font-size: 0.85rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; font-family: 'Outfit', sans-serif; }
.btn-back-step:hover { background: rgba(255,255,255,0.1); color: #fff; }
.forgot-step2-actions .btn-forgot-submit { margin-top: 0; flex: 1; }
.codigo-reset { letter-spacing: 4px; text-align: center; font-size: 1rem; font-weight: 600; }
</style>
