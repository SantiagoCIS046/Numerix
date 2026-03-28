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
    return httpClient.post("/usuarios/register", {
      nombre,
      email,
      password,
      fecha_nacimiento,
      id_rol,
    });
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
   * Crear preferencia de pago (Checkout Pro)
   * POST /mercadopago/create-preference
   * Body: { monto, titulo }
   */
  async crearPreferenciaPago(monto, titulo) {
    console.log("🚀 INICIANDO PAGO:", { monto, titulo });
    return await httpClient.post("/mercadopago/create-preference", { monto, titulo }, true);
  },

  /**
   * Verificar estado del pago al regresar de MP
   * GET /mercadopago/verify-payment?payment_id=...
   */
  async verificarPago(paymentId) {
    return await httpClient.get(`/mercadopago/verify-payment?payment_id=${paymentId}`, true);
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
