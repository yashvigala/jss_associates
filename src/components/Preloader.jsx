import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS = [
  'clearing the plot',
  'laying foundations',
  'pouring floor 12 of 22',
  'threading the gold line',
  'snagging the punch-list',
  'cutting the ribbon',
]

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    document.body.classList.add('is-loading')
    let value = 0
    let cancelled = false
    const tick = () => {
      if (cancelled) return
      value += Math.random() * 16 + 6
      if (value >= 100) {
        setCount(100)
        setTimeout(() => !cancelled && setGone(true), 350)
        setTimeout(() => {
          if (cancelled) return
          document.body.classList.remove('is-loading')
          onDone?.()
        }, 900)
        return
      }
      setCount(Math.floor(value))
      setTimeout(tick, 110 + Math.random() * 90)
    }
    const t = setTimeout(tick, 200)
    return () => {
      cancelled = true
      clearTimeout(t)
      document.body.classList.remove('is-loading')
    }
  }, [onDone])

  const statusIdx = Math.min(STATUS.length - 1, Math.floor((count / 100) * STATUS.length))

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.div
            className="pl-word"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }}
          >
            JSS <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>+</em> Associates
          </motion.div>
          <div className="pl-line">
            <motion.span style={{ scaleX: count / 100 }} />
          </div>
          <div className="pl-count">{String(count).padStart(3, '0')} %</div>
          <div className="pl-status">{STATUS[statusIdx]}…</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
