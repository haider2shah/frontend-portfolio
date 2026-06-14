import { useRef, useEffect } from 'react'
import SectionHead from '../SectionHead/SectionHead'
import ProjectCard from './ProjectCard'
import { projects } from '../../data/projects'
import styles from './Projects.module.css'

const STICKY_TOP = -7
const SLIDE_PX = 480
const DWELL_PX = 620
const SLOT_PX = SLIDE_PX + DWELL_PX
const PERSPECTIVE_PX = 1200
const SLIDE_Y_MAX = 115
const RECEDE_Y_MAX = 7
const SCALE_FACTOR = 0.065
const TILT_DEG = 9

const VISIBLE = 1
const SCROLL_SPACE_PX = DWELL_PX + (VISIBLE - 2) * SLOT_PX + SLIDE_PX

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const slotsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let rafId = 0

    const updateCards = () => {
      rafId = 0
      const section = sectionRef.current
      if (!section) return

      const { top } = section.getBoundingClientRect()
      const scrolled = Math.max(0, STICKY_TOP - top)

      const progressByIndex = slotsRef.current.map((_, i) => (
        i === 0
          ? 1
          : Math.max(0, Math.min(1, (scrolled - DWELL_PX - (i - 1) * SLOT_PX) / SLIDE_PX))
      ))

      slotsRef.current.forEach((el, i) => {
        if (!el) return

        const progress = progressByIndex[i]
        const nextProgress = progressByIndex[i + 1] ?? 0
        const slideY = (1 - progress) * SLIDE_Y_MAX
        const recedeY = nextProgress * RECEDE_Y_MAX
        const scale = 1 - nextProgress * SCALE_FACTOR
        const tilt = nextProgress * TILT_DEG

        el.style.transform = `perspective(${PERSPECTIVE_PX}px) translateY(${slideY + recedeY}%) scale(${scale}) rotateX(${tilt}deg)`
        el.style.opacity = '1'
      })
    }

    const onScroll = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(updateCards)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateCards()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.projectsSection}
      id="projects"
      aria-labelledby="projects-h"
      style={{ '--scroll-space': `${SCROLL_SPACE_PX}px` } as React.CSSProperties}
    >
      <div className={styles.stickyWrapper}>
        <div className={styles.wrapInner}>
          <SectionHead num="01" title="Projects" titleId="projects-h" />
          <div className={styles.cardStack}>
            {projects.slice(0, VISIBLE).map((project, i) => (
              <div
                key={project.id}
                ref={(el) => { slotsRef.current[i] = el }}
                className={styles.cardSlot}
                style={{ zIndex: i + 1 }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
