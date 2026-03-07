// Mock data provider for offline demos.

function randSeries(days: number, start = 100) {
  const out: { date: string; value: number }[] = []
  let v = start
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    v = Math.max(1, v * (1 + (Math.random() - 0.5) * 0.02))
    out.push({ date: d.toISOString().slice(0, 10), value: Number(v.toFixed(2)) })
  }
  return out
}

const db: Record<string, any> = {
  IT0005320129: {
    isin: 'IT0005320129',
    name: 'Obbligazione (mock)',
    type: 'Bond',
    currency: 'EUR',
    market: 'MOT',
    symbol: 'BOND.MOCK',
  },
  IT0000084027: {
    isin: 'IT0000084027',
    name: 'Azione (mock)',
    type: 'Equity',
    currency: 'EUR',
    market: 'MTA',
    symbol: 'ASTM.MOCK',
  },
  IE00B4L5Y983: {
    isin: 'IE00B4L5Y983',
    name: 'ETF MSCI World (mock)',
    type: 'ETF',
    currency: 'EUR',
    market: 'XETRA',
    symbol: 'ETF.MOCK',
  },
  US4592001014: {
    isin: 'US4592001014',
    name: 'IBM (mock)',
    type: 'Equity',
    currency: 'USD',
    market: 'NYSE',
    symbol: 'IBM',
  },
}

const watch = new Set<string>(['IT0000084027', 'IE00B4L5Y983'])

export const mockApi = {
  async quote(isin: string) {
    const key = isin.toUpperCase()
    const base = db[key]
    if (!base) {
      const e: any = new Error('Strumento non disponibile per consultazione informativa (mapping mancante).')
      e.payload = { error: 'ISIN_NOT_MAPPED', isin: key }
      throw e
    }
    return {
      ...base,
      price: 12.34 + Math.random(),
      previous_close: 12.1,
      change: 0.24,
      change_pct: '+1.98%',
      last_update: new Date().toISOString().slice(0, 10),
      source: 'Mock data',
    }
  },
  async history(isin: string, range: '1M' | '6M' | '1Y' | '5Y') {
    const key = isin.toUpperCase()
    const base = db[key]
    if (!base) {
      const e: any = new Error('Strumento non disponibile per consultazione informativa (mapping mancante).')
      e.payload = { error: 'ISIN_NOT_MAPPED', isin: key }
      throw e
    }
    const days = range === '1M' ? 30 : range === '6M' ? 180 : range === '1Y' ? 365 : 365 * 5
    const cap = range === '5Y' ? 1300 : range === '1Y' ? 260 : range === '6M' ? 132 : 22
    return {
      isin: key,
      range,
      symbol: base.symbol,
      series: randSeries(Math.min(days, cap), 100 + Math.random() * 40),
      source: 'Mock data',
    }
  },
  async watchlistGet() {
    return { items: [...watch].map((i) => db[i] || { isin: i }) }
  },
  async watchlistAdd(isin: string) {
    watch.add(isin.toUpperCase())
    return { ok: true, isin: isin.toUpperCase() }
  },
  async watchlistRemove(isin: string) {
    watch.delete(isin.toUpperCase())
    return { ok: true, isin: isin.toUpperCase() }
  },
}
