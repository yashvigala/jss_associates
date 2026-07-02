import { motion } from 'framer-motion'
import { useLenis } from './SmoothScroll.jsx'
import { useTheme, NEXT_THEME } from '../context/Theme.jsx'
import Magnetic from './Magnetic.jsx'
import { CONTACT } from '../data/site.js'

const LINKS = [
  ['Studio', '#studio'],
  ['Process', '#process'],
  ['Services', '#services'],
  ['Work', '#work'],
  ['People', '#people'],
]

function RollLink({ label, hash, onGo }) {
  return (
    <a className="roll-link" href={hash} onClick={(e) => onGo(e, hash)}>
      <span className="rl a">{label}</span>
      <span className="rl b" aria-hidden="true">
        {label}
      </span>
    </a>
  )
}

export default function Nav({ ready }) {
  const lenisRef = useLenis()
  const { theme, toggle } = useTheme()

  const go = (e, hash) => {
    e.preventDefault()
    lenisRef?.current?.scrollTo(hash, { offset: 0, duration: 1.6 })
  }

  return (
    <motion.nav
      className="nav"
      initial={{ y: -24, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
    >
      <a href="#top" className="logo" onClick={(e) => go(e, 0)}>
        JSS<em>+</em>Associates
      </a>
      <div className="nav-links">
        {LINKS.map(([label, hash]) => (
          <RollLink key={hash} label={label} hash={hash} onGo={go} />
        ))}
        <button
          className="bp-toggle"
          onClick={toggle}
          title="Cycle theme: ink → blueprint → paper (B)"
        >
          <span className="sw" aria-hidden="true" />
          {NEXT_THEME[theme]}
          <span className="key">· B</span>
        </button>
        <Magnetic strength={0.35}>
          <a
            className="nav-cta"
            href={`mailto:${CONTACT.email}?subject=New project — via jssassociates.site`}
          >
            Start a project
          </a>
        </Magnetic>
      </div>
    </motion.nav>
  )
}
