import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/todos': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/summarize': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
