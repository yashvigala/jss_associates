import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Wraps a child in a magnetic field: it leans toward the cursor and
// springs back on leave. strength 0.35 = subtle, 0.6 = playful.
export default function Magnetic({ children, strength = 0.4, style }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.6 })
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.6 })

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y, display: 'inline-block', ...style }}
    >
      {children}
    </motion.div>
  )
}
