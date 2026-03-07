import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { api, useAsync } from '../services/api'

export default function Home() {
  const nav = useNavigate()
  const [isin, setIsin] = useState('US4592001014')
  const wl = useAsync(() => api.watchlistGet(), [])

  return (
    <div className="grid">
      <section className="card">
        <h2 style={{marginTop:0}}>Search</h2>
        <p className="muted">Inserisci un ISIN e apri la scheda strumento.</p>
        <div className="row">
          <div>
            <label>ISIN</label>
            <input value={isin} onChange={e=>setIsin(e.target.value.toUpperCase())} placeholder="Es: IT0005320129" />
          </div>
          <div style={{flex:'0 0 auto'}}>
            <label>&nbsp;</label>
            <button onClick={()=>nav(`/instrument/${encodeURIComponent(isin.trim().toUpperCase())}`)}>Cerca</button>
          </div>
        </div>
        <div className="note" style={{marginTop:12}}>
          MVP consulente singolo: watchlist personale + scheda strumento + grafico.
        </div>
      </section>

      <aside className="card">
        <h2 style={{marginTop:0}}>★ Your watchlist</h2>
        {wl.loading && <p className="muted">Caricamento…</p>}
        {wl.error && <div className="error">{String(wl.error.message || wl.error)}</div>}
        {wl.data && (
          <ul className="list">
            {wl.data.items.length === 0 && <li><span>Nessun elemento</span><small>Aggiungi dalla scheda strumento.</small></li>}
            {wl.data.items.map(it => (
              <li key={it.isin}>
                <div>
                  <div style={{fontWeight:800}}>{it.isin}</div>
                  <small>{it.name || '—'} {it.type ? `· ${it.type}`:''}</small>
                </div>
                <button className="ghost" onClick={()=>nav(`/instrument/${encodeURIComponent(it.isin)}`)}>Apri</button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  )
}
