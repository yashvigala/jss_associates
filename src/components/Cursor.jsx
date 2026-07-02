import { useEffect, useRef } from 'react'

// Crosshair cursor + a label chip that reads data-cursor="…" off whatever
// interactive element is under the pointer ("drag", "view", "toss"…).
export default function Cursor() {
  const ref = useRef(null)
  const chipRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = ref.current
    const chip = chipRef.current
    let x = -100
    let y = -100
    let cx = -100
    let cy = -100
    let rafId

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
    }
    const onOver = (e) => {
      const hot = e.target.closest('a, button, [data-hover], [data-cursor]')
      el.classList.toggle('is-hover', !!hot)
      const labelled = e.target.closest('[data-cursor]')
      const label = labelled?.getAttribute('data-cursor') || ''
      chip.textContent = label
      chip.classList.toggle('on', !!label)
    }
    const loop = () => {
      cx += (x - cx) * 0.22
      cy += (y - cy) * 0.22
      const hover = el.classList.contains('is-hover')
      el.style.transform = `translate(${cx}px, ${cy}px)${hover ? ' rotate(45deg) scale(1.5)' : ''}`
      chip.style.left = `${cx}px`
      chip.style.top = `${cy}px`
      rafId = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    rafId = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div className="cursor" ref={ref} aria-hidden="true">
        <span className="cursor-dot" />
      </div>
      <div className="cursor-chip" ref={chipRef} aria-hidden="true" />
    </>
  )
}
