import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Instrument from './pages/Instrument'
import Lists from './pages/Lists'
import { useBackendHealth } from './services/api'

/**
 * Modalità EMBEDDED: la cornice (barra rossa + menu) è fornita dalla Intranet.
 * Qui teniamo solo una sub-navigazione leggera per Ricerca/Liste.
 */
export default function App() {
  const loc = useLocation()
  const health = useBackendHealth()

  return (
    <main>
      <div className="subnav">
        <div>
          <div className="title">ISIN Viewer</div>
          <div className="muted">Consultazione informativa strumenti</div>
        </div>
        <div className="subnav-right">
          <Link className={loc.pathname === '/' ? 'tab active' : 'tab'} to="/">Ricerca</Link>
          <Link className={loc.pathname === '/lists' ? 'tab active' : 'tab'} to="/lists">Liste</Link>
          <span className={health.ok ? 'tag ok' : 'tag warn'}>
            {health.ok ? 'Backend OK' : 'Mock/Offline'}
          </span>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/instrument/:isin" element={<Instrument />} />
        <Route path="/lists" element={<Lists />} />
      </Routes>
    </main>
  )
}
