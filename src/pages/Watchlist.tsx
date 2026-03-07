import { useNavigate } from 'react-router-dom'
import { api, useAsync } from '../services/api'
import { useState } from 'react'

export default function Watchlist() {
  const nav = useNavigate()
  const [refresh, setRefresh] = useState(0)
  const wl = useAsync(() => api.watchlistGet(), [refresh])

  async function remove(isin: string) {
    await api.watchlistRemove(isin)
    setRefresh(x=>x+1)
  }

  return (
    <section className="card">
      <h2 style={{marginTop:0}}>★ Watchlist</h2>
      <p className="muted">Lista strumenti salvati dal consulente (MVP).</p>

      {wl.loading && <p className="muted">Caricamento…</p>}
      {wl.error && <div className="error">{String(wl.error.message || wl.error)}</div>}

      {wl.data && (
        <ul className="list">
          {wl.data.items.length === 0 && <li><span>Nessun elemento</span><small>Torna in Home e cerca un ISIN.</small></li>}
          {wl.data.items.map(it => (
            <li key={it.isin}>
              <div>
                <div style={{fontWeight:800}}>{it.isin} <span className="muted">{it.symbol ? `· ${it.symbol}`:''}</span></div>
                <small>{it.name || '—'} {it.type ? `· ${it.type}`:''}</small>
              </div>
              <div className="row" style={{flex:'0 0 auto'}}>
                <button className="ghost" onClick={()=>nav(`/instrument/${encodeURIComponent(it.isin)}`)}>Apri</button>
                <button className="secondary" onClick={()=>remove(it.isin)}>Rimuovi</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
