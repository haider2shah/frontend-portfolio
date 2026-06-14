import { useState, useCallback, useRef } from 'react'
import Toast from '../Toast/Toast'
import { DownloadIcon } from '../../icons/Icons'
import styles from './Contact.module.css'

const EMAIL = 'haider2shah@yahoo.com'

export default function Contact() {
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('Email copied')
  const [hoverHint, setHoverHint] = useState<{
    text: string
    x: number
    y: number
  } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const moveHint = useCallback((text: string) => (e: React.MouseEvent) => {
    setHoverHint({
      text,
      x: e.clientX,
      y: e.clientY,
    })
  }, [])

  const showToast = useCallback((message: string) => {
    setToastMessage(message)
    setToastVisible(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 1800)
  }, [])

  const copyEmail = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(EMAIL)
      showToast('Email copied')
    } catch (_) {
      showToast(`Copy: ${EMAIL}`)
    }
  }, [showToast])

  return (
    <>
      <section className={styles.contact} id="contact" aria-labelledby="contact-h">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="num">05</span>
            <h2 id="contact-h">Contact</h2>
            <p className="lede">
              I am available for a Full-time role. The fastest way to reach me is
              email — I reply within a day.
            </p>
          </div>

          <div className={styles.contactGrid}>
            <div>
              <h3 className={styles.pitch}>
                Have a role, a project, or just a question? <em>Say hi.</em>
              </h3>
              <div className={styles.contactCtas}>
                <a href={`mailto:${EMAIL}`} className="btn btn-primary">
                  Email me <span className="arrow" aria-hidden="true">→</span>
                </a>
                <a href="#" className="btn btn-secondary">
                  Download résumé
                  <DownloadIcon size={14} />
                </a>
              </div>
            </div>

            <div className={styles.contactList} role="list">
              <a
                href="#"
                className={styles.contactRow}
                onClick={copyEmail}
                onMouseEnter={moveHint('click to copy')}
                onMouseMove={moveHint('click to copy')}
                onMouseLeave={() => setHoverHint(null)}
                role="listitem"
              >
                <span className={styles.k}>Email</span>
                <span className={styles.v}>{EMAIL}</span>
              </a>
              <a
                href="https://github.com/haider2shah"
                className={styles.contactRow}
                role="listitem"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={moveHint('open')}
                onMouseMove={moveHint('open')}
                onMouseLeave={() => setHoverHint(null)}
              >
                <span className={styles.k}>GitHub</span>
                <span className={styles.v}>github.com/haider2shah</span>
              </a>
              <a
                href="https://www.linkedin.com/in/haider2shah"
                className={styles.contactRow}
                role="listitem"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={moveHint('open')}
                onMouseMove={moveHint('open')}
                onMouseLeave={() => setHoverHint(null)}
              >
                <span className={styles.k}>LinkedIn</span>
                <span className={styles.v}>linkedin.com/in/haider2shah</span>
              </a>
              <div className={styles.contactRow} role="listitem">
                <span className={styles.k}>Location</span>
                <span className={styles.v}>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {hoverHint && (
        <span
          className={styles.cursorHint}
          style={{
            left: hoverHint.x,
            top: hoverHint.y,
          }}
        >
          {hoverHint.text}
        </span>
      )}
      <Toast visible={toastVisible} message={toastMessage} />
    </>
  )
}
