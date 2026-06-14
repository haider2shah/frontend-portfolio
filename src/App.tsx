import { useEffect } from 'react'
import Cursor from './components/Cursor/Cursor'
import PillNav from './components/Nav/PillNav'
import Hero from './components/Hero/Hero'
import Projects from './components/Projects/Projects'
import Skills from './components/Skills/Skills'
import About from './components/About/About'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import LunaCaseStudy from './components/LunaCaseStudy/LunaCaseStudy'
import { consumePendingScroll, handleSkipToMain, scrollToSection } from './utils/navigation'

function HomePage() {
  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#top') {
      window.history.replaceState(null, '', window.location.pathname)
      window.scrollTo({ top: 0 })
      return
    }
    if (hash) {
      window.history.replaceState(null, '', window.location.pathname)
      scrollToSection(hash.slice(1))
      return
    }
    consumePendingScroll()
  }, [])

  return (
    <>
      <button className="skip" type="button" onClick={handleSkipToMain}>Skip to content</button>
      <Cursor />
      <PillNav />
      <main id="main">
        <Hero />
        <Projects />
        <Skills />
        <About />
      </main>
      <Contact />
      <Footer />
    </>
  )
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '')

  return path === '/case-studies/luna'
    ? <LunaCaseStudy />
    : <HomePage />
}
