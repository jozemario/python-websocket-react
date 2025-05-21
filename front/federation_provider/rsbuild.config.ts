// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack'

// @ts-ignore
import { dependencies } from './package.json'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  server: {
    port: 3000,
  },
  dev: {
    hmr: false,
    liveReload: false,
    // It is necessary to configure assetPrefix, and in the production environment, you need to configure output.assetPrefix
    assetPrefix: 'http://localhost:3000',
  },
  output: {
    // It is necessary to configure assetPrefix, and in the production environment, you need to configure output.assetPrefix
    assetPrefix: isProd ? '/federation_provider' : 'http://localhost:3000',
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      // You need to set a unique value that is not equal to other applications
      config.output.publicPath = 'auto'
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'federation_provider',
          exposes: {
            './button': './src/button.tsx',
            './store': './src/redux/store.ts',
            './content': './src/components/Content.tsx',
          },
          shared: {
            react: {
              singleton: true,
              eager: true,
              requiredVersion: dependencies['react'],
            },
            'react-dom': {
              singleton: true,
              eager: true,
              requiredVersion: dependencies['react-dom'],
            },
            '@reduxjs/toolkit': {
              singleton: true,
              eager: true,
              requiredVersion: dependencies['@reduxjs/toolkit'],
            },
            'react-redux': {
              singleton: true,
              eager: true,
              requiredVersion: dependencies['react-redux'],
            },
            redux: {
              singleton: true,
              eager: true,
              requiredVersion: dependencies['redux'],
            },
            'react-router-dom': {
              singleton: true,
              eager: true,
              requiredVersion: dependencies['react-router-dom'],
            },
            immer: {
              singleton: true,
              eager: true,
            },
          },
        }),
      ])
    },
  },
  plugins: [pluginReact()],
})
