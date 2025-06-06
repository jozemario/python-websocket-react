// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  dev: {
    hmr: false,
    liveReload: false,
  },
  server: {
    port: 2000,
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      config.output.publicPath = 'auto'
      appendPlugins([
        new ModuleFederationPlugin({
          name: 'federation_consumer',
          remotes: {
            federation_provider: isProd
              ? 'federation_provider@/federation_provider/mf-manifest.json'
              : 'federation_provider@http://localhost:3000/mf-manifest.json',
            ui_provider: isProd
              ? 'ui_provider@/ui_provider/mf-manifest.json'
              : 'ui_provider@http://localhost:3001/mf-manifest.json',
          },
          shared: [
            'react',
            'react-dom',
            '@reduxjs/toolkit',
            'react-redux',
            'redux',
          ],
        }),
      ])
    },
  },
  plugins: [pluginReact()],
})
