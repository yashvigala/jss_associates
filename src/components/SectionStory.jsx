import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion'

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.13, 1])
  return (
    <motion.span className="w" style={{ opacity }}>
      {children}
    </motion.span>
  )
}

function WordReveal({ text }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.35'],
  })
  const words = text.split(' ')
  return (
    <p ref={ref} className="story-statement">
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, Math.min(1, (i + 1.6) / words.length)]}
        >
          {word.includes('*') ? (
            <span className="accent-i">{word.replace(/\*/g, '')}</span>
          ) : (
            word
          )}
        </Word>
      ))}
    </p>
  )
}

function Counter({ from = 0, to, suffix = '', duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  useEffect(() => {
    if (!inView) return
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, from, to, suffix, duration])
  return (
    <span ref={ref}>
      {from}
      {suffix}
    </span>
  )
}

const STATS = [
  { node: <Counter to={20} suffix="+" />, label: 'Projects on the boards' },
  { node: <Counter to={1} suffix="M+" duration={1} />, label: 'Square feet designed' },
  { node: <Counter to={3} duration={1.2} />, label: 'Disciplines, one table' },
  { node: <Counter from={1990} to={2020} duration={2} />, label: 'Founded in Mumbai' },
]

export default function SectionStory() {
  return (
    <section className="section" id="studio">
      <div className="section-head">
        <span className="mono-label">
          <span className="tick">01</span> — The studio
        </span>
        <span className="mono-label">scroll to read</span>
      </div>

      <div className="story-grid">
        <WordReveal text="Each built form narrates a *creative* story — we design with purpose, harmonising the hard maths of development with the *soft* business of everyday life." />
        <div className="story-side">
          <p>
            Since 2020 we've worked as one close-knit table of architects — testing
            ideas by drawing them, then walking them onto site. Clients, consultants
            and studio stay in the same conversation from first sketch to handover.
          </p>
          <p>
            The result: buildings that hold their intent all the way through
            approvals, working drawings and construction — and spaces that quietly
            upgrade the quality of urban life.
          </p>
        </div>
      </div>

      <motion.div
        className="stats"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {STATS.map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat-num">{s.node}</div>
            <div className="stat-label mono-label">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
