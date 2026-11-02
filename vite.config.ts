import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import siteConfiguration from './.figma/make/site.json' with { type: 'json' }
import { figmaErrorOverlayReplay } from './config/vite/errorOverlay.ts'
import { figmaLinkedPackageSourcemaps } from './config/vite/linkedPackages.ts'
import { figmaMakeKitPlugin } from './config/vite/makeKit.ts'
import { figmaReactRefreshBoundaryFallback } from './config/vite/reactRefresh.ts'
import { figmaSiteConfiguration } from './config/vite/siteConfiguration.ts'

export default defineConfig(({ mode }) => {
  // O preview do Figma usa este modo para mostrar os arquivos originais nos erros.
  const emitSourcemaps = mode === 'development'
  const host = process.env.FIGMA_DEV_SERVER_HOST || '0.0.0.0'
  const port = Number.parseInt(process.env.PORT || '8443', 10)

  return {
    base: process.env.FIGMA_PUBLIC_URL ? `${process.env.FIGMA_PUBLIC_URL}/` : '/',
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    plugins: [
      react(),
      tailwindcss(),
      figmaSiteConfiguration(siteConfiguration),
      figmaErrorOverlayReplay(),
      figmaReactRefreshBoundaryFallback(),
      figmaMakeKitPlugin({ storiesGlob: '/src/**/*.stories.{ts,tsx,js,jsx}' }),
      figmaLinkedPackageSourcemaps(import.meta.dirname),
    ],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, 'src') },
    },
    server: {
      host,
      port,
      strictPort: true,
      watch: { ignored: ['**/.figma/**'] },
    },
    preview: { host, port },
  }
})
