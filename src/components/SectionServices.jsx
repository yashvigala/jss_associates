import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { SERVICES } from '../data/site.js'

export default function SectionServices() {
  const [active, setActive] = useState(null)
  const [open, setOpen] = useState(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.7 })
  const sy = useSpring(my, { stiffness: 260, damping: 28, mass: 0.7 })

  const onMove = (e) => {
    mx.set(e.clientX + 28)
    my.set(e.clientY - 190)
  }

  const activeService = SERVICES.find((s) => s.id === active)

  return (
    <section className="section" id="services">
      <div className="section-head">
        <span className="mono-label">
          <span className="tick">03</span> — What we do
        </span>
        <span className="mono-label">inside-out, always · tap a row</span>
      </div>

      <div onMouseMove={onMove} onMouseLeave={() => setActive(null)}>
        {SERVICES.map((s, i) => (
          <motion.div
            className="service-row"
            key={s.id}
            data-hover
            onMouseEnter={() => setActive(s.id)}
            onClick={() => setOpen((o) => (o === s.id ? null : s.id))}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="s-index">/{String(i + 1).padStart(2, '0')}</span>
            <h3 className="display">{s.title}</h3>
            <span className="s-desc">{s.desc}</span>
            <AnimatePresence initial={false}>
              {open === s.id && (
                <motion.div
                  className="service-more"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="service-more-inner">
                    {s.chips.map((c) => (
                      <span className="service-chip" key={c}>
                        {c}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeService && (
          <motion.div
            className="service-preview tint"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.88, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="popLayout">
              <motion.img
                key={activeService.id}
                src={activeService.img}
                alt=""
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
