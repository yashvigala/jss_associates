import { motion } from 'framer-motion'
import { CAREERS, CONTACT } from '../data/site.js'

export default function SectionCareers() {
  return (
    <section className="section" id="careers">
      <div className="section-head">
        <span className="mono-label">
          <span className="tick">07</span> — Join the table
        </span>
        <span className="mono-label">studio + site, from day one</span>
      </div>

      <div className="careers-wrap">
        <motion.div
          className="careers-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mono-label">
            <span className="tick">◆</span> Now hiring
          </span>
          <h3>
            {CAREERS.title} <span className="accent-i">({CAREERS.years})</span>
          </h3>
          <p>{CAREERS.intro}</p>
          <ul className="careers-list">
            {CAREERS.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
          <a
            className="btn btn-solid"
            href={`mailto:${CONTACT.email}?subject=Junior Architect application`}
          >
            Apply via mail →
          </a>
        </motion.div>

        <motion.div
          className="tools-col"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <h4>The toolkit we live in</h4>
          {CAREERS.tools.map((t) => (
            <div className="tool-row" key={t.name}>
              <span className="t-name">{t.name}</span>
              <span className={`t-tier ${t.tier === 'essential' ? 'essential' : ''}`}>
                {t.tier}
              </span>
            </div>
          ))}
          <p className="tools-note">{CAREERS.note}</p>
        </motion.div>
      </div>
    </section>
  )
}
