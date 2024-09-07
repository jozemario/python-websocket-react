// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack'

// @ts-ignore
import { dependencies } from './package.json'

export default defineConfig({
  server: {
    port: 3001,
  },
  dev: {
    hmr: false,
    liveReload: false,
    // It is necessary to configure assetPrefix, and in the production environment, you need to configure output.assetPrefix
    assetPrefix: 'http://localhost:3001',
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      // You need to set a unique value that is not equal to other applications
      config.output.publicPath = 'auto'
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'ui_provider',
          exposes: {
            './layout': './src/components/Layout.tsx',
            './example': './src/components/Example.tsx',
            './shell': './src/components/ShellBasic.tsx',
            // './store': './src/redux/store.ts',
            // './content': './src/components/Content.tsx',
          },
          remotes: {
            federation_provider:
              'federation_provider@http://localhost:3000/mf-manifest.json',
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
