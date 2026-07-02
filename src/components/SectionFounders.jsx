import { motion } from 'framer-motion'
import { FOUNDERS } from '../data/site.js'

export default function SectionFounders() {
  return (
    <section className="section" id="people">
      <div className="section-head">
        <span className="mono-label">
          <span className="tick">06</span> — The people
        </span>
        <span className="mono-label">two founders, one line</span>
      </div>

      <div className="founders-grid">
        {FOUNDERS.map((f, i) => (
          <motion.div
            className="founder"
            key={f.name}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.85, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="f-img tint" data-hover>
              <img src={f.img} alt={f.name} />
            </div>
            <div>
              <h3 className="display">{f.name}</h3>
              <div className="f-role mono-label">
                <span className="tick">◆</span> {f.role}
              </div>
              <p>{f.bio}</p>
              <p className="f-alma">{f.alma}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.blockquote
        className="founders-quote"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-12%' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p>
          "Our team is dedicated to bringing your vision to life — and we'll go above
          and beyond to make your project a resounding success."
        </p>
      </motion.blockquote>
    </section>
  )
}
