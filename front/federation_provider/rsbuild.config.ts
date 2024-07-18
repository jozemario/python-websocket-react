// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack'

export default defineConfig({
  server: {
    port: 3000,
  },
  dev: {
    // It is necessary to configure assetPrefix, and in the production environment, you need to configure output.assetPrefix
    assetPrefix: 'http://localhost:3000',
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      // You need to set a unique value that is not equal to other applications
      config.output!.uniqueName = 'federation_provider'
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'federation_provider',
          exposes: {
            './button': './src/button.tsx',
            './store': './src/redux/store.ts',
            './content': './src/components/Content.tsx',
          },
          shared: {
            react: { singleton: true, eager: true },
            'react-dom': { singleton: true, eager: true },
            '@reduxjs/toolkit': { singleton: true, eager: true },
            'react-redux': { singleton: true, eager: true },
            redux: { singleton: true, eager: true },
            'react-router-dom': { singleton: true, eager: true },
          },
        }),
      ])
    },
  },
  plugins: [pluginReact()],
})
