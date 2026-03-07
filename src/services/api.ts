import { useEffect, useMemo, useState } from 'react'
import { mockApi } from '../mocks/mockApi'

const USE_MOCK = (import.meta as any).env.VITE_USE_MOCK === 'true'

export type Quote = {
  isin: string
  name?: string
  type?: string
  currency?: string
  market?: string
  symbol?: string
  price: number
  previous_close?: number
  change?: number
  change_pct?: string
  last_update?: string
  source?: string
}

export type History = {
  isin: string
  range: '1M'|'6M'|'1Y'|'5Y'
  symbol?: string
  series: { date: string; value: number }[]
  source?: string
}

export type WatchlistItem = {
  isin: string
  name?: string
  type?: string
  currency?: string
  market?: string
  symbol?: string
}

async function realFetch<T>(path: string): Promise<T> {
  const res = await fetch(path)
  const json = await res.json()
  if (!res.ok) {
    const msg = json?.message || res.statusText
    const err = new Error(msg)
    ;(err as any).payload = json
    throw err
  }
  return json
}

export const api = {
  async health() {
    if (USE_MOCK) return { ok: true }
    return realFetch<{ok:boolean}>('/health')
  },
  async quote(isin: string): Promise<Quote> {
    if (USE_MOCK) return mockApi.quote(isin)
    return realFetch<Quote>(`/api/quote?isin=${encodeURIComponent(isin)}`)
  },
  async history(isin: string, range: History['range']): Promise<History> {
    if (USE_MOCK) return mockApi.history(isin, range)
    return realFetch<History>(`/api/history?isin=${encodeURIComponent(isin)}&range=${range}`)
  },
  async watchlistGet(): Promise<{items: WatchlistItem[]}> {
    if (USE_MOCK) return mockApi.watchlistGet()
    return realFetch<{items: WatchlistItem[]}>('/api/watchlist')
  },
  async watchlistAdd(isin: string) {
    if (USE_MOCK) return mockApi.watchlistAdd(isin)
    return fetch(`/api/watchlist/${encodeURIComponent(isin)}`, { method: 'POST' }).then(async r => { const j = await r.json().catch(()=>({})); if(!r.ok) throw Object.assign(new Error(j?.message||r.statusText), {payload:j}); return j; })
  },
  async watchlistRemove(isin: string) {
    if (USE_MOCK) return mockApi.watchlistRemove(isin)
    return fetch(`/api/watchlist/${encodeURIComponent(isin)}`, { method: 'POST' }).then(async r => { const j = await r.json().catch(()=>({})); if(!r.ok) throw Object.assign(new Error(j?.message||r.statusText), {payload:j}); return j; })
  }
}

export function useBackendHealth() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    api.health().then(() => setOk(true)).catch(() => setOk(false))
  }, [])
  return { ok, mode: USE_MOCK ? 'mock' : (ok ? 'real' : 'offline') }
}

export function useAsync<T>(fn: ()=>Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T|null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>(null)
  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    fn().then(d => { if(alive){ setData(d); setLoading(false) }})
       .catch(e => { if(alive){ setError(e); setLoading(false) }})
    return () => { alive = false }
  }, deps)
  return { data, loading, error }
}
