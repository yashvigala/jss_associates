import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { buildTower, solidSpecs } from './cityGeometry.js'
import { isSoftwareGL, useOnScreen } from './perf.js'

const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3)
const clamp01 = (x) => Math.min(1, Math.max(0, x))

// Procedural curtain-wall: a canvas texture of glass + window grid, seeded so
// the lit-window pattern is stable across theme rebuilds.
function makeFacadeTexture(f, floors, bays) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = Math.min(2048, 48 * floors)
  const ctx = c.getContext('2d')

  const g = ctx.createLinearGradient(0, 0, 0, c.height)
  g.addColorStop(0, f.glassTop)
  g.addColorStop(1, f.glassBottom)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, c.width, c.height)

  let seed = 20260702
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  const cw = c.width / bays
  const ch = c.height / floors
  for (let r = 0; r < floors; r++) {
    for (let col = 0; col < bays; col++) {
      const x = col * cw
      const y = r * ch
      const lit = rnd() < f.litChance
      ctx.fillStyle = lit ? f.lit : f.win[Math.floor(rnd() * f.win.length)]
      ctx.globalAlpha = lit ? 0.72 + rnd() * 0.28 : 0.92
      ctx.fillRect(x + cw * 0.12, y + ch * 0.16, cw * 0.76, ch * 0.62)
      ctx.globalAlpha = 1
    }
  }

  // mullion grid over the panes
  ctx.strokeStyle = f.mullion
  ctx.lineWidth = 2
  for (let col = 1; col < bays; col++) {
    ctx.beginPath()
    ctx.moveTo(col * cw, 0)
    ctx.lineTo(col * cw, c.height)
    ctx.stroke()
  }
  for (let r = 0; r <= floors; r++) {
    ctx.beginPath()
    ctx.moveTo(0, r * ch)
    ctx.lineTo(c.width, r * ch)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function ConstructionTower({ progress, palette }) {
  const tower = useMemo(() => buildTower(palette), [palette])
  const levelRefs = useRef([])
  const baseRef = useRef()
  const crownRef = useRef()
  const beaconRef = useRef()
  const solidGroup = useRef()
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

  // The finished building: glass wings with window grids, parapet caps,
  // rooftop plant room, podium with cornice. All transparent-0 until handover.
  const solid = useMemo(() => {
    const f = palette.facade
    const specs = solidSpecs()
    const mats = []
    const items = []

    const lambert = (opts) => {
      const m = new THREE.MeshLambertMaterial({
        transparent: true,
        opacity: 0,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        ...opts,
      })
      mats.push(m)
      return m
    }

    const roofMat = lambert({ color: f.roof })

    for (const w of specs.wings) {
      const tex = makeFacadeTexture(f, w.floors, 4)
      const side = lambert({ map: tex })
      // box faces: +x, -x, +y, -y, +z, -z
      const wingMats = [side, side, roofMat, roofMat, side, side]
      items.push({
        geo: new THREE.BoxGeometry(w.x1 - w.x0, w.h, w.z1 - w.z0),
        mat: wingMats,
        pos: [(w.x0 + w.x1) / 2, w.h / 2, (w.z0 + w.z1) / 2],
      })
      // parapet cap
      items.push({
        geo: new THREE.BoxGeometry(w.x1 - w.x0 + 0.12, 0.07, w.z1 - w.z0 + 0.12),
        mat: lambert({ color: f.parapet }),
        pos: [(w.x0 + w.x1) / 2, w.h + 0.035, (w.z0 + w.z1) / 2],
      })
    }

    // rooftop plant room on the taller wing
    const A = specs.wings[0]
    items.push({
      geo: new THREE.BoxGeometry(0.6, 0.22, 0.5),
      mat: roofMat,
      pos: [(A.x0 + A.x1) / 2, A.h + 0.18, (A.z0 + A.z1) / 2],
    })

    // podium + cornice
    const P = specs.podium
    items.push({
      geo: new THREE.BoxGeometry(P.x1 - P.x0, P.h, P.z1 - P.z0),
      mat: lambert({ color: f.podium }),
      pos: [(P.x0 + P.x1) / 2, P.h / 2, (P.z0 + P.z1) / 2],
    })
    items.push({
      geo: new THREE.BoxGeometry(P.x1 - P.x0 + 0.14, 0.06, P.z1 - P.z0 + 0.14),
      mat: lambert({ color: f.parapet }),
      pos: [(P.x0 + P.x1) / 2, P.h + 0.03, (P.z0 + P.z1) / 2],
    })

    return { items, mats }
  }, [palette])

  useEffect(
    () => () => {
      solid.items.forEach((it) => it.geo.dispose())
      solid.mats.forEach((m) => {
        if (m.map) m.map.dispose()
        m.dispose()
      })
    },
    [solid]
  )

  useFrame((state) => {
    const target = progress?.get?.() ?? 0
    smooth.current += (target - smooth.current) * 0.09
    const p = smooth.current
    const t = state.clock.elapsedTime

    // handover — the finished building rises through the wireframe,
    // ground to crown, fully solid by 0.90 so it holds while pinned
    const solidOn = easeOutCubic(clamp01((p - 0.76) / 0.14))
    // the drawing recedes as the building becomes real
    const dim = 1 - 0.62 * solidOn

    // podium wireframe rises first
    if (baseRef.current) {
      const local = easeOutCubic(clamp01((p - 0.02) / 0.06))
      baseRef.current.material.opacity = local * 0.9 * dim
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
      obj.material.opacity = e * 0.92 * dim
      obj.position.y = (1 - e) * 1.7
    }

    // crown lands
    if (crownRef.current) {
      const local = easeOutCubic(clamp01((p - 0.7) / 0.07))
      crownRef.current.visible = local > 0.001
      crownRef.current.material.opacity = local * 0.95 * dim
      crownRef.current.position.y = (1 - local) * 1.2
    }

    // the real building grows out of the ground
    const sg = solidGroup.current
    if (sg) {
      sg.visible = solidOn > 0.001
      sg.scale.y = Math.max(solidOn, 0.0001)
      const op = Math.min(1, solidOn * 2.2) * 0.98
      for (const m of solid.mats) m.opacity = op
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
      <group ref={solidGroup} visible={false} scale={[1, 0.0001, 1]}>
        {solid.items.map((it, i) => (
          <mesh key={i} geometry={it.geo} material={it.mat} position={it.pos} />
        ))}
      </group>
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
