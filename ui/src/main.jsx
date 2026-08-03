import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
//This gives app client-side routing (No need to full page reload)
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'

// Router basename:
// - iOS (Capacitor): served from capacitor://localhost/ → no basename
// - Web prod (Netlify): mounted at /web via VITE_ROUTER_BASENAME
// - Local dev: no env var → served from root
const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();
const basename = isCapacitor ? '/' : (import.meta.env.VITE_ROUTER_BASENAME || '/');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

