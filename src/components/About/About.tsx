import SectionHead from '../SectionHead/SectionHead'
import styles from './About.module.css'

const principles = ['Systems first', 'Quiet interfaces', 'Fast prototypes', 'Human details']

export default function About() {
  return (
    <section id="about" aria-labelledby="about-h">
      <div className="wrap">
        <SectionHead
          num="03"
          title="About"
          titleId="about-h"
        />

        <div className={`${styles.aboutShell} reveal`}>
          <div className={styles.aboutStory}>
            <div className={styles.kicker}>Profile</div>
            <h3>
              Engineering with product thinking.
            </h3>
            <div className={styles.aboutCopy}>
              <p>
                I am a Front-End engineer and founder focused on building AI-native products
                with clear interfaces, durable systems, and a strong bias toward shipping.
              </p>
              <p>
                My work sits where frontend craft, systems thinking, and user experience meet.
                I like products that feel simple on the surface because the hard thinking has
                already happened underneath.
              </p>
            </div>

            <div className={styles.principles} aria-label="Working principles">
              {principles.map((principle) => (
                <span key={principle}>{principle}</span>
              ))}
            </div>
          </div>

          <div className={styles.aboutPanel}>
            <video
              src="/about-me-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="Haider working on LUNA architecture and frontend systems"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
