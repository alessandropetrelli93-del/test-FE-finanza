import { Routes, Route, useLocation, Link } from 'react-router-dom'
import Home from './pages/Home'
import Instrument from './pages/Instrument'
import Lists from './pages/Lists'
import { useBackendHealth } from './services/api'

export default function App() {
  const loc = useLocation()
  const health = useBackendHealth()

  return (
    <div className="shell">
      {/* Barra top rossa (stile SharePoint/woody) */}
      <header className="topbar">
        <div className="topbar-left">
          <img className="logo" src="/assets/sparkasse-logo.svg" alt="Sparkasse" />
          <div className="divider" />
          <img className="sp" src="/assets/sharepoint.svg" alt="SharePoint" />
        </div>
        <div className="topbar-right">
          <span className="top-pill">IT</span>
          <span className="top-pill">?</span>
          <span className="top-pill">⚙</span>
          <span className={health.ok ? 'status ok' : 'status warn'}>
            {health.ok ? 'Online' : 'Demo'}
          </span>
        </div>
      </header>

      {/* Barra menu chiara */}
      <div className="menubar">
        <div className="menubar-left">
          <span className="brand">Woody</span>
        </div>
        <nav className="menubar-nav">
          <span className="navitem">Gruppo Sparkasse</span>
          <span className="navitem">Corporate</span>
          <span className="navitem">Comunicazione</span>
          <span className="navitem">HR</span>
          <span className="navitem active">Applicazioni e Manuali</span>
          <span className="navitem">News</span>
          <span className="navitem">Sostenibilità</span>
        </nav>
        <div className="menubar-right">
          <span className="user">AP</span>
        </div>
      </div>

      <div className="body">
        {/* rail sinistra */}
        <aside className="rail">
          <div className={loc.pathname === '/' ? 'railbtn active' : 'railbtn'} title="Ricerca">⌕</div>
          <div className={loc.pathname.startsWith('/lists') ? 'railbtn active' : 'railbtn'} title="Liste">☰</div>
          <div className={loc.pathname.startsWith('/instrument') ? 'railbtn active' : 'railbtn'} title="Strumento">📈</div>
        </aside>

        <div className="content">
          {/* breadcrumb + titolo pagina, come nello screen */}
          <div className="crumb">
            <span className="crumb-item">Home</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-item">Applicazioni e Manuali</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-item active">ISIN Viewer</span>
          </div>

          <div className="pagehead">
            <div>
              <h1>ISIN Viewer</h1>
              <div className="subtitle">Consultazione informativa strumenti</div>
            </div>
            <div className="page-actions">
              <Link className={loc.pathname === '/' ? 'ptab active' : 'ptab'} to="/">Ricerca</Link>
              <Link className={loc.pathname === '/lists' ? 'ptab active' : 'ptab'} to="/lists">Liste</Link>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/instrument/:isin" element={<Instrument />} />
            <Route path="/lists" element={<Lists />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
