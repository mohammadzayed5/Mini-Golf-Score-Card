//Let me map URL paths to REACT
import { Routes, Route } from 'react-router-dom'
import {lazy, Suspense} from 'react' //This is adding lazy and suspense, so that files will only load while needed
import TabLayout from './layouts/TabLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AdMobProvider } from './contexts/AdMobContext.jsx'
//Different Pages
const Home = lazy(() => import('./pages/Home.jsx'))
const Play = lazy(() => import('./pages/Play.jsx'))
const Players = lazy(() => import('./pages/Players.jsx'))
const History = lazy(() => import('./pages/History.jsx'))
const Courses = lazy(() => import('./pages/Courses.jsx'))
const PlayerSelect = lazy(() => import('./pages/playerSelect.jsx'))
const Results = lazy(() => import('./pages/Results.jsx'))
// Content Pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.jsx'))
const TermsOfService = lazy(() => import('./pages/TermsOfService.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Help = lazy(() => import('./pages/Help.jsx'))

export default function App() {
  return (
    <AdMobProvider>
      <Suspense fallback ={<div>Loading ... </div>}>
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
              {/* Content Pages */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
            </Route>
            {/*Play is outside layout so the navigation bar doesn't overlay scoreboard.
              If I move this above inside of TabLayout then the bar will be visible on Play too */}
            <Route path="/play/:id" element={<Play />} />
            <Route path="/results/:id" element={<Results />} />
          </Routes>
        </Suspense>
    </AdMobProvider>
  );
}
