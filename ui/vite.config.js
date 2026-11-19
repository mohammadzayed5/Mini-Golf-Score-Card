/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Asset base path. Must be absolute: with the old relative './' the built
// index.html asked for './assets/x.js', which from a nested route such as
// /web/play/3 resolved to /web/play/assets/x.js. Netlify's SPA fallback
// answered that with index.html, so any refresh or direct link to a game or
// results page rendered blank. The router basename doubles as the base:
//   web (Netlify):  VITE_ROUTER_BASENAME=/web  -> base '/web/'
//   iOS / local:    unset                      -> base '/'
const routerBasename = (process.env.VITE_ROUTER_BASENAME || '').replace(/\/+$/, '');
const base = `${routerBasename}/`;

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          capacitor: ['@capacitor/core', '@capacitor/preferences'],
          admob: ['@capacitor-community/admob'],
          confetti: ['canvas-confetti'],
        },
      },
    },
  },
  esbuild: {
    // `drop: ['console']` strips console.error and console.warn too, which is
    // why every AdMob failure was invisible in production builds. Mark only the
    // chatty levels as side-effect-free so the minifier removes them, and let
    // errors and warnings survive into the shipped bundle.
    pure: ['console.log', 'console.debug', 'console.info'],
    drop: ['debugger'],
  },
  server: {
    host: true,
    port: 5173,
    proxy: { '/api': { target: 'http://127.0.0.1:5001', changeOrigin: true } }
  }
})
