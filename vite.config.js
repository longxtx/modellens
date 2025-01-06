import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 80,
  },
  plugins: [vue()]
})
