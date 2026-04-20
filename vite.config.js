import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:1882',
        changeOrigin: true,
        headers: { origin: 'http://localhost:5173' },
      },
      '/login': {
        target: 'http://localhost:1882',
        changeOrigin: true,
        headers: { origin: 'http://localhost:5173' },
      },
      '/images': {
        target: 'http://localhost:1882',
        changeOrigin: true,
        headers: { origin: 'http://localhost:5173' },
      },
    },
  },
})
