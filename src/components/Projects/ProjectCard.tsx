import type { Project } from '../../data/projects'
import { GitHubIcon, ExternalLinkIcon } from '../../icons/Icons'
import styles from './Projects.module.css'

function ProjectThumb({ variant }: { variant: string }) {
  switch (variant) {
    case 'luna':
      return (
        <div className={`${styles.projThumbInner} ${styles.tLuna}`}>
          <img className={styles.lunaVideo} src="/luna-card.png" alt="" aria-hidden="true" />
        </div>
      )
    case 'gatorroute':
      return (
        <div className={`${styles.projThumbInner} ${styles.tGatorroute}`}>
          <div className={styles.inner}>
            <svg className={styles.svg} viewBox="0 0 400 180" fill="none" aria-hidden="true">
              <path d="M30 140 Q 110 40 180 90 T 370 50" stroke="#2a5fff" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M30 140 Q 110 40 180 90 T 370 50" stroke="#2a5fff" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="2 8" opacity=".4" />
              <circle cx="30" cy="140" r="8" fill="#fff" stroke="#2a5fff" strokeWidth="3" />
              <circle cx="180" cy="90" r="6" fill="#2a5fff" />
              <circle cx="370" cy="50" r="8" fill="#2a5fff" />
              <rect x="160" y="58" width="60" height="22" rx="6" fill="#fff" stroke="#cbd5f5" />
              <text x="190" y="73" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#2a5fff" fontWeight="600">8 min</text>
            </svg>
          </div>
        </div>
      )
    case 'plum':
      return (
        <div className={`${styles.projThumbInner} ${styles.tPlum}`}>
          <div className={styles.inner}>
            <svg width="180" height="110" viewBox="0 0 180 110" fill="none" aria-hidden="true">
              <rect x="10" y="10" width="160" height="90" rx="10" fill="#fff" stroke="#cc8840" strokeWidth="1.5" />
              <rect x="10" y="10" width="160" height="22" rx="10" fill="#ffc080" />
              <circle cx="22" cy="21" r="3" fill="#c05a28" /><circle cx="32" cy="21" r="3" fill="#d88840" /><circle cx="42" cy="21" r="3" fill="#e8a860" />
              <text x="22" y="55" fontFamily="JetBrains Mono" fontSize="11" fill="#6b3e18">$ plum add ripgrep</text>
              <text x="22" y="72" fontFamily="JetBrains Mono" fontSize="11" fill="#a55828">→ resolved (48ms)</text>
              <text x="22" y="89" fontFamily="JetBrains Mono" fontSize="11" fill="#1a7f4a">✓ installed</text>
            </svg>
          </div>
        </div>
      )
    case 'nano':
      return (
        <div className={`${styles.projThumbInner} ${styles.tNano}`}>
          <div className={styles.inner}>
            <svg width="200" height="110" viewBox="0 0 200 110" fill="none" aria-hidden="true">
              <rect x="12" y="12" width="176" height="86" rx="8" fill="#18181e" stroke="#2f2f3a" />
              <text x="24" y="36" fontFamily="JetBrains Mono" fontSize="11" fill="#d1f7a7">haider@nano:~$ ls | wc -l</text>
              <text x="24" y="54" fontFamily="JetBrains Mono" fontSize="11" fill="#9aa0a6">14</text>
              <text x="24" y="72" fontFamily="JetBrains Mono" fontSize="11" fill="#d1f7a7">haider@nano:~$ ▎</text>
            </svg>
          </div>
        </div>
      )
    case 'leaf':
      return (
        <div className={`${styles.projThumbInner} ${styles.tLeaf}`}>
          <div className={styles.inner}>
            <svg width="200" height="110" viewBox="0 0 200 110" fill="none" aria-hidden="true">
              <g stroke="#1a7f4a" strokeWidth="2" fill="none">
                <path d="M20 90 L60 70 L100 82 L140 46 L180 58" />
              </g>
              <g fill="#1a7f4a">
                <circle cx="20" cy="90" r="4" /><circle cx="60" cy="70" r="4" /><circle cx="100" cy="82" r="4" /><circle cx="140" cy="46" r="4" /><circle cx="180" cy="58" r="4" />
              </g>
              <line x1="20" y1="100" x2="180" y2="100" stroke="#b8d7c0" strokeWidth="1" />
            </svg>
          </div>
        </div>
      )
    case 'tidepool':
      return (
        <div className={`${styles.projThumbInner} ${styles.tTidepool}`}>
          <div className={styles.inner}>
            <svg width="200" height="110" viewBox="0 0 200 110" fill="none" aria-hidden="true">
              <rect x="14" y="14" width="172" height="82" rx="8" fill="#fff" stroke="#c8adf5" />
              <g stroke="#6a3fc9" strokeWidth="2" fill="none" strokeLinecap="round">
                <path d="M30 70 Q 60 35 90 70 T 150 70" />
                <circle cx="60" cy="52" r="10" fill="#eadcff" stroke="#6a3fc9" />
                <circle cx="130" cy="62" r="6" fill="#6a3fc9" />
              </g>
              <rect x="140" y="24" width="34" height="14" rx="3" fill="#eadcff" />
              <text x="157" y="34" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#6a3fc9">3 live</text>
            </svg>
          </div>
        </div>
      )
    default:
      return <div className={styles.projThumbInner} />
  }
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a
      href={project.url ?? '#'}
      className={`${styles.proj} ${project.featured ? styles.featured : ''}`}
      data-card
    >
      <div
        className={styles.projThumb}
        style={project.thumbVariant === 'luna' ? { aspectRatio: 'unset', flex: '0 0 65%' } : undefined}
      >
        <span className={styles.tagOverlay}>{project.tagOverlay}</span>
        <span className={styles.yearOverlay}>{project.year}</span>
        <ProjectThumb variant={project.thumbVariant} />
      </div>
      <div
        className={styles.projBody}
        style={project.thumbVariant === 'luna' ? { padding: '12px 22px 14px', gap: '4px' } : undefined}
      >
        {project.meta.length > 0 && (
          <div className={styles.projMeta}>
            {project.meta.map((m, i) => (
              <span key={i}>
                {i > 0 && <span className={styles.sep}>·</span>}
                {m}
              </span>
            ))}
          </div>
        )}
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className={styles.projFoot}>
          <div className={styles.footLeft}>
            {project.links.length > 0 ? (
              <div className={styles.links}>
                {project.links.map((link) => (
                  <a key={link.label} href={link.url} aria-label={link.label}>
                    {link.icon === 'github' ? <GitHubIcon /> : <ExternalLinkIcon />}
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <div className={styles.stack}>
                {project.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            )}
          </div>
          <span className={styles.read}>
            {project.readLabel} <span className={styles.arrow}>→</span>
          </span>
        </div>
      </div>
    </a>
  )
}
