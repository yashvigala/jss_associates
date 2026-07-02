import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Magnetic from './Magnetic.jsx'
import { useLenis } from './SmoothScroll.jsx'
import { CONTACT } from '../data/site.js'

function MumbaiClock() {
  const [now, setNow] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="clock">{now} IST</span>
}

export default function SectionContact() {
  const lenisRef = useLenis()

  return (
    <section className="section contact" id="contact">
      <div className="section-head">
        <span className="mono-label">
          <span className="tick">08</span> — Say hello
        </span>
        <span className="mono-label">{CONTACT.coords}</span>
      </div>

      <motion.h2
        className="display contact-big"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-12%' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        Let's draw something <span className="accent-i">permanent</span>.
      </motion.h2>

      <div className="contact-row">
        <Magnetic strength={0.45}>
          <a
            className="btn btn-solid"
            href={`mailto:${CONTACT.email}?subject=New project — let's talk`}
          >
            Start a project →
          </a>
        </Magnetic>
        <span className="or">or write to</span>
        <a className="btn" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </a>
      </div>

      <div className="contact-cols">
        <div className="c-col">
          <span className="mono-label">
            <span className="tick">◆</span> Studio
          </span>
          <p>
            {CONTACT.address.map((l) => (
              <span key={l}>
                {l}
                <br />
              </span>
            ))}
          </p>
        </div>
        <div className="c-col">
          <span className="mono-label">
            <span className="tick">◆</span> Call
          </span>
          <p>
            {CONTACT.phones.map((ph) => (
              <span key={ph}>
                <a href={`tel:${ph.replace(/\s/g, '')}`}>{ph}</a>
                <br />
              </span>
            ))}
          </p>
        </div>
        <div className="c-col">
          <span className="mono-label">
            <span className="tick">◆</span> Mail
          </span>
          <p>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </p>
        </div>
        <div className="c-col">
          <span className="mono-label">
            <span className="tick">◆</span> Studio time
          </span>
          <p>
            <MumbaiClock />
            <br />
            Mumbai, in the room by 10.
          </p>
        </div>
      </div>

      <div className="footer-bar">
        <span>© 2026 JSS + Associates</span>
        <span>Architecture · Interiors · Real Estate</span>
        <button onClick={() => lenisRef?.current?.scrollTo(0, { duration: 2 })}>
          Back to the top ↑
        </button>
      </div>
    </section>
  )
}
