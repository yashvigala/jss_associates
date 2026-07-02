import { useRef } from 'react'
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
} from 'framer-motion'
import { ETHOS, MARQUEE } from '../data/site.js'

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

// marquee that surfs your scroll velocity — flick the page and it whips along
function VelocityMarquee({ children, baseVelocity = -1.2 }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)
  const dirRef = useRef(1)

  useAnimationFrame((_, delta) => {
    let moveBy = dirRef.current * baseVelocity * (delta / 1000)
    const vf = velocityFactor.get()
    if (vf < 0) dirRef.current = -1
    else if (vf > 0) dirRef.current = 1
    moveBy += moveBy * Math.abs(vf)
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-inner" style={{ x }}>
        {[0, 1, 2, 3].map((k) => (
          <div style={{ display: 'flex', flexShrink: 0 }} key={k}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function SectionEthos() {
  return (
    <section className="section ethos" id="ethos">
      <VelocityMarquee>
        {MARQUEE.map((m, i) => (
          <span className="m-item display" key={i}>
            {m} <i>◆</i>
          </span>
        ))}
      </VelocityMarquee>

      <div className="ethos-grid">
        {ETHOS.map((e, i) => (
          <motion.div
            className="ethos-cell"
            key={e.num}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mono-label">
              <span className="tick">{e.num}</span> — ethos
            </span>
            <h4>{e.title}</h4>
            <p>{e.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
