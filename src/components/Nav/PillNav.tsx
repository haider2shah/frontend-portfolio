import { useEffect, useRef, useState } from 'react'
import { MoonIcon, SunIcon } from '../../icons/Icons'
import { goHomeThenScroll, scrollToSection } from '../../utils/navigation'
import styles from './PillNav.module.css'

const MENU_ITEMS = [
  { label: 'Home', href: '/', preview: '/nav-preview-home.png', previewLabel: 'Hero', external: false },
  { label: 'Projects', href: '/', sectionId: 'projects', preview: '/nav-preview-projects.png', previewLabel: 'Selected work', external: false },
  { label: 'Skills', href: '/', sectionId: 'skills', preview: '/nav-preview-skills.png', previewLabel: 'Toolbox', external: false },
  { label: 'About', href: '/', sectionId: 'about', preview: '/nav-preview-about.png', previewLabel: 'Profile', external: false },
  { label: 'Contact', href: '/', sectionId: 'contact', preview: '/nav-preview-contact.png', previewLabel: 'Contact', external: false },
]

const OTHER_ITEMS = [
  { label: 'Email', href: 'mailto:haider2shah@yahoo.com', preview: null, previewLabel: '', external: false },
  { label: 'GitHub', href: 'https://github.com/haider2shah', preview: '/nav-preview-github.png', previewLabel: 'github.com/haider2shah', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/haider2shah', preview: '/nav-preview-linkedin.png', previewLabel: 'linkedin.com/in/haider2shah', external: true },
]

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const saved = window.localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return 'light'
}

interface PillNavProps {
  homePrefix?: string
}

export default function PillNav({ homePrefix = '' }: PillNavProps) {
  const shellRef = useRef<HTMLElement>(null)
  const previewResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [activePreview, setActivePreview] = useState(MENU_ITEMS[0])
  const isDark = theme === 'dark'

  const handleMenuClick = (item: (typeof MENU_ITEMS)[number]) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false)
    if (!item.sectionId) return

    event.preventDefault()
    if (window.location.pathname.replace(/\/$/, '') === '') {
      scrollToSection(item.sectionId)
    } else {
      goHomeThenScroll(item.sectionId)
    }
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    let rafId = 0

    const updateProgress = () => {
      rafId = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.round((window.scrollY / scrollable) * 100) : 0
      setScrollPercent(Math.max(0, Math.min(100, progress)))
    }

    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(updateProgress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    updateProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <header ref={shellRef} className={`${styles.shell} ${open ? styles.open : ''}`} role="banner">
      <div className={styles.bar}>
        <button
          className={styles.menuButton}
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="pill-nav-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.menuIcon} aria-hidden="true">
            <span />
            <span />
          </span>
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>

        <span className={styles.progressText} aria-label={`${scrollPercent}% scrolled`}>
          {scrollPercent}%
        </span>

        <button
          className={styles.themeButton}
          type="button"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setTheme((v) => (v === 'dark' ? 'light' : 'dark'))}
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>

      <div className={styles.panel} id="pill-nav-menu" aria-hidden={!open}>
        <div className={styles.menuColumn}>
          <div className={styles.group}>
            <p>Menu</p>
            <nav aria-label="Primary menu">
              {MENU_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href === '/' ? '/' : `${homePrefix}${item.href}`}
                  onClick={handleMenuClick(item)}
                  onFocus={() => setActivePreview(item)}
                  onMouseEnter={() => {
                    if (previewResetTimer.current) clearTimeout(previewResetTimer.current)
                    setActivePreview(item)
                  }}
                  onMouseLeave={() => {
                    previewResetTimer.current = setTimeout(() => setActivePreview(MENU_ITEMS[0]), 300)
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className={styles.divider} />

          <div className={styles.group}>
            <p>Other</p>
            <nav aria-label="Other links">
              {OTHER_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => {
                    if (!item.preview) return
                    if (previewResetTimer.current) clearTimeout(previewResetTimer.current)
                    setActivePreview({ label: item.label, href: item.href, preview: item.preview, previewLabel: item.previewLabel, external: item.external })
                  }}
                  onMouseLeave={() => {
                    if (!item.preview) return
                    previewResetTimer.current = setTimeout(() => setActivePreview(MENU_ITEMS[0]), 300)
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className={styles.previewPanel} aria-hidden="true">
          <div className={styles.monitor}>
            <div className={`${styles.screenWrap} ${activePreview.external ? styles.fitContain : ''}`}>
              <img src={activePreview.preview} alt="" />
              <div className={styles.previewCaption}>
                <span>{activePreview.previewLabel}</span>
                <strong>{activePreview.label}</strong>
              </div>
            </div>
            <div className={styles.standNeck} />
            <div className={styles.standBase} />
          </div>
        </div>
      </div>
    </header>
  )
}
