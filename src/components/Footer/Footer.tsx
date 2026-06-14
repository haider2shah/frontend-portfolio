import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.inner}>
          <div>© 2026 Haider Shah · Built with React &amp; TypeScript.</div>
          <div>
            <a href="mailto:haider2shah@yahoo.com">Email</a>
            {' · '}
            <a href="https://github.com/haider2shah" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {' · '}
            <a href="https://www.linkedin.com/in/haider2shah" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
