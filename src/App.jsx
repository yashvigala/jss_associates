import { useState, useCallback } from 'react'
import { ThemeProvider } from './context/Theme.jsx'
import { SmoothScroll } from './components/SmoothScroll.jsx'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import SectionStory from './components/SectionStory.jsx'
import SectionBuild from './components/SectionBuild.jsx'
import SectionServices from './components/SectionServices.jsx'
import SectionWorks from './components/SectionWorks.jsx'
import SectionPlay from './components/SectionPlay.jsx'
import SectionEthos from './components/SectionEthos.jsx'
import SectionFounders from './components/SectionFounders.jsx'
import SectionCareers from './components/SectionCareers.jsx'
import SectionContact from './components/SectionContact.jsx'

export default function App() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])

  return (
    <ThemeProvider>
      <SmoothScroll>
        <Preloader onDone={onLoaded} />
        <Cursor />
        <Nav ready={ready} />

        <div className="bp-grid" aria-hidden="true" />

        <main style={{ position: 'relative' }}>
          <Hero ready={ready} />
          <SectionStory />
          <SectionBuild />
          <SectionServices />
          <SectionWorks />
          <SectionPlay />
          <SectionEthos />
          <SectionFounders />
          <SectionCareers />
          <SectionContact />
        </main>

        <div className="vignette" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
      </SmoothScroll>
    </ThemeProvider>
  )
}
