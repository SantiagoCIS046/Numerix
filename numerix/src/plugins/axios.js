const API_BASE = import.meta.env.DEV
  ? "/api"
  : `${import.meta.env.VITE_API_URL}/api`;

/**
 * Realiza una petición HTTP al backend.
 * @param {string} endpoint  - Ruta relativa (ej: "/usuarios/login")
 * @param {string} method    - Método HTTP ("GET", "POST", "PUT", "DELETE")
 * @param {object} [body]    - Cuerpo de la petición (opcional)
 * @param {boolean} [auth]   - Si true, adjunta el token JWT del localStorage
 */
async function http(endpoint, method = "GET", body = null, auth = false) {
  const headers = {
    "Content-Type": "application/json",
    "X-Tunnel-Skip-AntiCsrf": "true",
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const fullUrl = `${API_BASE}${endpoint}`;
    console.log(`[HTTP ${method}] ${fullUrl}`, body ? body : '');

    const response = await fetch(fullUrl, config);
    console.log(`[HTTP ${response.status}] ${fullUrl}`);

    // Intentar parsear JSON
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(`Error del servidor (${response.status})`);
    }

    // Si la respuesta no es exitosa, lanzar el mensaje del backend
    if (!response.ok) {
      const message =
        data.errors || data.msg || data.message || `Error ${response.status}`;
      throw new Error(message);
    }

    return data;
  } catch (err) {
    // Error de red (servidor apagado, sin conexión, etc.)
    if (err.name === "TypeError") {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica que el backend esté activo."
      );
    }
    throw err;
  }
}

// Métodos de conveniencia
export const httpClient = {
  get: (endpoint, auth = false) => http(endpoint, "GET", null, auth),
  post: (endpoint, body, auth = false) => http(endpoint, "POST", body, auth),
  put: (endpoint, body, auth = false) => http(endpoint, "PUT", body, auth),
  delete: (endpoint, auth = false) => http(endpoint, "DELETE", null, auth),
};
