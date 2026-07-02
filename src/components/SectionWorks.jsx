import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { ARCH_PROJECTS } from '../data/site.js'
import ProjectModal from './ProjectModal.jsx'

function GalleryCard({ p, i, progress, onOpen }) {
  // gentle counter-parallax inside each frame while the strip slides
  const still = useMotionValue(0)
  const imgX = useTransform(progress ?? still, [0, 1], ['-3%', '3%'])

  return (
    <article
      className="gallery-card"
      data-cursor="view"
      onClick={() => onOpen(p)}
    >
      <span className="gc-num">{String(i + 1).padStart(2, '0')}</span>
      <div className="gc-img tint">
        <motion.img
          src={p.gallery[0]}
          alt={`${p.title} — ${p.typology}`}
          draggable="false"
          style={progress ? { x: imgX } : undefined}
        />
        <span className="gc-tag">{p.tag}</span>
      </div>
      <div className="gc-meta">
        <h4>{p.title}</h4>
        <span className="mono-label">{p.client}</span>
      </div>
      <div className="gc-sub">
        {p.location} · {p.scale}
        <br />
        <em>{p.status}</em>
      </div>
    </article>
  )
}

export default function SectionWorks() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [dist, setDist] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useLayoutEffect(() => {
    if (isMobile) return
    const measure = () => {
      if (!trackRef.current) return
      const m = trackRef.current.scrollWidth - window.innerWidth
      setDist(Math.max(0, m))
    }
    measure()
    window.addEventListener('resize', measure)
    const t = setTimeout(measure, 800)
    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(t)
    }
  }, [isMobile])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])

  if (isMobile) {
    return (
      <section className="section works" id="work">
        <div className="section-head">
          <span className="mono-label">
            <span className="tick">04</span> — Selected works
          </span>
          <span className="mono-label">2020 — present</span>
        </div>
        <div className="works-mobile">
          {ARCH_PROJECTS.map((p, i) => (
            <GalleryCard key={p.id} p={p} i={i} progress={null} onOpen={setOpen} />
          ))}
        </div>
        <AnimatePresence>
          {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
        </AnimatePresence>
      </section>
    )
  }

  return (
    <section
      className="works"
      id="work"
      ref={sectionRef}
      style={{ height: `calc(100svh + ${dist}px)` }}
    >
      <div className="works-pin">
        <div className="works-head">
          <span className="mono-label">
            <span className="tick">04</span> — Selected works
          </span>
          <span className="mono-label">scroll — the strip rides sideways</span>
        </div>

        <motion.div className="works-track" ref={trackRef} style={{ x }}>
          <div className="works-intro">
            <h2 className="display">
              Built &<br />
              <span className="accent-i">being built.</span>
            </h2>
            <p>
              Five towers, one hotel and a million square feet of Mumbai — every
              project below is drawn, defended through approvals and walked weekly
              on site. Click any frame for the full story.
            </p>
          </div>

          {ARCH_PROJECTS.map((p, i) => (
            <GalleryCard
              key={p.id}
              p={p}
              i={i}
              progress={scrollYProgress}
              onOpen={setOpen}
            />
          ))}

          <div className="works-outro">
            <p className="display">
              The next one is <span className="accent-i">yours</span> — scroll on.
            </p>
          </div>
        </motion.div>

        <div className="works-progress">
          <motion.span style={{ scaleX: scrollYProgress }} />
        </div>
      </div>

      <AnimatePresence>
        {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </section>
  )
}
