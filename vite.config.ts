import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the build works on GitHub Pages, Netlify and Vercel.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
  },
})
