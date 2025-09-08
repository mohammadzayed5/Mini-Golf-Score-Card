import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //Any request starting with /api from React dev server will be forwarded (proxied) to Flask at port 5000
      '/api': {
        target: 'http://127.0.0.1:5001', //Flask Address
        changeOrigin: true,
      },
    },
  },
})
