import { createContext, useContext, useEffect, useState, useCallback } from 'react'

// Three full palettes — DOM side lives in CSS variables (global.css);
// this context feeds the same palette to the three.js canvases.
export const PALETTES = {
  ink: {
    low: [0.42, 0.33, 0.19], // bronze base of the gradient
    high: [0.96, 0.8, 0.5], // molten gold at the crown
    neighbor: 0.38, // brightness factor for background towers
    fog: '#0a0a0b',
    ground: '#57503f',
    particle: '#f0c87e',
    beacon: '#f0c87e',
    // finished-building facade: night tower, warm windows glowing
    facade: {
      glassTop: '#2b2519',
      glassBottom: '#14110c',
      mullion: 'rgba(240, 200, 126, 0.25)',
      win: ['#100e0a', '#171310', '#1d1812'],
      lit: '#f6cc85',
      litChance: 0.4,
      parapet: '#4a3d26',
      roof: '#161209',
      podium: '#262016',
    },
    additive: true,
    bloom: true,
  },
  blueprint: {
    low: [0.3, 0.45, 0.75],
    high: [0.82, 0.9, 1.0],
    neighbor: 0.45,
    fog: '#0b1d3d',
    ground: '#33507f',
    particle: '#cfe2ff',
    beacon: '#ffffff',
    // illuminated architectural model in blues
    facade: {
      glassTop: '#2a4d84',
      glassBottom: '#122543',
      mullion: 'rgba(156, 194, 255, 0.3)',
      win: ['#1b3660', '#16305c', '#203d6b'],
      lit: '#e4efff',
      litChance: 0.3,
      parapet: '#7899cc',
      roof: '#122543',
      podium: '#1d3763',
    },
    additive: true,
    bloom: true,
  },
  paper: {
    low: [0.36, 0.26, 0.11], // dark bronze ink on paper
    high: [0.62, 0.43, 0.12],
    neighbor: 0.55,
    fog: '#f3eee3',
    ground: '#b3a37c',
    particle: '#8a6a25',
    beacon: '#a4761f',
    // daylight render: soft sky-glass over warm stone
    facade: {
      glassTop: '#d8e0dc',
      glassBottom: '#a9bcc0',
      mullion: 'rgba(110, 92, 55, 0.35)',
      win: ['#c4d3d6', '#b8c9cd', '#cfdbdc'],
      lit: '#f9f4e3',
      litChance: 0.1,
      parapet: '#e7ddc5',
      roof: '#cfc3a4',
      podium: '#d9c9a2',
    },
    additive: false, // additive particles wash out on a light page
    bloom: false, // dark lines don't bloom — skip the pass
  },
}

const ORDER = ['ink', 'blueprint', 'paper']
export const NEXT_THEME = {
  ink: 'blueprint',
  blueprint: 'paper',
  paper: 'ink',
}

const ThemeContext = createContext({ theme: 'ink', palette: PALETTES.ink, toggle: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('paper')

  const toggle = useCallback(() => {
    setTheme((t) => NEXT_THEME[t] || ORDER[0])
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // press B anywhere (outside inputs) to cycle ink → blueprint → paper
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'b' && e.key !== 'B') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      toggle()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  return (
    <ThemeContext.Provider value={{ theme, palette: PALETTES[theme], toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
