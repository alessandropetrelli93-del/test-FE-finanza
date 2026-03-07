import { useEffect, useMemo, useRef, useState } from 'react'

function formatDate(d: string) {
  // YYYY-MM-DD -> DD/MM/YY
  const [y, m, day] = d.split('-')
  if (!y || !m || !day) return d
  return `${day}/${m}/${y.slice(2)}`
}

export default function LineChart({ series }: { series: { date: string; value: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hover, setHover] = useState<{ idx: number; x: number; y: number } | null>(null)

  const data = series || []

  const stats = useMemo(() => {
    if (!data.length) return null
    const vals = data.map((p) => p.value)
    return { min: Math.min(...vals), max: Math.max(...vals) }
  }, [data])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const w = c.width
    const h = c.height

    // paddings (extra bottom for x-axis labels)
    const padL = 18
    const padR = 18
    const padT = 18
    const padB = 34

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)

    if (!data || data.length < 2 || !stats) {
      ctx.fillStyle = 'rgba(0,0,0,.55)'
      ctx.font = '14px system-ui'
      ctx.fillText('Storico non disponibile', 18, 30)
      return
    }

    const min = stats.min
    const max = stats.max

    const plotW = w - padL - padR
    const plotH = h - padT - padB

    const scaleX = plotW / (data.length - 1)
    const scaleY = plotH / ((max - min) || 1)

    const xAt = (i: number) => padL + i * scaleX
    const yAt = (v: number) => padT + (plotH - (v - min) * scaleY)

    // grid
    ctx.strokeStyle = 'rgba(0,0,0,.05)'
    for (let x = padL; x <= padL + plotW; x += 90) {
      ctx.beginPath()
      ctx.moveTo(x, padT)
      ctx.lineTo(x, padT + plotH)
      ctx.stroke()
    }
    for (let y = padT; y <= padT + plotH; y += 65) {
      ctx.beginPath()
      ctx.moveTo(padL, y)
      ctx.lineTo(padL + plotW, y)
      ctx.stroke()
    }

    // line
    ctx.lineWidth = 2.4
    ctx.strokeStyle = '#DF0025'
    ctx.beginPath()
    data.forEach((p, i) => {
      const x = xAt(i)
      const y = yAt(p.value)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // axis baseline (x)
    ctx.strokeStyle = 'rgba(0,0,0,.12)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padL, padT + plotH)
    ctx.lineTo(padL + plotW, padT + plotH)
    ctx.stroke()

    // x-axis labels
    const ticks = [
      0,
      Math.floor((data.length - 1) / 3),
      Math.floor(((data.length - 1) * 2) / 3),
      data.length - 1,
    ]
    ctx.fillStyle = 'rgba(0,0,0,.65)'
    ctx.font = '12px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ticks.forEach((i) => {
      const x = xAt(i)
      ctx.strokeStyle = 'rgba(0,0,0,.12)'
      ctx.beginPath()
      ctx.moveTo(x, padT + plotH)
      ctx.lineTo(x, padT + plotH + 6)
      ctx.stroke()
      ctx.fillText(formatDate(data[i].date), x, padT + plotH + 8)
    })

    // hover crosshair + point
    if (hover && hover.idx >= 0 && hover.idx < data.length) {
      const i = hover.idx
      const x = xAt(i)
      const y = yAt(data[i].value)

      ctx.strokeStyle = 'rgba(223,0,37,.25)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, padT)
      ctx.lineTo(x, padT + plotH)
      ctx.stroke()

      ctx.fillStyle = '#DF0025'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [data, hover, stats])

  function handleMove(e: React.MouseEvent) {
    const c = canvasRef.current
    if (!c || !data || data.length < 2) return
    const rect = c.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const padL = 18
    const padR = 18
    const plotW = c.width - padL - padR

    const rel = Math.max(0, Math.min(1, (x - padL) / plotW))
    const idx = Math.round(rel * (data.length - 1))
    setHover({ idx, x, y })
  }

  function handleLeave() {
    setHover(null)
  }

  const tooltip = useMemo(() => {
    if (!hover || hover.idx < 0 || hover.idx >= data.length) return null
    const p = data[hover.idx]
    return { date: p.date, value: p.value }
  }, [hover, data])

  return (
    <div className="chart-wrap">
      <canvas ref={canvasRef} width={900} height={300} onMouseMove={handleMove} onMouseLeave={handleLeave} />
      {tooltip && (
        <div className="chart-tooltip" style={{ left: `${hover!.x}px`, top: `${hover!.y}px` }}>
          {formatDate(tooltip.date)} <b>{tooltip.value.toFixed(2)}</b>
        </div>
      )}
    </div>
  )
}
