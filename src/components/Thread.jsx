import { useEffect, useRef } from 'react'

// The one motif that threads the whole page: a single gold line that draws
// itself as you scroll, pen-tip travelling just below viewport centre.
// Waypoints hang off section ids so the path survives responsive reflow.
const WAYPOINTS = [
  { sel: '#studio', fx: 0.86, fy: 0.1 },
  { sel: '#studio', fx: 0.1, fy: 0.75 },
  { sel: '#process', fx: 0.88, fy: 0.18 },
  { sel: '#process', fx: 0.14, fy: 0.85 },
  { sel: '#services', fx: 0.9, fy: 0.3 },
  { sel: '#work', fx: 0.07, fy: 0.2 },
  { sel: '#play', fx: 0.9, fy: 0.3 },
  { sel: '#ethos', fx: 0.5, fy: 0.4 },
  { sel: '#people', fx: 0.9, fy: 0.35 },
  { sel: '#careers', fx: 0.1, fy: 0.4 },
  { sel: '#contact', fx: 0.55, fy: 0.3 },
  { sel: '#contact', fx: 0.2, fy: 0.85 },
]

export default function Thread() {
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const glowRef = useRef(null)
  const tipRef = useRef(null)
  const haloRef = useRef(null)
  const state = useRef({ length: 0, drawn: 0 })

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    let rafId = null

    const build = () => {
      const w = document.documentElement.clientWidth
      if (w < 900) return
      const doc = document.documentElement
      const h = Math.max(doc.scrollHeight, document.body.scrollHeight)
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.style.height = `${h}px`

      const pts = []
      const hero = document.querySelector('#top')
      if (hero) {
        const r = hero.getBoundingClientRect()
        pts.push({ x: w * 0.62, y: r.top + window.scrollY + r.height * 0.96 })
      }
      for (const wp of WAYPOINTS) {
        const el = document.querySelector(wp.sel)
        if (!el) continue
        const r = el.getBoundingClientRect()
        pts.push({
          x: w * wp.fx,
          y: r.top + window.scrollY + r.height * wp.fy,
        })
      }
      if (pts.length < 3) return

      // Catmull-Rom → cubic bezier for a silk-smooth cord
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i]
        const p1 = pts[i]
        const p2 = pts[i + 1]
        const p3 = pts[i + 2] || p2
        const c1x = p1.x + (p2.x - p0.x) / 6
        const c1y = p1.y + (p2.y - p0.y) / 6
        const c2x = p2.x - (p3.x - p1.x) / 6
        const c2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
      }
      pathRef.current.setAttribute('d', d)
      glowRef.current.setAttribute('d', d)
      const L = pathRef.current.getTotalLength()
      state.current.length = L
      pathRef.current.style.strokeDasharray = `${L}`
      glowRef.current.style.strokeDasharray = `${L}`
      update(true)
    }

    // binary-search the path length whose y ≈ target document y
    const lengthAtY = (targetY) => {
      const path = pathRef.current
      const L = state.current.length
      if (!L) return 0
      let lo = 0
      let hi = L
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2
        if (path.getPointAtLength(mid).y < targetY) lo = mid
        else hi = mid
      }
      return (lo + hi) / 2
    }

    const update = (force) => {
      const L = state.current.length
      if (!L) return
      const tipY = window.scrollY + window.innerHeight * 0.62
      const drawn = Math.min(L, lengthAtY(tipY))
      if (!force && Math.abs(drawn - state.current.drawn) < 0.5) return
      state.current.drawn = drawn
      pathRef.current.style.strokeDashoffset = `${L - drawn}`
      glowRef.current.style.strokeDashoffset = `${L - drawn}`
      const pt = pathRef.current.getPointAtLength(drawn)
      const visible = drawn > 4 ? 1 : 0
      tipRef.current.setAttribute('cx', pt.x)
      tipRef.current.setAttribute('cy', pt.y)
      tipRef.current.style.opacity = visible
      haloRef.current.setAttribute('cx', pt.x)
      haloRef.current.setAttribute('cy', pt.y)
      haloRef.current.style.opacity = visible * 0.5
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        update()
      })
    }

    const t1 = setTimeout(build, 300)
    const t2 = setTimeout(build, 1600) // after fonts/images settle
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', build)
    const ro = new ResizeObserver(() => build())
    ro.observe(document.body)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', build)
      ro.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <svg ref={svgRef} className="thread" aria-hidden="true">
      <defs>
        <filter id="thread-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path
        ref={glowRef}
        fill="none"
        style={{ stroke: 'var(--accent)' }}
        strokeWidth="4"
        opacity="0.22"
        filter="url(#thread-blur)"
      />
      <path
        ref={pathRef}
        fill="none"
        style={{ stroke: 'var(--accent)' }}
        strokeWidth="1.3"
        opacity="0.62"
      />
      <circle ref={haloRef} r="8" style={{ fill: 'var(--accent)' }} opacity="0" filter="url(#thread-blur)" />
      <circle ref={tipRef} r="3" style={{ fill: 'var(--accent-bright)' }} opacity="0" />
    </svg>
  )
}
