import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import bundleAnalyzer from "rollup-plugin-bundle-analyzer";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let base = '/', outDir = 'dist'
  if (
    command === 'build' &&
    mode === 'pages'
  ) {
    base = '/antd-xlsx/'
    outDir = 'dist-pages'
  }

  return {
    base,
    plugins: [
      ...(mode === 'analyze' ?[ bundleAnalyzer({})] : []),
      react()
    ],
    build: {
      outDir,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('xlsx-style-vite')) {
              return 'xlsx-style-vite'
            }
          }
        }
      }
    },
    server: {
      host: true
    }
  }
})
