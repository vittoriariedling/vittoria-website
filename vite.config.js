import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In Docker this points at the api service; running `npm run dev` directly on
// your machine falls back to localhost.
const API = process.env.API_PROXY_TARGET || 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: process.env.VITE_USE_POLLING ? { usePolling: true, interval: 300 } : undefined,
    proxy: {
      '/api': API,
    },
  },
})
