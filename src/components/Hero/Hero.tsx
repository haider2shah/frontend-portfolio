import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'
import { ArrowRightIcon } from '../../icons/Icons'

const BINARY_COLUMNS = Array.from({ length: 42 }, (_, i) => i)
const BINARY_STREAM = '101001011010010110100101101001011010010110100101101001011010010110100101101001011010'

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const bg = bgRef.current
    const code = codeRef.current
    if (!hero || !bg) return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    let tx = 50, ty = 35, cx = 50, cy = 35
    let px = 0, py = 0, cpx = 0, cpy = 0

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width) * 100
      ty = ((e.clientY - r.top) / r.height) * 100
      px = (tx - 50) / 50
      py = (ty - 50) / 50
    }
    const onLeave = () => { tx = 50; ty = 35; px = 0; py = 0 }

    hero.addEventListener('mousemove', onMove)
    hero.addEventListener('mouseleave', onLeave)

    const t0 = performance.now()
    let rafId: number

    const tick = (now: number) => {
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      cpx += (px - cpx) * 0.06
      cpy += (py - cpy) * 0.06

      bg.style.setProperty('--mx', cx.toFixed(2) + '%')
      bg.style.setProperty('--my', cy.toFixed(2) + '%')

      if (code) {
        code.style.setProperty('--px', cpx.toFixed(3))
        code.style.setProperty('--py', cpy.toFixed(3))
      }

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
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section className={styles.hero} id="top" ref={heroRef}>
      {/* Animated background */}
      <div className={styles.heroBg} ref={bgRef} aria-hidden="true">
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

      {/* Floating code chips */}
      <div className={styles.heroCode} ref={codeRef} aria-hidden="true">
        <span className={`${styles.codeGlyph} ${styles.g1}`}>{'{ }'}</span>
        <span className={`${styles.codeGlyph} ${styles.g2}`}>{'</>'}</span>

        <div className={`${styles.codeChip} ${styles.c1}`}>
          <header>
            <span className={styles.lights}>
              <span /><span /><span />
            </span>
            ~/portfolio
          </header>
          <span className={styles.cm}>{'// shipping'}</span>{'\n'}
          <span className={styles.kw}>const</span>{' '}
          <span className={styles.fn}>build</span> = <span className={styles.kw}>async</span> {'() => {'}{'\n'}
          {'  '}<span className={styles.kw}>await</span>{' '}
          <span className={styles.fn}>ship</span>(<span className={styles.str}>'often'</span>);{'\n'}
          {'};'}
        </div>

        <div className={`${styles.codeChip} ${styles.c2}`}>
          <header>schema.ts</header>
          <span className={styles.kw}>type</span>{' '}
          <span className={styles.fn}>User</span> = {'{'}{'\n'}
          {'  '}id: <span className={styles.tag}>UUID</span>,{'\n'}
          {'  '}craft: <span className={styles.str}>'frontend'</span>,{'\n'}
          {'};'}
        </div>

        <div className={`${styles.codeChip} ${styles.c3}`}>
          <header>
            <span className={styles.lights}>
              <span /><span /><span />
            </span>
            terminal
          </header>
          <span className={styles.dot}>➜</span> npm run dev{'\n'}
          <span className={styles.cm}>{'  ready in'}</span>{' '}
          <span className={styles.num}>312</span>
          <span className={styles.cm}>ms</span>{'\n'}
          <span className={styles.dot}>●</span> localhost:<span className={styles.num}>3000</span>
        </div>

        <div className={`${styles.codeChip} ${styles.c4}`}>
          <header>App.tsx</header>
          &lt;<span className={styles.tag}>Hero</span>{' '}
          <span className={styles.fn}>name</span>=<span className={styles.str}>"Haider"</span>{'\n'}
          {'      '}
          <span className={styles.fn}>role</span>=<span className={styles.str}>"engineer"</span> /&gt;
        </div>
      </div>

      {/* Main content */}
      <div className="wrap">
        <div className={styles.heroStage}>
          <div className={styles.heroPortrait} aria-hidden="true">
            <img src="/haiderportrait.png" alt="Haider Shah" />
          </div>

          <div className={styles.heroCols}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                <span className={styles.titleLine}>Front-End</span>
                <span className={styles.titleLine}>Engineer</span>
                <span className={styles.titleLine}>based in</span>
                <em className={styles.titleLineEm} data-cursor="san-francisco">San Francisco</em>
              </h1>
            </div>

            <div className={styles.spacer} aria-hidden="true" />

            <div className={styles.heroRight}>
              <p className={styles.heroSub}>
                I am a Front-End engineer and founder focused on building AI-native products.
              </p>
              <div className={styles.heroCtas}>
                <a href="#projects" className={styles.btnOrange}>
                  <span className={styles.circle} aria-hidden="true">
                    <ArrowRightIcon size={20} />
                  </span>
                  See my projects
                </a>
              </div>
            </div>
          </div>

          <div className={styles.heroWordmark} aria-hidden="true">Haider Shah</div>
        </div>
      </div>
    </section>
  )
}
