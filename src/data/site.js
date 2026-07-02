// All copy sourced from the JSS+Associates studio profile (2026).

// Public assets must respect Vite's base path (GitHub Pages serves the site
// from /jss_associates/), so never hard-code root-absolute image URLs.
const IMG = import.meta.env.BASE_URL + 'images/'

export const CONTACT = {
  email: 'jssplus.associates@gmail.com',
  phones: ['+91 98702 56379', '+91 99208 13136'],
  address: ['E/413, Zee Corporate Park', 'Vile Parle East', 'Mumbai 400 057'],
  coords: '19.0989° N / 72.8474° E',
}

export const ARCH_PROJECTS = [
  {
    id: 'girnar',
    title: 'Girnar Residency',
    client: 'Nidhaan Realty',
    tag: 'Architecture',
    location: 'Andheri East, Mumbai',
    typology: 'Mid-luxury residential',
    scale: '2 wings × 18 floors · 1.5-acre green-field',
    status: 'Phase 1 complete · Phase 2 rising',
    reg: 'AR Policy — Reg. 17, DCPR 2034',
    blurb:
      'A 1.5-acre green-field development with two residential wings of eighteen floors each — the studio’s proof that mid-luxury can still feel generous: light-first plans, working balconies, and a podium that gives the street something back.',
    gallery: [IMG + 'girnar.jpg', IMG + 'girnar-2.jpg', IMG + 'girnar-3.jpg'],
  },
  {
    id: 'shubh',
    title: 'Shubh CHS',
    client: 'Chheda Group',
    tag: 'Architecture',
    location: 'Borivali West, Mumbai',
    typology: 'High-end luxury apartments',
    scale: 'Mixed-use retail + 20-floor residential high-rise',
    status: 'In approvals',
    reg: 'Reg. 33(7)(B) & 33(20)(B), DCPR 2034',
    blurb:
      'A society redevelopment that trades a tired structure for a mixed-use showroom base and a twenty-floor residential tower — every existing member rehoused, every new square foot argued for through DCPR 2034.',
    gallery: [IMG + 'shubh.jpg', IMG + 'shubh-2.jpg'],
  },
  {
    id: 'fairfield',
    title: 'Fairfield by Marriott',
    client: 'JP Hospitality',
    tag: 'Hospitality',
    location: 'Malad West, Mumbai',
    typology: '4-star hotel',
    scale: '130 keys · banquets · rooftop restaurant',
    status: 'In approvals',
    reg: 'Green-field · TOD approach',
    blurb:
      'A transit-oriented green-field hotel: 130 keys stacked over banquets and meeting rooms, finished with a rooftop restaurant that borrows the skyline as décor.',
    gallery: [IMG + 'fairfield.jpg', IMG + 'fairfield-2.jpg'],
  },
  {
    id: 'serenity',
    title: 'Serenity Park',
    client: 'HarShail Group',
    tag: 'Architecture',
    location: 'Mulund East, Mumbai',
    typology: 'Affordable-luxury residential',
    scale: '2 towers × 21 floors · one-acre gated community',
    status: 'Construction commenced',
    reg: 'Reg. 30(A), DCPR 2034',
    blurb:
      'One acre, two twenty-one-floor towers and a gated ground plane that behaves like a park — affordable luxury where the amenity is the space between the buildings.',
    gallery: [IMG + 'serenity.jpg'],
  },
  {
    id: 'jp-tranquil',
    title: 'JP Tranquil',
    client: 'JP Group',
    tag: 'Architecture',
    location: 'Kandivali West, Mumbai',
    typology: 'Affordable residences',
    scale: '22 floors · green-field',
    status: 'Proposed',
    reg: 'AR Policy — Reg. 17, DCPR 2034',
    blurb:
      'A proposed twenty-two-floor green-field tower under the AR Policy — compact, honest homes drawn with the same pen as the luxury work.',
    gallery: [IMG + 'jp-tranquil.jpg'],
  },
]

export const INTERIOR_SHOTS = [
  { id: 'lh-1', img: IMG + 'login-hive.jpg', cap: 'Login Hive · Kandivali W' },
  { id: 'lh-2', img: IMG + 'login-hive-2.jpg', cap: 'Login Hive · 3BHK · 1100 sq.ft.' },
  { id: 'lh-3', img: IMG + 'login-hive-3.jpg', cap: 'Login Hive · handed over' },
  { id: 'bh-1', img: IMG + 'boho.jpg', cap: 'Boho House · Chembur' },
  { id: 'bh-2', img: IMG + 'boho-2.jpg', cap: 'Boho House · 1BHK · 400 sq.ft.' },
  { id: 'bh-3', img: IMG + 'boho-3.jpg', cap: 'Boho House · handed over' },
  { id: 'dt-1', img: IMG + 'dnt.jpg', cap: 'Drapes & Tassles · Dadar' },
  { id: 'dt-2', img: IMG + 'dnt-2.jpg', cap: 'D&T Showroom · 2400 sq.ft.' },
]

export const SERVICES = [
  {
    id: 'architecture',
    title: 'Architecture',
    desc: 'Green-field towers · redevelopment · hospitality',
    img: IMG + 'fairfield-2.jpg',
    chips: ['Green-field development', 'Society redevelopment', 'Hospitality', 'Fluent in DCPR 2034', 'Concept → working drawings'],
  },
  {
    id: 'interiors',
    title: 'Interior Design',
    desc: 'Homes & showrooms, inside-out',
    img: IMG + 'login-hive-2.jpg',
    chips: ['Residential interiors', 'Retail & showrooms', '400 sq.ft. to 2,400 sq.ft.', 'Design to handover'],
  },
  {
    id: 'realestate',
    title: 'Real Estate',
    desc: 'Feasibility · approvals · advisory',
    img: IMG + 'girnar-2.jpg',
    chips: ['Feasibility studies', 'Approvals & liaison', 'Development advisory', 'Plot to permission'],
  },
]

export const PHASES = [
  {
    num: '01',
    title: 'Collaborative process',
    body: 'Clients, consultants and the studio at one table — a shared vision locked in before a single line is committed.',
  },
  {
    num: '02',
    title: 'Inside-out design',
    body: 'Every project is treated as an anatomy of the built environment — balanced from plan to façade, aesthetics to everyday function.',
  },
  {
    num: '03',
    title: 'Detailing & documentation',
    body: 'Concepts become precise working drawings and construction documents that are genuinely ready to build.',
  },
  {
    num: '04',
    title: 'From studio to site',
    body: 'Regular site visits and on-ground coordination keep every floor true to its design intent — all the way to handover.',
  },
]

export const ETHOS = [
  {
    num: '01',
    title: 'Design-led, hands-on',
    body: 'Ideas are tested by doing — from the first sketch to solving real challenges on site.',
  },
  {
    num: '02',
    title: 'Studio + site',
    body: 'The team moves between the drawing board and live project sites, staying close to how design becomes real.',
  },
  {
    num: '03',
    title: 'Small & collaborative',
    body: 'A close-knit studio where every voice — junior to founder — contributes to the final outcome.',
  },
  {
    num: '04',
    title: 'Room to grow',
    body: 'Built for proactive learners who take ownership and grow with every single project.',
  },
]

export const FOUNDERS = [
  {
    name: 'Jay Shah',
    role: 'Co-founder — the operator',
    img: IMG + 'founder-jay.jpg',
    bio: 'An efficient manager who executes plans with detail — prioritising, delegating, delivering. His approach to design is meticulous and targeted.',
    alma: 'L. S. Raheja School of Architecture · 2019',
  },
  {
    name: 'Shikha Shah',
    role: 'Co-founder — the artist',
    img: IMG + 'founder-shikha.jpg',
    bio: 'An artist at heart, drawn to the intangible and undefined dynamics of space. Her design relies robustly on form, function and visual experience.',
    alma: 'L. S. Raheja School of Architecture · 2019',
  },
]

export const CAREERS = {
  title: 'Junior Architect',
  years: '0–1 yrs',
  intro:
    'Design development, working drawings and real site time — a seat at a table where your first year actually counts.',
  points: [
    'Assist in architectural design and concept development',
    'Prepare detailed working drawings and construction documents',
    'Coordinate with consultants and internal teams',
    'Visit sites regularly — watch your drawings get built',
    'Help solve real on-site design challenges',
  ],
  tools: [
    { name: 'AutoCAD', tier: 'essential' },
    { name: 'SketchUp', tier: 'essential' },
    { name: 'Revit · BIM', tier: 'advantage' },
    { name: 'Adobe Creative Suite', tier: 'good to have' },
    { name: 'Lumion / Enscape', tier: 'good to have' },
  ],
  note: 'A strong understanding of construction drawings and detailing is expected across all tools. Bring your sketchbook.',
}

export const MARQUEE = ['Design-led', 'Hands-on', 'Studio + Site', 'Inside-out', 'Since 2020']
