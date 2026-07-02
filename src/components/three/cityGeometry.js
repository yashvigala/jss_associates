// Procedural wireframe city — a central twin-wing JSS tower surrounded by a
// dimmer skyline. Everything is line segments, colors baked per-palette so
// blueprint mode can rebuild the whole city in cyanotype.

const FH = 0.34 // floor height

const WINGS = [
  { x0: -1.7, x1: -0.05, z0: -0.95, z1: 0.95, floors: 22 },
  { x0: 0.1, x1: 1.55, z0: -0.75, z1: 1.15, floors: 17 },
]

export const LEVELS = 22
export const TOWER_HEIGHT = LEVELS * FH

// fixed ring of background towers (deterministic — survives theme rebuilds)
const NEIGHBORS = [
  { x: -5.2, z: -2.5, w: 1.3, d: 1.3, floors: 9 },
  { x: -4.1, z: 2.4, w: 1.6, d: 1.2, floors: 6 },
  { x: 4.6, z: -1.9, w: 1.4, d: 1.4, floors: 11 },
  { x: 5.5, z: 2.7, w: 1.2, d: 1.6, floors: 7 },
  { x: -7.0, z: 0.6, w: 1.5, d: 1.5, floors: 13 },
  { x: 7.2, z: 0.1, w: 1.3, d: 1.3, floors: 8 },
  { x: 0.5, z: -4.8, w: 1.8, d: 1.2, floors: 5 },
  { x: -2.7, z: 4.6, w: 1.2, d: 1.2, floors: 10 },
  { x: 2.9, z: 5.0, w: 1.5, d: 1.1, floors: 6 },
  { x: -1.9, z: -5.6, w: 1.2, d: 1.5, floors: 12 },
  { x: 8.6, z: -3.4, w: 1.4, d: 1.2, floors: 10 },
  { x: -8.7, z: -3.0, w: 1.3, d: 1.4, floors: 7 },
]

function makeColorAt(low, high, maxH, dim = 1) {
  return (y) => {
    const t = Math.min(1, Math.max(0, y / maxH))
    const e = 0.25 + 0.75 * t
    return [
      (low[0] + (high[0] - low[0]) * e) * dim,
      (low[1] + (high[1] - low[1]) * e) * dim,
      (low[2] + (high[2] - low[2]) * e) * dim,
    ]
  }
}

function segPusher(pos, col, colorAt) {
  return (ax, ay, az, bx, by, bz) => {
    pos.push(ax, ay, az, bx, by, bz)
    const ca = colorAt(ay)
    const cb = colorAt(by)
    col.push(ca[0], ca[1], ca[2], cb[0], cb[1], cb[2])
  }
}

function rect(push, x0, z0, x1, z1, y) {
  push(x0, y, z0, x1, y, z0)
  push(x1, y, z0, x1, y, z1)
  push(x1, y, z1, x0, y, z1)
  push(x0, y, z1, x0, y, z0)
}

// ——— the JSS tower, split by floor so the build sequence can stack it ———
export function buildTower(palette) {
  const colorAt = makeColorAt(palette.low, palette.high, TOWER_HEIGHT)
  const levels = []

  for (let i = 0; i < LEVELS; i++) {
    const pos = []
    const col = []
    const push = segPusher(pos, col, colorAt)
    const y0 = i * FH
    const y1 = y0 + FH

    for (const w of WINGS) {
      if (i >= w.floors) continue
      rect(push, w.x0, w.z0, w.x1, w.z1, y1)
      push(w.x0, y0, w.z0, w.x0, y1, w.z0)
      push(w.x1, y0, w.z0, w.x1, y1, w.z0)
      push(w.x1, y0, w.z1, w.x1, y1, w.z1)
      push(w.x0, y0, w.z1, w.x0, y1, w.z1)
      const mw = (w.x1 - w.x0) / 3
      push(w.x0 + mw, y0, w.z1, w.x0 + mw, y1, w.z1)
      push(w.x0 + 2 * mw, y0, w.z1, w.x0 + 2 * mw, y1, w.z1)
      const mz = (w.z1 - w.z0) / 2
      push(w.x1, y0, w.z0 + mz, w.x1, y1, w.z0 + mz)
      if (i % 2 === 1) {
        const bx = w.x0 + mw * 0.5
        push(bx, y1, w.z1, bx, y1, w.z1 + 0.16)
        push(bx, y1, w.z1 + 0.16, bx + mw, y1, w.z1 + 0.16)
        push(bx + mw, y1, w.z1 + 0.16, bx + mw, y1, w.z1)
      }
    }

    levels.push({
      y: y0,
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    })
  }

  // podium
  const bpos = []
  const bcol = []
  const bpush = segPusher(bpos, bcol, colorAt)
  const P = { x0: -2.15, x1: 2.0, z0: -1.35, z1: 1.55 }
  rect(bpush, P.x0, P.z0, P.x1, P.z1, 0.02)
  rect(bpush, P.x0, P.z0, P.x1, P.z1, FH * 1.6)
  for (const [cx, cz] of [
    [P.x0, P.z0],
    [P.x1, P.z0],
    [P.x1, P.z1],
    [P.x0, P.z1],
  ]) {
    bpush(cx, 0.02, cz, cx, FH * 1.6, cz)
  }
  for (let k = 1; k < 8; k++) {
    const cx = P.x0 + ((P.x1 - P.x0) / 8) * k
    bpush(cx, 0.02, P.z1, cx, FH * 1.6, P.z1)
  }
  const base = {
    positions: new Float32Array(bpos),
    colors: new Float32Array(bcol),
  }

  // crown — parapet + mast on the taller wing
  const cpos = []
  const ccol = []
  const cpush = segPusher(cpos, ccol, colorAt)
  const A = WINGS[0]
  const topY = A.floors * FH
  const inset = 0.18
  rect(cpush, A.x0 + inset, A.z0 + inset, A.x1 - inset, A.z1 - inset, topY + 0.14)
  cpush(A.x0 + inset, topY + 0.14, A.z0 + inset, A.x1 - inset, topY + 0.14, A.z1 - inset)
  cpush(A.x1 - inset, topY + 0.14, A.z0 + inset, A.x0 + inset, topY + 0.14, A.z1 - inset)
  const mx = (A.x0 + A.x1) / 2
  const mz = (A.z0 + A.z1) / 2
  cpush(mx, topY + 0.14, mz, mx, topY + 0.85, mz)
  const B = WINGS[1]
  const topB = B.floors * FH
  rect(cpush, B.x0 + inset, B.z0 + inset, B.x1 - inset, B.z1 - inset, topB + 0.12)
  const crown = {
    positions: new Float32Array(cpos),
    colors: new Float32Array(ccol),
    mast: [mx, topY + 0.85, mz],
  }

  // street grid
  const gpos = []
  const EXT = 7.5
  const STEP = 1.25
  for (let v = -EXT; v <= EXT + 0.01; v += STEP) {
    gpos.push(-EXT, 0, v, EXT, 0, v)
    gpos.push(v, 0, -EXT, v, 0, EXT)
  }
  const ground = { positions: new Float32Array(gpos) }

  return { levels, base, crown, ground }
}

export function mergeTower(t) {
  const posArrays = [t.base.positions, t.crown.positions, ...t.levels.map((l) => l.positions)]
  const colArrays = [t.base.colors, t.crown.colors, ...t.levels.map((l) => l.colors)]
  let n = 0
  for (const a of posArrays) n += a.length
  const positions = new Float32Array(n)
  const colors = new Float32Array(n)
  let o = 0
  for (let i = 0; i < posArrays.length; i++) {
    positions.set(posArrays[i], o)
    colors.set(colArrays[i], o)
    o += posArrays[i].length
  }
  return { positions, colors }
}

// ——— background skyline for the hero ———
export function buildNeighbors(palette) {
  const pos = []
  const col = []

  for (const n of NEIGHBORS) {
    const h = n.floors * FH
    const colorAt = makeColorAt(palette.low, palette.high, h, palette.neighbor)
    const push = segPusher(pos, col, colorAt)
    const x0 = n.x - n.w / 2
    const x1 = n.x + n.w / 2
    const z0 = n.z - n.d / 2
    const z1 = n.z + n.d / 2
    // corners
    push(x0, 0, z0, x0, h, z0)
    push(x1, 0, z0, x1, h, z0)
    push(x1, 0, z1, x1, h, z1)
    push(x0, 0, z1, x0, h, z1)
    // slabs every third floor + roof
    for (let f = 3; f < n.floors; f += 3) {
      rect(push, x0, z0, x1, z1, f * FH)
    }
    rect(push, x0, z0, x1, z1, h)
  }

  return {
    positions: new Float32Array(pos),
    colors: new Float32Array(col),
  }
}

// wider street grid for the hero city
export function buildCityGround() {
  const gpos = []
  const EXT = 12
  const STEP = 1.25
  for (let v = -EXT; v <= EXT + 0.01; v += STEP) {
    gpos.push(-EXT, 0, v, EXT, 0, v)
    gpos.push(v, 0, -EXT, v, 0, EXT)
  }
  return { positions: new Float32Array(gpos) }
}

// slow-rising construction dust for the hero
export function buildParticles(count = 320) {
  const positions = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  let seed = 42
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * 20
    positions[i * 3 + 1] = rand() * 9
    positions[i * 3 + 2] = (rand() - 0.5) * 20
    speeds[i] = 0.12 + rand() * 0.35
  }
  return { positions, speeds, count }
}
