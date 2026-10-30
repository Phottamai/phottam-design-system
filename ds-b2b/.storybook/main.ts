import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'

const require = createRequire(import.meta.url)

// Resolve from this package so Storybook works however npm hoists workspace dependencies.
const getAbsolutePath = (name: string): string => dirname(require.resolve(`${name}/package.json`))

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-a11y')
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {
      builder: { viteConfigPath: '.storybook/vite.config.ts' }
    }
  }
}

export default config
