import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import pkg from './package.json'

// Everything the package depends on stays external and is resolved by the consuming app.
const externalPackages = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.dependencies ?? {}),
  'react/jsx-runtime',
  'react/jsx-dev-runtime'
]

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.*'],
      tsconfigPath: './tsconfig.build.json'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PhottamaiDsB2B',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: (id) => externalPackages.some((name) => id === name || id.startsWith(`${name}/`)),
      output: {
        // Components use hooks and browser APIs; mark them as client components for Next.js.
        banner: '"use client";'
      }
    },
    sourcemap: true,
    // The CSS build (tailwind CLI) writes into dist after this step.
    emptyOutDir: true
  }
})
