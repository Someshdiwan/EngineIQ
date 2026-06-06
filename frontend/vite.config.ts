import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})

/*
plugins: [react()]
→ Enables JSX/TSX support. Without this,
    React components won't compile.

server.port: 5173
→ Forces frontend to always run on 5173.
Without this it picks random port (5174, 5175...)

proxy: { '/api': ... }
→ ANY request starting with /api gets
  forwarded to Spring Boot on port 8080

changeOrigin: true
→ Tells the proxy to change the Host header
so Spring Boot doesn't reject the request
*/
