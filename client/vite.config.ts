import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // Proxy /api to the backend only in development.
    // In production the built files are served by the backend (or a reverse proxy)
    // so no proxy is needed — VITE_API_URL is set at build time instead.
    proxy: mode === 'development'
      ? {
          '/api': {
            target: process.env.VITE_API_URL || 'http://127.0.0.1:5000',
            changeOrigin: true,
          },
        }
      : undefined,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
}));
