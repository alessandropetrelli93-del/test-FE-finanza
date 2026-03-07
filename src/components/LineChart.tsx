import { useEffect, useRef } from 'react'

export default function LineChart({ series }: { series: { date: string; value: number }[] }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const w = c.width
    const h = c.height
    ctx.clearRect(0, 0, w, h)

    // background
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)

    if (!series || series.length < 2) {
      ctx.fillStyle = 'rgba(0,0,0,.55)'
      ctx.font = '14px system-ui'
      ctx.fillText('Storico non disponibile', 18, 30)
      return
    }

    const data = series
    const vals = data.map((p) => p.value)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const pad = 18

    // light grid
    ctx.strokeStyle = 'rgba(0,0,0,.05)'
    for (let x = 0; x < w; x += 90) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    for (let y = 0; y < h; y += 65) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }

    const scaleX = (w - 2 * pad) / (data.length - 1)
    const scaleY = (h - 2 * pad) / ((max - min) || 1)

    // line (Sparkasse primary)
    ctx.lineWidth = 2.4
    ctx.strokeStyle = '#DF0025'
    ctx.beginPath()
    data.forEach((p, i) => {
      const x = pad + i * scaleX
      const y = h - pad - (p.value - min) * scaleY
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // last dot
    const last = data[data.length - 1]
    const lx = pad + (data.length - 1) * scaleX
    const ly = h - pad - (last.value - min) * scaleY
    ctx.fillStyle = '#DF0025'
    ctx.beginPath()
    ctx.arc(lx, ly, 4, 0, Math.PI * 2)
    ctx.fill()

  }, [series])

  return <canvas ref={ref} width={900} height={260} />
}
