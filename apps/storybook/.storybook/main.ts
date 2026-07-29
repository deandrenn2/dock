import type { StorybookConfig } from '@storybook/react-vite'
import { resolve } from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) => {
    config.server ??= {}
    config.server.headers = {
      ...config.server.headers,
      'Cache-Control': 'no-store',
    }
    config.server.watch = {
      ...config.server.watch,
      usePolling: true,
      interval: 100,
    }
    config.optimizeDeps ??= {}
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude ?? []),
      '@deandre-dock/buttons',
    ]
    config.resolve ??= {}
    config.resolve.extensions = ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json']
    config.resolve.alias = {
      ...config.resolve.alias,
      '@deandre-dock/buttons': resolve(__dirname, '../../../packages/core/src/index.ts'),
    }
    return config
  },
}

export default config
