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

function HomePage() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || hash === '#top') return
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
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
  return window.location.pathname === '/case-studies/luna'
    ? <LunaCaseStudy />
    : <HomePage />
}
