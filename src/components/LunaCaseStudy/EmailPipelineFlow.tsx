import { useRef, useEffect, useState, type ReactNode } from 'react'
import styles from './EmailPipelineFlow.module.css'

type Step = { step: string; icon: string; label: string; side: 'server' | 'client' }

const STEPS: Step[] = [
  { step: '01', icon: 'mail',    label: 'Raw Gmail message',                      side: 'client' },
  { step: '02', icon: 'filter',  label: 'Backend sanitization & asset rewriting', side: 'server' },
  { step: '03', icon: 'shield',  label: 'CSP-protected iframe response',          side: 'server' },
  { step: '04', icon: 'layout',  label: 'ThreadPanel / MessageCard iframe',       side: 'client' },
  { step: '05', icon: 'message', label: 'Verified postMessage height reporting',  side: 'client' },
  { step: '06', icon: 'check',   label: 'Auto-sized email display',               side: 'client' },
]

function StepIcon({ name }: { name: string }): ReactNode {
  const p = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'mail':    return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
    case 'filter':  return <svg {...p}><path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3Z" /></svg>
    case 'shield':  return <svg {...p}><path d="M12 2 4 6v5c0 4.5 3.5 8.7 8 9.9 4.5-1.2 8-5.4 8-9.9V6Z" /><path d="m9 12 2 2 4-4" /></svg>
    case 'layout':  return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M8 4v16M15 4v16" /></svg>
    case 'message': return <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
    case 'check':   return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m8 12 3 3 5-6" /></svg>
    default:        return null
  }
}

export default function EmailPipelineFlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const targetRef = { current: -1 }
    let display = -1
    let lastAdvance = 0
    let rafId = 0

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (rect.top < vh * 0.9) setVisible(true)
      const scrolled = vh * 0.9 - rect.top
      if (scrolled <= 0) {
        targetRef.current = -1
      } else {
        const progress = Math.min(1, scrolled / (rect.height * 2))
        targetRef.current = Math.min(Math.floor(progress * STEPS.length), STEPS.length - 1)
      }
    }

    const tick = (time: number) => {
      const target = targetRef.current
      if (display !== target && time - lastAdvance >= 160) {
        display = target > display ? display + 1 : display - 1
        setActiveStep(display)
        lastAdvance = time
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.pipeline}>
      {STEPS.map((step, i) => (
        <div
          key={step.step}
          className={`${styles.row} ${visible ? styles.rowVisible : ''}`}
          style={{ '--i': i } as React.CSSProperties}
        >
          <div className={styles.track}>
            <div className={`${styles.dot} ${activeStep === i ? styles.dotActive : ''}`}>
              <span>{step.step}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`${styles.line} ${visible ? styles.lineVisible : ''} ${activeStep === i ? styles.lineActive : ''}`}
                style={{ '--delay': `${i * 0.08 + 0.12}s` } as React.CSSProperties}
              />
            )}
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}><StepIcon name={step.icon} /></div>
            <span className={styles.cardLabel}>{step.label}</span>
            <span className={`${styles.badge} ${step.side === 'server' ? styles.server : styles.client}`}>
              {step.side}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
