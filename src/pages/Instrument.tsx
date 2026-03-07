import { useParams, useNavigate } from 'react-router-dom'
  import { api, useAsync } from '../services/api'
  import { useMemo, useState } from 'react'
  import LineChart from '../components/LineChart'

  export default function Instrument() {
    const { isin: rawIsin } = useParams()
    const nav = useNavigate()
    const isin = (rawIsin || '').toUpperCase()
    const [range, setRange] = useState<'1M'|'6M'|'1Y'|'5Y'>('1Y')

    const quote = useAsync(() => api.quote(isin), [isin])
    const hist = useAsync(() => api.history(isin, range), [isin, range])

    async function addWatchlist() {
      try {
        await api.watchlistAdd(isin)
        nav('/watchlist')
      } catch (e:any) {
        // ignore here; UI shows errors already
      }
    }

    const kpis = useMemo(() => {
      const q = quote.data
      if (!q) return []
      return [
        {label: 'Prezzo', value: q.price?.toFixed ? q.price.toFixed(2) : String(q.price)},
        {label: 'Prec. close', value: q.previous_close ?? '—'},
        {label: 'Change', value: q.change ?? '—'},
        {label: 'Change %', value: q.change_pct ?? '—'},
      ]
    }, [quote.data])

    return (
      <section className="card">
        <div className="row" style={{alignItems:'flex-start'}}>
          <div style={{flex:1.2}}>
            <h2 style={{marginTop:0}}>{quote.data?.name || 'Strumento'}</h2>
            <div className="muted">
              ISIN: <b>{isin}</b>
              {quote.data?.type ? ` · Tipo: ${quote.data.type}`:''}
              {quote.data?.market ? ` · Mercato: ${quote.data.market}`:''}
              {quote.data?.symbol ? ` · Symbol: ${quote.data.symbol}`:''}
            </div>
            <div className="row" style={{marginTop:10}}>
              <span className={quote.error ? 'tag bad' : (quote.data ? 'tag ok' : 'tag warn')}>
                {quote.error ? 'Errore' : (quote.data ? 'Dati OK' : 'Caricamento')}
              </span>
              <span className="tag">Fonte: {quote.data?.source || hist.data?.source || '—'}</span>
              <span className="tag">Agg.: {quote.data?.last_update || '—'}</span>
            </div>
          </div>
          <div style={{flex:.6, textAlign:'right'}}>
            <button className="secondary" onClick={addWatchlist}>★ Add to watchlist</button>
          </div>
        </div>

        {(quote.loading) && <p className="muted">Caricamento quote…</p>}
        {quote.error && <div className="error">{String((quote.error as any).message || quote.error)}

{JSON.stringify((quote.error as any).payload || {}, null, 2)}</div>}

        {quote.data && (
          <div className="kpi">
            {kpis.map(k => (
              <div className="box" key={k.label}>
                <div className="muted">{k.label}</div>
                <div className="val">{k.value as any}</div>
              </div>
            ))}
          </div>
        )}

        <div className="row" style={{marginTop:12}}>
          <div style={{flex:'0 0 auto'}}>
            <label>Periodo grafico</label>
            <select value={range} onChange={e=>setRange(e.target.value as any)}>
              <option value="1M">1M</option>
              <option value="6M">6M</option>
              <option value="1Y">1Y</option>
              <option value="5Y">5Y</option>
            </select>
          </div>
          <div className="muted" style={{alignSelf:'flex-end'}}>
            Grafico: close giornalieri (daily)
          </div>
        </div>

        {hist.loading && <p className="muted">Caricamento storico…</p>}
        {hist.error && <div className="error">{String((hist.error as any).message || hist.error)}

{JSON.stringify((hist.error as any).payload || {}, null, 2)}</div>}

        {hist.data && (
          <div style={{marginTop:10}}>
            <LineChart series={hist.data.series} />
            <div className="muted" style={{marginTop:6}}>
              {hist.data.series.length} punti · range {hist.data.range}
            </div>
          </div>
        )}
      </section>
    )
  }
