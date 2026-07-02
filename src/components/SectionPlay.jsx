import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { INTERIOR_SHOTS } from '../data/site.js'

// endlesstools-style tactile board: every handed-over interior, printed as a
// polaroid you can pick up and throw around. Springy, silly, memorable.
// two loose rows with real breathing room — scattered, never stacked
const SPOTS = [
  { left: '3%', top: '9%', r: -7 },
  { left: '15%', top: '53%', r: 5 },
  { left: '27%', top: '7%', r: 9 },
  { left: '39%', top: '55%', r: -4 },
  { left: '51%', top: '9%', r: 6 },
  { left: '63%', top: '53%', r: -8 },
  { left: '75%', top: '7%', r: 4 },
  { left: '85%', top: '51%', r: -3 },
]

function Polaroid({ shot, spot, boardRef, i }) {
  const [z, setZ] = useState(1)

  return (
    <motion.div
      className="polaroid"
      data-cursor="toss"
      style={{ left: spot.left, top: spot.top, zIndex: z }}
      initial={{ opacity: 0, y: -60, rotate: spot.r * 2, scale: 0.7 }}
      whileInView={{ opacity: 1, y: 0, rotate: spot.r, scale: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{
        type: 'spring',
        stiffness: 160,
        damping: 15,
        delay: i * 0.07,
      }}
      drag
      dragConstraints={boardRef}
      dragElastic={0.18}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 18, power: 0.4 }}
      whileDrag={{ scale: 1.08, rotate: 0, boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}
      whileHover={{ scale: 1.04 }}
      onDragStart={() => setZ(40)}
      onDragEnd={() => setZ(20)}
    >
      <div className="p-img tint">
        <img src={shot.img} alt={shot.cap} draggable="false" />
      </div>
      <span className="p-cap">{shot.cap}</span>
    </motion.div>
  )
}

export default function SectionPlay() {
  const boardRef = useRef(null)
  const [deal, setDeal] = useState(0)

  return (
    <section className="section play" id="play">
      <div className="section-head">
        <span className="mono-label">
          <span className="tick">05</span> — Interiors, up close
        </span>
        <span className="mono-label">every one handed over</span>
      </div>

      <div className="play-board" ref={boardRef}>
        <div className="pb-hint">
          our interiors, fresh from the printer — <em>throw them around.</em>
        </div>
        <div key={deal}>
          {INTERIOR_SHOTS.map((shot, i) => (
            <Polaroid
              key={`${deal}-${shot.id}`}
              shot={shot}
              spot={SPOTS[i % SPOTS.length]}
              boardRef={boardRef}
              i={i}
            />
          ))}
        </div>
      </div>

      <div className="play-actions">
        <span className="mono-label">
          <span className="tick">◆</span> Login Hive · Boho House · Drapes & Tassles —
          all delivered
        </span>
        <button className="btn" onClick={() => setDeal((d) => d + 1)}>
          Re-deal the prints ↺
        </button>
      </div>
    </section>
  )
}
