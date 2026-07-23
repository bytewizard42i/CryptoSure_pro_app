import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(({ command }) => ({
  define: {
    // Custom Vite modes such as "demoland" and "realdeal" are still
    // production builds when the build command is running. Keying this value
    // to the command prevents React's larger development runtime from being
    // bundled into either deployable environment.
    'process.env.NODE_ENV': JSON.stringify(command === 'build' ? 'production' : 'development'),
    'process.env': {},
    global: 'globalThis',
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3014,
    fs: {
      allow: ['..'],
    },
  },
}))
