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
    base = '/antx-xlsx/'
    outDir = 'dist-pages'
  }

  return {
    base,
    plugins: [
      // bundleAnalyzer(),
      react()
    ],
    build: {
      outDir
    },
    server: {
      host: true
    }
  }
})
