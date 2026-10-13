import { useEffect, useRef } from "react"

interface Node { x: number; y: number; vx: number; vy: number; hx: number; hy: number }

// A quiet physics toy: dots tied to their home positions by springs, pushed away by the cursor,
// and sent flying by a click. Hairline links join near neighbours. Honors reduced motion.
export function NodeField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0, h = 0, raf = 0, running = true
    let nodes: Node[] = []
    const mouse = { x: -999, y: -999 }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.max(16, Math.min(46, Math.round((w * h) / 9000)))
      nodes = Array.from({ length: n }, () => {
        const x = Math.random() * w, y = Math.random() * h
        return { x, y, vx: 0, vy: 0, hx: x, hy: y }
      })
    }

    const step = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of nodes) {
        p.vx += (p.hx - p.x) * 0.012
        p.vy += (p.hy - p.y) * 0.012
        const dx = p.x - mouse.x, dy = p.y - mouse.y
        const d2 = dx * dx + dy * dy
        if (d2 < 130 * 130 && d2 > 1) {
          const d = Math.sqrt(d2), f = (1 - d / 130) * 1.6
          p.vx += (dx / d) * f; p.vy += (dy / d) * f
        }
        p.vx *= 0.9; p.vy *= 0.9
        p.x += p.vx; p.y += p.vy
      }
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 150) {
            ctx.strokeStyle = `rgba(23,23,23,${0.14 * (1 - d / 150)})`
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      ctx.fillStyle = "rgba(23,23,23,0.45)"
      for (const p of nodes) { ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill() }
      if (running && !reduce) raf = requestAnimationFrame(step)
    }

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top
    }
    const leave = () => { mouse.x = mouse.y = -999 }
    const burst = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const cx = e.clientX - r.left, cy = e.clientY - r.top
      for (const p of nodes) {
        const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1
        if (d < 260) { const f = (1 - d / 260) * 14; p.vx += (dx / d) * f; p.vy += (dy / d) * f }
      }
    }
    const vis = () => {
      running = !document.hidden
      if (running && !reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(step) }
    }

    resize(); step()
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerdown", burst)
    document.addEventListener("pointerleave", leave)
    document.addEventListener("visibilitychange", vis)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerdown", burst)
      document.removeEventListener("pointerleave", leave)
      document.removeEventListener("visibilitychange", vis)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
