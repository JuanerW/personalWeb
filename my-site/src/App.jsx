import { HashRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './LangContext'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Game2048 from './pages/games/Game2048/Game2048'
import Snake from './pages/games/Snake/Snake'
import Notepad from './pages/tools/Notepad/Notepad'
import Calendar from './pages/tools/Calendar/Calendar'
import Calculator from './pages/tools/Calculator/Calculator'
import Spinner from './pages/tools/Spinner/Spinner'
import Wordle from './pages/games/Wordle/Wordle'
import ReactionTest from './pages/games/ReactionTest/ReactionTest'
import AmbientMixer from './pages/tools/AmbientMixer/AmbientMixer'

export default function App() {
  return (
    <LangProvider>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/2048" element={<Game2048 />} />
          <Route path="/games/snake" element={<Snake />} />
          <Route path="/games/wordle"    element={<Wordle />} />
          <Route path="/games/reaction"  element={<ReactionTest />} />
          <Route path="/tools/ambient"   element={<AmbientMixer />} />
          <Route path="/tools/notepad" element={<Notepad />} />
          <Route path="/tools/calendar" element={<Calendar />} />
          <Route path="/tools/calculator" element={<Calculator />} />
          <Route path="/tools/spinner" element={<Spinner />} />
        </Routes>
      </HashRouter>
    </LangProvider>
  )
}
