import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ── Build optimisation for Vercel ──────────────────────────────────────
  build: {
    // Vercel free tier has a 50 MB function limit; keep chunks small
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual code-splitting: vendor libs in separate chunks
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom'],
          // ECharts is large (~750 kB) — isolate it
          'vendor-echarts': ['echarts', 'echarts-for-react'],
          // Lucide icons
          'vendor-lucide': ['lucide-react'],
          // Google Generative AI SDK
          'vendor-genai': ['@google/generative-ai'],
        },
      },
    },
  },

  // ── Test configuration (Vitest) ─────────────────────────────────────────
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
  },
})
