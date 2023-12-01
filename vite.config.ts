import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
import Windicss from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    Windicss(),
  ],
  resolve: {
    alias: [
      {find: '@', replacement: resolve(__dirname, 'src')}
    ]
  },
  build: {
    manifest: true,
    sourcemap: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7001/',
        changeOrigin: true,
      }
    }
  }
})
