import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL || "https://mh08zj24-3005.use2.devtunnels.ms";

  return {
    plugins: [vue()],
    server: {
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: true,
          headers: {
            "X-Tunnel-Skip-AntiCsrf": "true",
          },
        },
      },
    },
  };
});
