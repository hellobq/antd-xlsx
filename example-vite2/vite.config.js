import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import bundleAnalyzer from "rollup-plugin-bundle-analyzer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // bundleAnalyzer(),
    react()
  ],
  server: {
    host: true
  }
})
