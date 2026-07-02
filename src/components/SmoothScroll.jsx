import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'

const LenisContext = createContext(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function SmoothScroll({ children }) {
  const lenisRef = useRef(null)

  // Create strictly inside the effect: StrictMode/HMR remounts otherwise
  // leave a zombie instance that swallows wheel events with no raf driving it.
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.92,
      smoothWheel: true,
      autoRaf: true,
    })
    lenisRef.current = lenis
    if (import.meta.env.DEV) window.__lenis = lenis
    return () => {
      lenis.destroy()
      if (lenisRef.current === lenis) lenisRef.current = null
    }
  }, [])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}
