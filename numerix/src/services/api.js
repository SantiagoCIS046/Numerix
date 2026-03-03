/**
 * API Service — Numerix
 * Todos los endpoints del backend organizados por módulo.
 * Usa httpClient como capa de transporte.
 */

import { httpClient } from "../plugins/axios.js";

// ─────────────────────────────────────────
// AUTH — /api/usuarios
// ─────────────────────────────────────────
export const authService = {
  /**
   * Iniciar sesión
   * POST /api/usuarios/login
   */
  login(email, password) {
    return httpClient.post("/usuarios/login", { email, password });
  },

  /**
   * Registrar nuevo usuario
   * POST /api/usuarios/register
   */
  register(nombre, email, password, fecha_nacimiento) {
    return httpClient.post("/usuarios/register", {
      nombre,
      email,
      password,
      fecha_nacimiento,
    });
  },
};

// ─────────────────────────────────────────
// LECTURAS — /api/lecturas
// ─────────────────────────────────────────
export const lecturasService = {
  /**
   * Obtener todas las lecturas
   * GET /api/lecturas
   */
  getAll() {
    return httpClient.get("/lecturas", true);
  },

  /**
   * Obtener lectura por ID
   * GET /api/lecturas/:id
   */
  getById(id) {
    return httpClient.get(`/lecturas/${id}`, true);
  },
};

