import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'
import * as THREE from 'three'
// @ts-ignore
import NET from 'vanta/dist/vanta.net.min.js'
import { goHomeThenScroll } from '../../utils/navigation'
import styles from './CaseStudyHero.module.css'

export interface CaseStudyTitleLine {
  text: string
  em?: boolean
}

export interface CaseStudyMetaCard {
  icon: 'role' | 'stack' | 'status'
  label: string
  value: string
  live?: boolean
}

export interface CaseStudyHeroProps {
  backLink?: string
  titleLines: CaseStudyTitleLine[]
  eyebrow: string
  pitch: string
  stackCopy: ReactNode
  imageSrc: string
  videoSrc?: string
  imageAlt: string
  wordmark: string
  metaCards: CaseStudyMetaCard[]
}


function MetaIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    role:   <><circle cx="12" cy="8" r="3" /><path d="M5.5 19c.8-3.1 3-4.6 6.5-4.6s5.7 1.5 6.5 4.6" /></>,
    stack:  <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8M8 12h5M8 15h7" /></>,
    status: <><circle cx="12" cy="12" r="8" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}


export default function CaseStudyHero({
  backLink = '/',
  titleLines,
  eyebrow,
  pitch,
  stackCopy,
  imageSrc,
  videoSrc,
  imageAlt,
  wordmark,
  metaCards,
}: CaseStudyHeroProps) {
  const heroRef  = useRef<HTMLElement>(null)
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaFx  = useRef<any>(null)

  useEffect(() => {
    if (!vantaRef.current) return
    vantaFx.current = NET({
      el: vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      color: 0x4477ff,
      backgroundColor: 0xc8d8ff,
      points: 7,
      maxDistance: 32,
      spacing: 28,
      showDots: false,
    })
    return () => {
      if (vantaFx.current) { vantaFx.current.destroy(); vantaFx.current = null }
    }
  }, [])

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const hero = heroRef.current
    if (!hero) return

    const rect = hero.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    const angle = 112 + x * 0.5

    hero.style.setProperty('--wordmark-x', `${x.toFixed(1)}%`)
    hero.style.setProperty('--wordmark-y', `${y.toFixed(1)}%`)
    hero.style.setProperty('--wordmark-angle', `${angle.toFixed(1)}deg`)
  }

  const handlePointerLeave = () => {
    const hero = heroRef.current
    if (!hero) return

    hero.style.setProperty('--wordmark-x', '72%')
    hero.style.setProperty('--wordmark-y', '48%')
    hero.style.setProperty('--wordmark-angle', '132deg')
  }

  return (
    <section
      className={styles.hero}
      id="top"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={styles.heroBg} ref={vantaRef} aria-hidden="true" />

      <div className="wrap">
        <a
          className={styles.backLink}
          href={backLink}
          onClick={(event) => {
            event.preventDefault()
            goHomeThenScroll('projects')
          }}
        >
          ← Back to projects
        </a>

        <div className={styles.heroStage}>
          <div className={styles.heroImage}>
            {videoSrc ? (
              <video src={videoSrc} autoPlay loop muted playsInline preload="metadata" aria-label={imageAlt} />
            ) : (
              <img src={imageSrc} alt={imageAlt} />
            )}
          </div>

          <div className={styles.heroCols}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                {titleLines.map((line, i) =>
                  line.em
                    ? <em key={i} className={styles.titleLineEm}>{line.text}</em>
                    : <span key={i} className={styles.titleLine}>{line.text}</span>
                )}
              </h1>
              <p className={styles.heroCopy}>{stackCopy}</p>
            </div>

            <div className={styles.spacer} aria-hidden="true" />

            <div className={styles.heroRight}>
              <p className={styles.eyebrow}>{eyebrow}</p>
              <p className={styles.pitch}>{pitch}</p>
            </div>
          </div>

          <div className={styles.heroWordmark} aria-hidden="true">{wordmark}</div>
        </div>

        <div className={styles.metaRow}>
          {metaCards.map((card) => (
            <div key={card.label} className={styles.metaCard}>
              <div className={styles.metaIcon}><MetaIcon name={card.icon} /></div>
              <div className={styles.factBody}>
                <b>{card.label}</b>
                <span className={styles.factValue}>
                  {card.value}
                  {card.live && <span className={styles.liveDot} aria-label="Active" />}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
