import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// URL del backend — se puede sobreescribir en .env con VITE_BACKEND_URL
const BACKEND_URL = process.env.VITE_BACKEND_URL || "https://pj01pdf1-3005.use2.devtunnels.ms";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        // Todas las peticiones a /api se redirigen al backend
        "/api": {
          target: BACKEND_URL,
          changeOrigin: true,   // Modifica el header Host al del target
          secure: false,        // Ignora errores de certificado SSL (DevTunnel / redes con proxy)
          // Encabezados extra para saltar la página anti-phishing del DevTunnel
          headers: {
            "X-Tunnel-Skip-Anti-Phishing-Page": "true",
            "Bypass-Tunnel-Reminder": "true",
          },
        },
      },
    },
  };
});
