import { useEffect, useState } from 'react'

// Detect software WebGL (SwiftShader / llvmpipe) so we can shed the bloom
// pass and drop resolution instead of freezing the tab.
let cached = null
export function isSoftwareGL() {
  if (cached !== null) return cached
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    if (!gl) {
      cached = true
      return cached
    }
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info
      ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER)
    cached = /swiftshader|llvmpipe|software|basic render/i.test(String(renderer))
  } catch {
    cached = true
  }
  return cached
}

// Only run a canvas's render loop while it is actually on screen.
export function useOnScreen(ref, margin = '120px') {
  const [vis, setVis] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting), {
      rootMargin: margin,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin])
  return vis
}
