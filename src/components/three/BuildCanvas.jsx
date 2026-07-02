import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { buildTower, buildSolids } from './cityGeometry.js'
import { isSoftwareGL, useOnScreen } from './perf.js'

const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
const clamp01 = (x) => Math.min(1, Math.max(0, x))

function ConstructionTower({ progress, palette }) {
  const tower = useMemo(() => buildTower(palette), [palette])
  const solids = useMemo(() => buildSolids(), [])
  // origin at the base so the finished volume can grow out of the ground
  const solidGeoms = useMemo(
    () =>
      solids.map((b) => {
        const g = new THREE.BoxGeometry(b.w, b.h, b.d)
        g.translate(0, b.h / 2, 0)
        return g
      }),
    [solids]
  )
  const levelRefs = useRef([])
  const solidRefs = useRef([])
  const baseRef = useRef()
  const crownRef = useRef()
  const beaconRef = useRef()
  const smooth = useRef(0)

  const geoms = useMemo(() => {
    const make = (positions, colors) => {
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      if (colors) g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      return g
    }
    return {
      levels: tower.levels.map((l) => make(l.positions, l.colors)),
      base: make(tower.base.positions, tower.base.colors),
      crown: make(tower.crown.positions, tower.crown.colors),
      ground: make(tower.ground.positions),
    }
  }, [tower])

  useFrame((state) => {
    const target = progress?.get?.() ?? 0
    smooth.current += (target - smooth.current) * 0.09
    const p = smooth.current
    const t = state.clock.elapsedTime

    // podium rises first
    if (baseRef.current) {
      const local = easeOutCubic(clamp01((p - 0.02) / 0.06))
      baseRef.current.material.opacity = local * 0.9
      baseRef.current.visible = local > 0.001
    }

    // floors stack, crane-dropped from above — wireframe done by ~0.70
    const N = tower.levels.length
    for (let i = 0; i < N; i++) {
      const obj = levelRefs.current[i]
      if (!obj) continue
      const start = 0.05 + (0.57 * i) / N
      const local = clamp01((p - start) / 0.08)
      const e = easeOutCubic(local)
      obj.visible = local > 0.001
      obj.material.opacity = e * 0.92
      obj.position.y = (1 - e) * 1.7
    }

    // crown lands
    if (crownRef.current) {
      const local = easeOutCubic(clamp01((p - 0.7) / 0.07))
      crownRef.current.visible = local > 0.001
      crownRef.current.material.opacity = local * 0.95
      crownRef.current.position.y = (1 - local) * 1.2
    }

    // handover — the finished volume rises through the wireframe,
    // ground to crown, fully solid by 0.90 so it holds while pinned
    const solidOn = easeOutCubic(clamp01((p - 0.76) / 0.14))
    for (const m of solidRefs.current) {
      if (!m) continue
      m.visible = solidOn > 0.001
      m.scale.y = Math.max(solidOn, 0.0001)
      m.material.opacity = Math.min(1, solidOn * 2.5) * 0.97
    }

    // beacon tops it off
    if (beaconRef.current) {
      const on = clamp01((p - 0.88) / 0.05)
      beaconRef.current.material.opacity = on * (0.55 + 0.45 * Math.sin(t * 2.6))
      const s = 1 + 0.25 * Math.sin(t * 2.6)
      beaconRef.current.scale.setScalar(s)
    }

    // camera choreography — rises and orbits with the build
    const theta = -0.55 + p * 2.35
    const radius = 11.2 - p * 3.1
    const cam = state.camera
    cam.position.set(Math.sin(theta) * radius, 1.15 + p * 5.6, Math.cos(theta) * radius)
    cam.lookAt(0, 0.7 + p * 2.7, 0)
  })

  const [mx, my, mz] = tower.crown.mast

  return (
    <group position={[0, -0.4, 0]}>
      <lineSegments geometry={geoms.ground}>
        <lineBasicMaterial color={palette.ground} transparent opacity={0.2} toneMapped={false} />
      </lineSegments>
      <lineSegments ref={baseRef} geometry={geoms.base} visible={false}>
        <lineBasicMaterial vertexColors transparent opacity={0} toneMapped={false} />
      </lineSegments>
      {geoms.levels.map((g, i) => (
        <lineSegments
          key={i}
          ref={(el) => (levelRefs.current[i] = el)}
          geometry={g}
          visible={false}
        >
          <lineBasicMaterial vertexColors transparent opacity={0} toneMapped={false} />
        </lineSegments>
      ))}
      <lineSegments ref={crownRef} geometry={geoms.crown} visible={false}>
        <lineBasicMaterial vertexColors transparent opacity={0} toneMapped={false} />
      </lineSegments>
      <mesh ref={beaconRef} position={[mx, my, mz]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color={palette.beacon} transparent opacity={0} toneMapped={false} />
      </mesh>
      {solids.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => (solidRefs.current[i] = el)}
          geometry={solidGeoms[i]}
          position={[b.cx, 0, b.cz]}
          visible={false}
        >
          <meshLambertMaterial
            color={palette.solid}
            transparent
            opacity={0}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function BuildCanvas({ progress, palette }) {
  const wrapRef = useRef(null)
  const soft = useMemo(() => isSoftwareGL(), [])
  const onScreen = useOnScreen(wrapRef)

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        dpr={soft ? [0.55, 0.7] : [1, 1.75]}
        frameloop={onScreen ? 'always' : 'never'}
        camera={{ position: [6, 2, 9], fov: 40 }}
        gl={{ antialias: !soft, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={[palette.fog, 11, 24]} />
        <hemisphereLight args={['#ffffff', palette.fog, 0.95]} />
        <directionalLight position={[6, 9, 4]} intensity={0.85} />
        <ConstructionTower progress={progress} palette={palette} />
      </Canvas>
    </div>
  )
}
