import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import BuildCanvas from './three/BuildCanvas.jsx'
import { useTheme } from '../context/Theme.jsx'
import { PHASES } from '../data/site.js'

export default function SectionBuild() {
  const sectionRef = useRef(null)
  const readoutRef = useRef(null)
  const ghostRef = useRef(null)
  const [phase, setPhase] = useState(0)
  const { palette } = useTheme()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(3, Math.floor(v * 4))
    setPhase((p) => (p === idx ? p : idx))
    const done = v > 0.92
    const floors = String(Math.min(22, Math.round((v / 0.7) * 22))).padStart(2, '0')
    if (readoutRef.current) {
      readoutRef.current.textContent = done ? '22 / 22 — handed over' : `${floors} / 22 floors`
    }
    if (ghostRef.current) {
      ghostRef.current.textContent = floors
    }
  })

  const current = PHASES[phase]

  return (
    <section className="build" id="process" ref={sectionRef}>
      <div className="build-sticky">
        <div className="build-canvas">
          <BuildCanvas progress={scrollYProgress} palette={palette} />
        </div>

        <div className="build-ghost" ref={ghostRef} aria-hidden="true">
          00
        </div>

        <div className="build-title-top">
          <span className="mono-label">
            <span className="tick">02</span> — Practice model
          </span>
          <span className="mono-label">keep scrolling — we're building</span>
        </div>

        <div className="build-ui">
          <div className="build-phase">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="phase-num">{current.num}</div>
                <h3>{current.title}</h3>
                <p>{current.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="build-rail">
          <span className="build-readout" ref={readoutRef}>
            00 / 22 floors
          </span>
          <div className="rail-track">
            <motion.div
              className="rail-fill"
              style={{ scaleY: scrollYProgress, height: '100%' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
