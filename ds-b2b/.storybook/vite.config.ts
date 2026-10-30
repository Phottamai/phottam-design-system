import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Storybook gets its own Vite config; the root vite.config.ts is the library build.
export default defineConfig({
  plugins: [react()]
})
