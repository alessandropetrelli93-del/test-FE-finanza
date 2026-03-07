# ISIN Viewer – Frontend (MVP)

Webapp interna (React + Vite) per consulente singolo.

## Requisiti
- Node.js 20+

## Avvio (mock/offline)
1. `npm install`
2. crea `.env` con:
   ```
   VITE_USE_MOCK=true
   ```
3. `npm run dev`

## Avvio con backend reale
1. Avvia il backend su `http://localhost:8787`
2. `.env`:
   ```
   VITE_USE_MOCK=false
   ```
3. `npm run dev`

> In sviluppo Vite fa proxy su /api e /health verso :8787 (vedi vite.config.ts)

## Pagine
- `/` Home ricerca ISIN + mini watchlist
- `/instrument/:isin` scheda strumento (quote + grafico)
- `/watchlist` lista completa
