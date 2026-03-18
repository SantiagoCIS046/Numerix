/**
 * API Service — Numerix
 * Todos los endpoints del backend tal como están documentados en Swagger.
 * Base: http://localhost:3005 (en dev va por proxy /api → vite.config.js)
 */

import { httpClient } from "../plugins/http.js";

// ─────────────────────────────────────────────────────────
// USUARIOS — /api/usuarios
// ─────────────────────────────────────────────────────────
export const authService = {
  /**
   * Iniciar sesión
   * POST /api/usuarios/login
   * Body: { email, password }
   */
  login(email, password) {
    return httpClient.post("/usuarios/login", { email, password });
  },

  /**
   * Registrar nuevo usuario
   * POST /api/usuarios/register
   * Body: { nombre, email, password, fecha_nacimiento, estado? }
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
   * Obtener lista de todos los usuarios (sin auth requerida según swagger)
   * GET /api/usuarios
   */
  getAll() {
    return httpClient.get("/usuarios", true);
  },

  /**
   * Obtener usuario por ID (Solo Admin)
   * GET /api/usuarios/:id
   */
  getById(id) {
    return httpClient.get(`/usuarios/${id}`, true);
  },

  /**
   * Actualizar datos de un usuario
   * PATCH /api/usuarios/:id
   * Body: { nombre?, email?, fecha_nacimiento?, ... }
   */
  update(id, data) {
    return httpClient.put(`/usuarios/${id}`, data, true);
  },

  /**
   * Eliminar usuario
   * DELETE /api/usuarios/:id
   */
  deleteUser(id) {
    return httpClient.delete(`/usuarios/${id}`, true);
  },

  /**
   * Cambiar estado del usuario (activo/inactivo)
   * PATCH /api/usuarios/estado/:id
   */
  changeStatus(id, estado) {
    return httpClient.put(`/usuarios/estado/${id}`, { estado }, true);
  },
};

// ─────────────────────────────────────────────────────────
// RECUPERACIÓN DE CONTRASEÑA — /api/usuarios
// ─────────────────────────────────────────────────────────
export const passwordService = {
  /**
   * Solicitar código de recuperación por correo
   * POST /api/usuarios/request-reset-password
   * Body: { email }
   */
  requestReset(email) {
    return httpClient.post("/usuarios/request-reset-password", { email });
  },

  /**
   * Restablecer contraseña con el código recibido
   * POST /api/usuarios/reset-password
   * Body: { email, code, newPassword }
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
// LECTURAS — /api/producto
// ─────────────────────────────────────────────────────────
export const lecturasService = {
  /**
   * Obtener todas las lecturas de un usuario
   * GET /api/producto/:id  (id = id del usuario)
   */
  getAllByUser(userId) {
    return httpClient.get(`/producto/${userId}`, true);
  },

  /**
   * Obtener una lectura específica
   * GET /api/producto/:id/:lectureId
   */
  getById(userId, lectureId) {
    return httpClient.get(`/producto/${userId}/${lectureId}`, true);
  },

  /**
   * Generar lectura principal (Gratis)
   * POST /api/producto/main-lecture/:id
   * Body: { nombre, fecha_nacimiento }
   */
  generateMain(userId, nombre, fecha_nacimiento) {
    return httpClient.post(
      `/producto/main-lecture/${userId}`,
      { nombre, fecha_nacimiento },
      true
    );
  },

  /**
   * Generar lectura diaria (Requiere membresía activa)
   * POST /api/producto/lecture/:id
   * Body: { nombre, fecha_nacimiento, estado }
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
// PAGOS — /api/pagos
// ─────────────────────────────────────────────────────────
export const pagosService = {
  /**
   * Registrar un nuevo pago y activar membresía
   * POST /api/pagos/:id  (id = id del usuario)
   * Body: { plan, monto, metodo_pago, moneda, ... }
   */
  register(userId, paymentData) {
    return httpClient.post(`/pagos/${userId}`, paymentData, true);
  },

  /**
   * Obtener historial de pagos de un usuario
   * GET /api/pagos/:id
   */
  getByUser(userId) {
    return httpClient.get(`/pagos/${userId}`, true);
  },

  /**
   * Obtener todos los pagos (Solo Admin)
   * GET /api/pagos
   */
  getAll() {
    return httpClient.get("/pagos", true);
  },

  /**
   * Consultar estado de pago/membresía de un usuario
   * GET /api/pagos/estado/:id
   */
  getMembershipStatus(userId) {
    return httpClient.get(`/pagos/estado/${userId}`, true);
  },

  /**
   * Eliminar un pago (Solo Admin)
   * DELETE /api/pagos/:id/:pay
   */
  deletePayment(userId, payId) {
    return httpClient.delete(`/pagos/${userId}/${payId}`, true);
  },
};
