import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Em dev, /api é redirecionado para o Django (evita problemas de CORS).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": process.env.GATEWAY_URL || "http://localhost:8000" },
  },
});
