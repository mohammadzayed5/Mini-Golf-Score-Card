//Let me map URL paths to REACT
import { Routes, Route } from 'react-router-dom'
//These next 2 will be pages that I create
import Home from './pages/Home.jsx'
import Play from './pages/Play.jsx'



export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:id" element={<Play />} />
    </Routes>
  )

}
