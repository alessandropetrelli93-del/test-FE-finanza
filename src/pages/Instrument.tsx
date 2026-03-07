import { useParams, useNavigate } from 'react-router-dom'
import { api, useAsync } from '../services/api'
import { useEffect, useMemo, useState } from 'react'
import LineChart from '../components/LineChart'
import AddToListDialog from '../components/AddToListDialog'
import { addToList, loadLists, saveLists } from '../services/listStore'

export default function Instrument() {
  const { isin: rawIsin } = useParams()
  const nav = useNavigate()
  const isin = (rawIsin || '').toUpperCase()
  const [range, setRange] = useState<'1M' | '6M' | '1Y' | '5Y'>('1Y')

  const [listsState, setListsState] = useState(loadLists())
  useEffect(() => { saveLists(listsState) }, [listsState])

  const quote = useAsync(() => api.quote(isin), [isin])
  const hist = useAsync(() => api.history(isin, range), [isin, range])

  const [dlg, setDlg] = useState(false)

  const metrics = useMemo(() => {
    const s = hist.data?.series || []
    if (!s.length) return null
    const vals = s.map(p => p.value)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const last = s[s.length-1]?.value
    return { min, max, last }
  }, [hist.data])

  const kpis = useMemo(() => {
    const q = quote.data
    if (!q) return []
    return [
      { label: 'Prezzo', value: Number(q.price).toFixed(2), suffix: q.currency || '' },
      { label: 'Variazione %', value: q.change_pct ?? '—', suffix: '' },
      { label: 'Variazione', value: (q.change ?? '—') as any, suffix: '' },
      { label: 'Aggiornato', value: q.last_update ?? '—', suffix: '' },
    ]
  }, [quote.data])

  function openDialog(){ setDlg(true) }

  function addToSelectedList(name: string) {
    setListsState(s => addToList(s, name, isin))
    // In modalità reale, sincronizziamo anche con la watchlist backend SOLO per Personale
    if (name === 'Personale') api.watchlistAdd(isin).catch(()=>{})
  }

  return (
    <section className="card">
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1.2 }}>
          <h2 style={{ marginTop: 0 }}>{quote.data?.name || 'Strumento'}</h2>
          <div className="muted">
            ISIN: <b>{isin}</b>
            {quote.data?.type ? ` · Tipo: ${quote.data.type}` : ''}
            {quote.data?.market ? ` · Mercato: ${quote.data.market}` : ''}
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <span className={quote.error ? 'tag bad' : quote.data ? 'tag ok' : 'tag warn'}>
              {quote.error ? 'Errore' : quote.data ? 'Dati OK' : 'Caricamento'}
            </span>
            <span className="tag">Fonte: {quote.data?.source || hist.data?.source || '—'}</span>
          </div>
        </div>
        <div style={{ flex: 0.8, textAlign: 'right' }}>
          <button onClick={openDialog}>＋ Aggiungi a lista</button>
          <div className="muted" style={{ marginTop: 6 }}>
            Lista attiva: <b>{listsState.active}</b>
          </div>
        </div>
      </div>

      {quote.loading && <p className="muted">Caricamento dati…</p>}
      {quote.error && (
        <div className="error">
          {String((quote.error as any).message || quote.error)}


          {JSON.stringify((quote.error as any).payload || {}, null, 2)}
        </div>
      )}

      {quote.data && (
        <div className="kpi">
          {kpis.map((k) => (
            <div className="box" key={k.label}>
              <div className="muted">{k.label}</div>
              <div className="val">
                {k.value} <span className="muted">{k.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="row" style={{ marginTop: 12, alignItems: 'flex-end' }}>
        <div style={{ flex: '0 0 220px' }}>
          <label>Periodo grafico</label>
          <select value={range} onChange={(e) => setRange(e.target.value as any)}>
            <option value="1M">1M</option>
            <option value="6M">6M</option>
            <option value="1Y">1Y</option>
            <option value="5Y">5Y</option>
          </select>
        </div>
        <div style={{ flex: 1 }} />
        <div className="metrics">
          <div className="metric">Min <b>{metrics ? metrics.min.toFixed(2) : '—'}</b></div>
          <div className="metric">Max <b>{metrics ? metrics.max.toFixed(2) : '—'}</b></div>
          <div className="metric">Last <b>{metrics ? metrics.last.toFixed(2) : '—'}</b></div>
        </div>
      </div>

      {hist.loading && <p className="muted">Caricamento storico…</p>}
      {hist.error && (
        <div className="error">
          {String((hist.error as any).message || hist.error)}


          {JSON.stringify((hist.error as any).payload || {}, null, 2)}
        </div>
      )}

      {hist.data && (
        <div style={{ marginTop: 10 }}>
          <LineChart series={hist.data.series} />
          <div className="muted" style={{ marginTop: 6 }}>
            {hist.data.series.length} punti · range {hist.data.range}
          </div>
        </div>
      )}

      <AddToListDialog
        open={dlg}
        onClose={() => setDlg(false)}
        listsState={listsState}
        onAdd={addToSelectedList}
        isin={isin}
      />
    </section>
  )
}
