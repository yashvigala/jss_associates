import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import {
  buildTower,
  mergeTower,
  buildNeighbors,
  buildCityGround,
  buildParticles,
} from './cityGeometry.js'
import { isSoftwareGL, useOnScreen } from './perf.js'

function Dust({ palette }) {
  const ref = useRef()
  const data = useMemo(() => buildParticles(300), [])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(data.positions.slice(), 3))
    return g
  }, [data])

  useFrame((_, delta) => {
    const attr = geom.attributes.position
    for (let i = 0; i < data.count; i++) {
      let y = attr.getY(i) + data.speeds[i] * delta
      if (y > 9) y = 0
      attr.setY(i, y)
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        color={palette.particle}
        size={0.035}
        sizeAttenuation
        transparent
        opacity={palette.additive ? 0.55 : 0.4}
        blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

function City({ palette, scrollP }) {
  const group = useRef()
  const towerMat = useRef()
  const nbrMat = useRef()
  const groundMat = useRef()
  const vel = useRef(0)
  const dragging = useRef(false)
  const pointer = useRef({ x: 0, y: 0 })
  const { gl, size } = useThree()

  const { towerGeom, nbrGeom, groundGeom } = useMemo(() => {
    const t = buildTower(palette)
    const merged = mergeTower(t)
    const towerGeom = new THREE.BufferGeometry()
    towerGeom.setAttribute('position', new THREE.BufferAttribute(merged.positions, 3))
    towerGeom.setAttribute('color', new THREE.BufferAttribute(merged.colors, 3))
    const n = buildNeighbors(palette)
    const nbrGeom = new THREE.BufferGeometry()
    nbrGeom.setAttribute('position', new THREE.BufferAttribute(n.positions, 3))
    nbrGeom.setAttribute('color', new THREE.BufferAttribute(n.colors, 3))
    const g = buildCityGround()
    const groundGeom = new THREE.BufferGeometry()
    groundGeom.setAttribute('position', new THREE.BufferAttribute(g.positions, 3))
    return { towerGeom, nbrGeom, groundGeom }
  }, [palette])

  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'pan-y' // let vertical touch scroll pass through
    let lastX = 0

    const down = (e) => {
      dragging.current = true
      lastX = e.clientX
    }
    const move = (e) => {
      if (!dragging.current || !group.current) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      group.current.rotation.y += dx * 0.006
      vel.current = dx * 0.006
    }
    const up = () => {
      dragging.current = false
    }
    const hover = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('mousemove', hover, { passive: true })
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('mousemove', hover)
    }
  }, [gl])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const sp = scrollP?.get?.() ?? 0

    if (!dragging.current) {
      g.rotation.y += vel.current + 0.0011
      vel.current *= Math.pow(0.06, delta) // frame-rate independent decay
    }
    g.position.y = Math.sin(t * 0.45) * 0.06 - 0.1

    // entrance fade
    const fade = Math.min(1, t / 1.6)
    if (towerMat.current) towerMat.current.opacity = fade * 0.92
    if (nbrMat.current) nbrMat.current.opacity = fade * 0.6
    if (groundMat.current) groundMat.current.opacity = fade * 0.16

    // camera: parallax + cinematic pull-up as the hero scrolls away
    const cam = state.camera
    const px = pointer.current.x
    const py = pointer.current.y
    const targX = 7.8 + px * 0.6
    const targY = 4.4 - py * 0.5 + sp * 4.2
    cam.position.x += (targX - cam.position.x) * 0.04
    cam.position.y += (targY - cam.position.y) * 0.06
    cam.lookAt(1.0, 2.6 - sp * 2.2, 0)
  })

  const narrow = size.width < 780

  return (
    <group
      ref={group}
      position={[narrow ? 0.6 : 2.1, -0.1, 0]}
      scale={narrow ? 0.72 : 0.95}
      rotation={[0, 0.5, 0]}
    >
      <lineSegments geometry={towerGeom}>
        <lineBasicMaterial ref={towerMat} vertexColors transparent opacity={0} toneMapped={false} />
      </lineSegments>
      <lineSegments geometry={nbrGeom}>
        <lineBasicMaterial ref={nbrMat} vertexColors transparent opacity={0} toneMapped={false} />
      </lineSegments>
      <lineSegments geometry={groundGeom}>
        <lineBasicMaterial
          ref={groundMat}
          color={palette.ground}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </lineSegments>
      <Dust palette={palette} />
    </group>
  )
}

export default function HeroCanvas({ palette, scrollP }) {
  const wrapRef = useRef(null)
  const soft = useMemo(() => isSoftwareGL(), [])
  const onScreen = useOnScreen(wrapRef)

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        className="hero-canvas-inner"
        dpr={soft ? [0.55, 0.7] : [1, 1.75]}
        frameloop={onScreen ? 'always' : 'never'}
        camera={{ position: [7.8, 4.4, 11.6], fov: 35 }}
        gl={{ antialias: !soft, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={[palette.fog, 12, 28]} />
        <City palette={palette} scrollP={scrollP} />
        {!soft && palette.bloom && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.85}
              luminanceThreshold={0.18}
              luminanceSmoothing={0.85}
              mipmapBlur
              radius={0.72}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
