import { useEffect, useRef } from 'react'
import SectionHead from '../SectionHead/SectionHead'
import styles from './Skills.module.css'

const BINARY_COLUMNS = Array.from({ length: 42 }, (_, i) => i)
const BINARY_STREAM = '101001011010010110100101101001011010010110100101101001011010010110100101101001011010'

const breadth = [
  {
    label: ['AI Coding', 'Tools'],
    detail: 'Claude Code, Codex, Cursor, Lovable, GitHub Copilot.',
  },
  {
    label: ['User Experience', 'Design'],
    detail: 'Figma, research, user flows, wireframes, prototypes.',
  },
  {
    label: ['Backend', 'Development'],
    detail: 'APIs, databases, authentication, server logic, caching.',
  },
  {
    label: ['Software', 'Development'],
    detail: 'Data structures & algorithms, Python, Java, C, Git.',
  },
  {
    label: ['Project', 'Management'],
    detail: 'Roadmaps, sprints, task planning, teamwork, project handoff.',
  },
]

const frontendDepth = [
  {
    name: 'React.js / Next.js',
    meta: 'Front-End frameworks',
  },
  {
    name: 'TypeScript / JavaScript',
    meta: 'Application logic',
  },
  {
    name: 'HTML, CSS, Tailwind CSS',
    meta: 'Interface styling',
  },
  {
    name: 'Component-based architecture',
    meta: 'Reusable UI systems',
  },
  {
    name: 'State management',
    meta: 'UI data flow',
  },
  {
    name: 'API integration',
    meta: 'Front-End/backend wiring',
  },
  {
    name: 'UI performance optimization',
    meta: 'Fast, stable screens',
  },
  {
    name: 'Greenfield development',
    meta: 'Building from zero',
  },
  {
    name: 'Authentication flows',
    meta: 'Secure user journeys',
  },
  {
    name: 'Design system implementation',
    meta: 'Consistent components',
  },
  {
    name: 'Version control with Git/GitHub',
    meta: 'Collaborative workflow',
  },
  {
    name: 'Deployment with Vercel/Render',
    meta: 'Shipping to production',
  },
]

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

export default function Skills() {
  const skillRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const skill = skillRef.current
    const bg = bgRef.current
    if (!skill || !bg) return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    let tx = 50, ty = 35, cx = 50, cy = 35

    const onMove = (e: MouseEvent) => {
      const r = skill.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width) * 100
      ty = ((e.clientY - r.top) / r.height) * 100
    }
    const onLeave = () => { tx = 50; ty = 35 }

    skill.addEventListener('mousemove', onMove)
    skill.addEventListener('mouseleave', onLeave)

    const t0 = performance.now()
    let rafId: number

    const tick = (now: number) => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08

      bg.style.setProperty('--mx', cx.toFixed(2) + '%')
      bg.style.setProperty('--my', cy.toFixed(2) + '%')

      if (!reduced) {
        const t = ((now - t0) % 22000) / 22000
        const hue = (20 + Math.sin(t * Math.PI * 2) * 170 + 360) % 360
        const [r, g, b] = hslToRgb(hue, 92, 60)
        bg.style.setProperty('--glow', `${r},${g},${b}`)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      skill.removeEventListener('mousemove', onMove)
      skill.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section id="skills" aria-labelledby="skills-h">
      <div className="wrap">
        <SectionHead
          num="02"
          title="Skills & toolbox"
          titleId="skills-h"
        />
        <div className={`${styles.tSkillset} reveal`} ref={skillRef}>
          <div className={styles.skillBg} ref={bgRef} aria-hidden="true">
            <div className={styles.binaryRain}>
              {BINARY_COLUMNS.map((column) => (
                <span key={column}>{BINARY_STREAM}</span>
              ))}
            </div>
            <div className={styles.wash} />
            <div className={styles.blobs}>
              <div className={`${styles.blob} ${styles.b1}`} />
              <div className={`${styles.blob} ${styles.b2}`} />
              <div className={`${styles.blob} ${styles.b3}`} />
              <div className={`${styles.blob} ${styles.b4}`} />
            </div>
            <div className={styles.scan} />
          </div>

          <div className={styles.tHeader}>
            <span className={styles.eyebrow}>T-shaped skillset</span>
            <h3>
              Broad enough to shape the product.{' '}
              <span>Deep enough to build it.</span>
            </h3>
          </div>

          <div className={styles.tDiagram} aria-label="T-shaped skills diagram">
            <div className={styles.tTop}>
              {breadth.map((item) => (
                <article key={item.label.join('-')} className={styles.tSegment}>
                  <span>
                    {item.label[0]}
                    <br />
                    {item.label[1]}
                  </span>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>

            <div className={styles.tStem}>
              <div className={styles.stemHead}>
                <h4>Front-End Development</h4>
              </div>
              <ul className={styles.depthList}>
                {frontendDepth.map((skill) => (
                  <li key={skill.name}>
                    <span className={styles.node} aria-hidden="true" />
                    <span>
                      <strong>{skill.name}</strong>
                      <small>{skill.meta}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
