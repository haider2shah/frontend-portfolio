import { useEffect, useState } from 'react'
import { handleSectionClick } from '../../utils/navigation'
import styles from './Nav.module.css'

const NAV_SECTIONS = ['projects', 'skills', 'about'] as const

interface NavProps {
  activeSection: string
}

export default function Nav({ activeSection }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setScrolled(!e.isIntersecting)),
      { threshold: 0, rootMargin: '-70px 0px 0px 0px' },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      const currentY = window.scrollY
      const scrollingDown = currentY > lastY
      setHidden(scrollingDown && currentY > 120)
      lastY = currentY
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}
      role="banner"
    >
      <div className={styles.navInner}>
        <a href="/" className={styles.brand} aria-label="Haider Shah — home">
          Haider Shah
        </a>
        <nav aria-label="Primary">
          <ul className={styles.navLinks}>
            {NAV_SECTIONS.map((id) => (
              <li key={id}>
                <a
                  href="/"
                  className={activeSection === id ? styles.active : undefined}
                  onClick={handleSectionClick(id)}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="/" className={styles.navCta} onClick={handleSectionClick('contact')}>
          Contact me
        </a>
      </div>
    </header>
  )
}
