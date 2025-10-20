//Let me map URL paths to REACT
import { Routes, Route } from 'react-router-dom'
import {lazy, Suspense} from 'react' //This is adding lazy and suspense, so that files will only load while needed
import TabLayout from './layouts/TabLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
//Different Pages
const Home = lazy(() => import('./pages/Home.jsx'))
const Play = lazy(() => import('./pages/Play.jsx'))
const Players = lazy(() => import('./pages/Players.jsx'))
const History = lazy(() => import('./pages/History.jsx'))
const Courses = lazy(() => import('./pages/Courses.jsx'))
const PlayerSelect = lazy(() => import('./pages/playerSelect.jsx'))
const Results = lazy(() => import('./pages/Results.jsx'))

export default function App() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-deep)',
        color: 'var(--mint)',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(124, 247, 193, 0.2)',
          borderTop: '3px solid var(--mint)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{ fontWeight: '700', fontSize: '16px' }}>Loading...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <Routes>
            {/*All routes inside TabLayout will show the bottom Navigation Bar */}
          <Route element={<TabLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={
              <ProtectedRoute redirectTo="/players">
                <Players />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute redirectTo="/history">
                <History />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={<Courses />} />
            <Route path="/playerSelect" element={<PlayerSelect />} />
          </Route>
          {/*Play is outside layout so the navigation bar doesn't overlay scoreboard.
            If I move this above inside of TabLayout then the bar will be visible on Play too */}
          <Route path="/play/:id" element={<Play />} />
          <Route path="/results/:id" element={<Results />} />
        </Routes>
      </Suspense>
  );
}
