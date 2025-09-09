import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  //This wil bind to 0.0.0.0 so dev server can be opened on phone
    port: 5173,
    proxy: {
      //Any request starting with /api from React dev server will be forwarded (proxied) to Flask at port 5000
      '/api': {
        target: 'http://127.0.0.1:5001', //Flask Address
        changeOrigin: true,
      },
    },
  },
})
