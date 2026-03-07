import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// DEV proxy per evitare CORS quando backend gira su :8787
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
      '/health': 'http://localhost:8787'
    }
  }
})
