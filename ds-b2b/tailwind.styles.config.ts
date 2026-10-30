import type { Config } from 'tailwindcss'
import base from './tailwind.config'

// Builds dist/styles.css: resolves the @apply rules in src/styles/package.css into plain CSS.
// No utilities or preflight are emitted; consumers generate utilities with their own Tailwind.
const config: Config = {
  ...base,
  content: [{ raw: '' }],
  corePlugins: { preflight: false },
  plugins: []
}

export default config
