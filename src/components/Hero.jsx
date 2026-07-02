import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import HeroCanvas from './three/HeroCanvas.jsx'
import { useLenis } from './SmoothScroll.jsx'
import { useTheme } from '../context/Theme.jsx'
import { CONTACT } from '../data/site.js'

const lineAnim = (ready, delay) => ({
  initial: { y: '110%' },
  animate: ready ? { y: '0%' } : {},
  transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay },
})

export default function Hero({ ready }) {
  const lenisRef = useLenis()
  const { palette } = useTheme()
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-38%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <header className="hero" id="top" ref={heroRef}>
      <div className="hero-canvas" data-cursor="drag">
        <HeroCanvas palette={palette} scrollP={scrollYProgress} />
      </div>

      <div className="hero-hint">drag to orbit — the skyline listens</div>

      <motion.div className="hero-overlay" style={{ y: textY, opacity: textOpacity }}>
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <span className="mono-label">
            <span className="tick">◆</span> Mumbai — est. 2020
          </span>
          <span className="mono-label">{CONTACT.coords}</span>
          <span className="mono-label">Architecture · Interiors · Real Estate</span>
        </motion.div>

        <h1 className="display">
          <span className="h1-line">
            <motion.span {...lineAnim(ready, 0.25)}>Shaping</motion.span>
          </span>
          <span className="h1-line">
            <motion.span {...lineAnim(ready, 0.38)}>
              <span className="accent-i">perception</span>
            </motion.span>
          </span>
          <span className="h1-line">
            <motion.span {...lineAnim(ready, 0.51)}>into reality.</motion.span>
          </span>
        </h1>

        <motion.div
          className="hero-sub"
          initial={{ opacity: 0, y: 18 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        >
          <p>
            An inside-out anatomy of the built environment — 20+ projects, a million
            square feet of Mumbai, zero beige boxes. Drawn by hand, checked on site.
          </p>
          <div className="hero-actions">
            <button
              className="btn"
              onClick={() => lenisRef?.current?.scrollTo('#work', { duration: 1.8 })}
            >
              See the work ↓
            </button>
            <a className="btn btn-solid" href={`mailto:${CONTACT.email}`}>
              Start a project
            </a>
          </div>
        </motion.div>
      </motion.div>

      <div className="hero-scroll">
        <span className="mono-label" style={{ fontSize: '0.56rem' }}>
          scroll
        </span>
        <span className="line" />
      </div>
    </header>
  )
}
