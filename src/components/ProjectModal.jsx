import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLenis } from './SmoothScroll.jsx'

export default function ProjectModal({ project, onClose }) {
  const lenisRef = useLenis()

  useEffect(() => {
    document.body.classList.add('modal-open')
    lenisRef?.current?.stop()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('modal-open')
      lenisRef?.current?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [lenisRef, onClose])

  const facts = [
    ['Location', project.location],
    ['Typology', project.typology],
    ['Scale', project.scale],
    ['Status', project.status],
    ['Framework', project.reg],
    ['Client', project.client],
  ]

  return (
    <motion.div
      className="pm-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <button className="pm-close" onClick={onClose}>
        Close ✕
      </button>
      <motion.div
        className="pm-inner"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pm-head">
          <span className="mono-label">
            <span className="tick">◆</span> {project.tag}
          </span>
          <h3 className="display">{project.title}</h3>
          <div className="pm-client mono-label">for {project.client}</div>
        </div>

        <div className="pm-facts">
          {facts.map(([k, v]) => (
            <div className="pm-fact" key={k}>
              <span className="mono-label">
                <span className="tick">◆</span> {k}
              </span>
              <div className="v">{v}</div>
            </div>
          ))}
        </div>

        <p className="pm-body">{project.blurb}</p>

        <div className="pm-gallery">
          {project.gallery.map((src, i) => (
            <motion.div
              className="pm-shot tint"
              key={src}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={src} alt={`${project.title} — view ${i + 1}`} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
