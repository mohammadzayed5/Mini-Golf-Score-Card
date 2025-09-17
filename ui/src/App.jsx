//Let me map URL paths to REACT
import { Routes, Route } from 'react-router-dom'
import TabLayout from './layouts/TabLayout.jsx'
//Different Pages
import Home from './pages/Home.jsx'
import Play from './pages/Play.jsx'
import Players from './pages/Players.jsx'
import History from './pages/History.jsx'
import Courses from './pages/Courses.jsx'
import PlayerSelect from './pages/playerSelect.jsx'
import Results from './pages/Results.jsx'

export default function App() {
  return (
    <Routes>
        {/*All routes inside TabLayout will show the bottom Navigation Bar */}
      <Route element={<TabLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/history" element={<History />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/playerSelect" element={<PlayerSelect />} />
      </Route>
      {/*Play is outside layout so the navigation bar doesn't overlay scoreboard.
        If I move this above inside of TabLayout then the bar will be visible on Play too */}
      <Route path="/play/:id" element={<Play />} />
      <Route path="/results/:id" element={<Results />} />
    </Routes>
  );
}
