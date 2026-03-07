import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { api, useAsync } from '../services/api'
import { loadLists, saveLists } from '../services/listStore'

export default function Home() {
  const nav = useNavigate()
  const [isin, setIsin] = useState('US4592001014')

  const [listsState, setListsState] = useState(loadLists())
  useEffect(() => {
    saveLists(listsState)
  }, [listsState])

  const activeName = listsState.active
  const activeIsins = listsState.lists[activeName] || []

  const meta = useAsync(() => api.watchlistGet(), [])
  const metaMap = useMemo(() => {
    const m = new Map<string, any>()
    meta.data?.items?.forEach((it) => m.set(it.isin.toUpperCase(), it))
    return m
  }, [meta.data])

  function openIsin(i: string) {
    nav(`/instrument/${encodeURIComponent(i)}`)
  }

  return (
    <div className="grid">
      <section className="card">
        <h2>Ricerca</h2>
        <p className="muted">Inserisci un ISIN e apri la scheda strumento.</p>
        <div className="row">
          <div>
            <label>ISIN</label>
            <input value={isin} onChange={(e) => setIsin(e.target.value.toUpperCase())} placeholder="Es: IT0005320129" />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <label>&nbsp;</label>
            <button onClick={() => openIsin(isin.trim().toUpperCase())}>Cerca</button>
          </div>
        </div>
        <div className="note" style={{ marginTop: 12 }}>
          MVP consulente: liste libere (es. “Cliente Rossi”) + scheda strumento + grafico.
        </div>
      </section>

      <aside className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Liste</h2>
          <button className="secondary" onClick={() => nav('/lists')}>Gestisci</button>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <div>
            <label>Lista attiva</label>
            <select value={activeName} onChange={(e) => setListsState((s) => ({ ...s, active: e.target.value }))}>
              {Object.keys(listsState.lists)
                .sort()
                .map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {meta.loading && <p className="muted">Caricamento…</p>}
        {meta.error && <div className="error">{String(meta.error.message || meta.error)}</div>}

        <ul className="list">
          {activeIsins.length === 0 && (
            <li>
              <span>Nessun elemento</span>
              <small>Aggiungi dalla scheda strumento.</small>
            </li>
          )}
          {activeIsins.slice(0, 6).map((i) => {
            const it = metaMap.get(i) || { isin: i }
            return (
              <li key={i}>
                <div>
                  <div style={{ fontWeight: 800 }}>{it.isin}</div>
                  <small>
                    {it.name || '—'} {it.type ? `· ${it.type}` : ''}
                  </small>
                </div>
                <button className="ghost" onClick={() => openIsin(i)}>
                  Apri
                </button>
              </li>
            )
          })}
        </ul>
        <p className="muted" style={{ marginTop: 10 }}>
          Mostrati {Math.min(6, activeIsins.length)} di {activeIsins.length}.
        </p>
      </aside>
    </div>
  )
}
