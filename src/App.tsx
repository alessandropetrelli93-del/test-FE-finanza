
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Lists from './pages/Lists'
import Instrument from './pages/Instrument'

export default function App(){
 const loc = useLocation()
 return (<>
  <div className='corp-header'>
    <div className='corp-top'>
      <div className='corp-logo'>SPARKASSE</div>
      <div style={{opacity:.8,fontSize:12}}>Cassa di Risparmio</div>
    </div>
    <div className='corp-menu'>
      <span>Home</span><span>Clienti</span><span className='active'>Applicazioni</span><span>Normativa</span>
    </div>
  </div>
  <main>
    <div className='subnav'>
      <div><strong>ISIN Viewer</strong><div className='muted'>Consultazione informativa strumenti</div></div>
      <div style={{display:'flex',gap:8}}>
        <Link className={loc.pathname==='/'?'tab active':'tab'} to='/'>Ricerca</Link>
        <Link className={loc.pathname==='/lists'?'tab active':'tab'} to='/lists'>Liste</Link>
      </div>
    </div>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/lists' element={<Lists/>}/>
      <Route path='/instrument/:isin' element={<Instrument/>}/>
    </Routes>
  </main>
 </>) }
