/**
 * API Service — Numerix
 * Todos los endpoints del backend tal como están documentados en Swagger.
 * Base: https://pj01pdf1-3005.use2.devtunnels.ms/api
 */

import { http as httpClient } from "../plugins/http.js";

// ─────────────────────────────────────────────────────────
// USUARIOS — /usuarios
// ─────────────────────────────────────────────────────────
export const authService = {
  /**
   * Iniciar sesión
   * POST /usuarios/login
   */
  login(email, password) {
    return httpClient.post("/usuarios/login", { email, password });
  },

  /**
   * Registrar nuevo usuario
   * POST /usuarios/register
   */
  register(nombre, email, password, fecha_nacimiento, id_rol) {
    // Enviamos campos duplicados para asegurar compatibilidad con el backend
    const payload = {
      nombre,
      name: nombre, // Alias
      email,
      password,
      fecha_nacimiento,
      id_rol,
      role: id_rol, // Alias
    };
    console.log("🚀 INTENTANDO REGISTRO CON PAYLOAD:", payload);
    return httpClient.post("/usuarios/register", payload);
  },
};

export const usuariosService = {
  /**
   * Obtener lista de todos los usuarios
   * GET /usuarios
   */
  getAll() {
    return httpClient.get("/usuarios", true);
  },

  /**
   * Obtener usuario por ID
   * GET /usuarios/:id
   */
  getById(id) {
    return httpClient.get(`/usuarios/${id}`, true);
  },

  /**
   * Actualizar datos de un usuario
   * PUT /usuarios/:id
   */
  update(id, data) {
    return httpClient.put(`/usuarios/${id}`, data, true);
  },

  /**
   * Eliminar usuario
   * DELETE /usuarios/:id
   */
  deleteUser(id) {
    return httpClient.delete(`/usuarios/${id}`, true);
  },

  /**
   * Cambiar estado del usuario
   * PUT /usuarios/estado/:id
   */
  changeStatus(id, estado) {
    return httpClient.put(`/usuarios/estado/${id}`, { estado }, true);
  },
};

// ─────────────────────────────────────────────────────────
// RECUPERACIÓN DE CONTRASEÑA — /usuarios
// ─────────────────────────────────────────────────────────
export const passwordService = {
  /**
   * Solicitar código de recuperación
   * POST /usuarios/request-reset-password
   */
  requestReset(email) {
    return httpClient.post("/usuarios/request-reset-password", { email });
  },

  /**
   * Restablecer contraseña con código
   * POST /usuarios/reset-password
   */
  resetPassword(email, code, newPassword) {
    return httpClient.post("/usuarios/reset-password", {
      email,
      code,
      newPassword,
    });
  },
};

// ─────────────────────────────────────────────────────────
// LECTURAS — /producto
// ─────────────────────────────────────────────────────────
export const lecturasService = {
  /**
   * Obtener todas las lecturas de un usuario
   * GET /producto/:id
   */
  getAllByUser(userId) {
    return httpClient.get(`/producto/${userId}`, true);
  },

  /**
   * Obtener una lectura específica
   * GET /producto/:id/:lectureId
   */
  getById(userId, lectureId) {
    return httpClient.get(`/producto/${userId}/${lectureId}`, true);
  },

  /**
   * Generar lectura principal (Gratis)
   * POST /producto/main-lecture/:id
   */
  generateMain(userId, nombre, fecha_nacimiento) {
    return httpClient.post(
      `/producto/main-lecture/${userId}`,
      { nombre, fecha_nacimiento },
      true
    );
  },

  /**
   * Generar lectura diaria (Premium)
   * POST /producto/lecture/:id
   */
  generateDaily(userId, nombre, fecha_nacimiento, estado = "activo") {
    return httpClient.post(
      `/producto/lecture/${userId}`,
      { nombre, fecha_nacimiento, estado },
      true
    );
  },
};

// ─────────────────────────────────────────────────────────
// PAGOS — /pagos
// ─────────────────────────────────────────────────────────
export const pagosService = {
  /**
   * Registrar un nuevo pago
   * POST /pagos/:id
   */
  register(userId, paymentData) {
    return httpClient.post(`/pagos/${userId}`, paymentData, true);
  },

  /**
   * Obtener historial de pagos
   * GET /pagos/:id
   */
  getByUser(userId) {
    return httpClient.get(`/pagos/${userId}`, true);
  },

  /**
   * Obtener todos los pagos (Admin)
   * GET /pagos
   */
  getAll() {
    return httpClient.get("/pagos", true);
  },

  /**
   * Consultar estado de membresía
   * GET /pagos/estado/:id
   */
  getMembershipStatus(userId) {
    return httpClient.get(`/pagos/estado/${userId}`, true);
  },

  /**
   * Eliminar un pago (Admin)
   * DELETE /pagos/:id/:pay
   */
  deletePayment(userId, payId) {
    return httpClient.delete(`/pagos/${userId}/${payId}`, true);
  },
};

// ─────────────────────────────────────────────────────────
// MERCADO PAGO — /mercadopago
// ─────────────────────────────────────────────────────────
export const mercadoPagoService = {
  /**
   * Crear preferencia de pago para el Checkout Pro (Mercado Pago)
   * POST /mercadopago/create-preference
   * Body: { id_usuario, id_plan, title, quantity, price }
   */
  async crearPreferenciaPago(paymentData) {
    const { id_usuario, id_plan } = paymentData;

    console.log("🚀 DATA ENVIADA A MP (MONGO STYLE):", paymentData);

    // Validación de ObjectID (24 caracteres)
    if (!id_usuario || id_usuario.length !== 24) {
      console.error("❌ ERROR: ID usuario inválido:", id_usuario);
      throw new Error("ID de usuario no válido para MongoDB/Mercado Pago");
    }

    if (!id_plan) {
      console.error("❌ ERROR: ID plan faltante");
      throw new Error("El nombre del plan (lunar, planetario, supernova) es requerido.");
    }

    const res = await httpClient.post("/mercadopago/create-preference", paymentData, true); 
    return res; 
  },

  /**
   * Verificar estado del pago y activar usuario
   * GET /mercadopago/verify-payment/:payment_id
   */
  async verificarPago(paymentId) {
    console.log("🔍 VERIFICANDO TRANSACCIÓN:", paymentId);
    return await httpClient.get(`/mercadopago/verify-payment/${paymentId}`, true);
  },
};

// ─────────────────────────────────────────────────────────
// NOTIFICACIONES — /usuarios/notify
// ─────────────────────────────────────────────────────────
export const notificationsService = {
  /**
   * Enviar éxito de suscripción
   */
  sendSubscriptionSuccess(email, planName) {
    return httpClient.post("/usuarios/notify/subscription-success", { 
      email, 
      planName 
    });
  },

  /**
   * Enviar recordatorio de vencimiento
   */
  sendExpirationReminder(email, planName, daysRemaining) {
    return httpClient.post("/usuarios/notify/expiration-reminder", { 
      email, 
      planName, 
      daysRemaining 
    });
  },
};
