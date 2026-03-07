import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Instrument from './pages/Instrument'
import Lists from './pages/Lists'
import { useBackendHealth } from './services/api'

export default function App() {
  const loc = useLocation()
  const health = useBackendHealth()

  return (
    <>
      <header>
        <div className="row">
          <div className="row" style={{ flex: '0 0 auto' }}>
            <h1>ISIN Viewer</h1>
            <span className={health.ok ? 'tag ok' : 'tag warn'}>
              {health.ok ? 'Backend OK' : 'Mock/Offline'}
            </span>
          </div>
          <div className="row" style={{ flex: '0 0 auto' }}>
            <Link className="pill" to="/">Home</Link>
            <Link className="pill" to="/lists">Liste</Link>
            <span className="pill">{loc.pathname}</span>
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instrument/:isin" element={<Instrument />} />
          <Route path="/lists" element={<Lists />} />
        </Routes>
      </main>
    </>
  )
}
