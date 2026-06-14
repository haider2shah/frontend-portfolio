import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './LunaArchitectureDiagram.module.css'

type CardKind = 'ui' | 'hooks' | 'center' | 'sandbox' | 'api' | 'endpoint' | 'service'
type ArchCard = {
  id: string
  kind: CardKind
  label: string
  sub: string
  note: string
  section: string
}

const SURFACES: ArchCard[] = [
  { id: 'inbox', kind: 'ui', label: 'Inbox', sub: 'ThreadList · ThreadRow', note: 'The live inbox list and thread selection surface.', section: 'architecture' },
  { id: 'thread', kind: 'ui', label: 'Thread reader', sub: 'ThreadPanel · MessageCard', note: 'Reads isolated email documents without leaking styles into the app.', section: 'rendering' },
  { id: 'search', kind: 'ui', label: 'AI search', sub: 'LunaSearch · AssistantAnswerCard', note: 'Turns natural-language questions into structured inbox answers.', section: 'ai-inbox' },
  { id: 'compose', kind: 'ui', label: 'Compose', sub: 'ReplyComposer · Tiptap', note: 'Keeps drafting and reply state predictable inside the shell.', section: 'architecture' },
  { id: 'actions', kind: 'ui', label: 'Actions & people', sub: 'ActionsPage · PeoplePage · TriageCategoryView · TriageScanBanner', note: 'Presents the productivity views built from inbox state.', section: 'architecture' },
]

const CORE: ArchCard[] = [
  { id: 'hooks', kind: 'hooks', label: 'Focused React hooks', sub: 'useThreads · useSearch · useTriageStatus · useAuth', note: 'Each hook owns one slice of asynchronous frontend behavior.', section: 'architecture' },
  { id: 'shell', kind: 'center', label: 'LUNA dashboard shell', sub: 'Auth · selection · search · triage · compose', note: 'The shell coordinates shared state and keeps product surfaces in sync.', section: 'architecture' },
]

const BOUNDARIES: ArchCard[] = [
  { id: 'sandbox', kind: 'sandbox', label: 'Sandboxed email rendering', sub: 'sanitize → CSP nonce → iframe → resize', note: 'Untrusted email HTML is isolated behind a deliberately narrow boundary.', section: 'rendering' },
  { id: 'api', kind: 'api', label: 'Typed API client', sub: 'lib/api.ts · auth headers · errors', note: 'A single typed client centralizes how the frontend talks to the server.', section: 'architecture' },
]

const ENDPOINTS: ArchCard[] = [
  { id: 'email-api', kind: 'endpoint', label: 'Emails / sync', sub: 'GET /emails · POST /emails/sync', note: 'Thread loading and inbox synchronization contracts.', section: 'sync' },
  { id: 'search-api', kind: 'endpoint', label: 'Search / agent', sub: 'POST /emails/search · POST /agent/query', note: 'Search and agent request contracts.', section: 'ai-inbox' },
  { id: 'triage-api', kind: 'endpoint', label: 'Triage', sub: 'POST /triage/scan · GET /triage/status', note: 'Background triage progress and status contracts.', section: 'architecture' },
  { id: 'todos-api', kind: 'endpoint', label: 'Todos', sub: 'GET /todos · POST /todos/sync', note: 'Todo extraction and updates exposed to the interface.', section: 'architecture' },
]

const SERVICES: ArchCard[] = [
  { id: 'gmail', kind: 'service', label: 'Gmail API', sub: 'OAuth · sync · crawl', note: 'The external provider behind inbox ingestion.', section: 'sync' },
  { id: 'ai', kind: 'service', label: 'AI services', sub: 'agent · summaries · drafts', note: 'The external intelligence layer behind assistant features.', section: 'ai-inbox' },
]

const ALL_CARDS = [...SURFACES, ...CORE, ...BOUNDARIES, ...ENDPOINTS, ...SERVICES]
const DEFAULT_CARD = ALL_CARDS.find((card) => card.id === 'shell')!

const PATHS: Record<string, string[]> = {
  inbox: ['inbox', 'hooks', 'shell', 'api', 'email-api', 'gmail'],
  thread: ['thread', 'hooks', 'shell', 'sandbox'],
  search: ['search', 'hooks', 'shell', 'api', 'search-api', 'ai'],
  compose: ['compose', 'hooks', 'shell', 'api'],
  actions: ['actions', 'hooks', 'shell', 'api', 'triage-api', 'todos-api'],
  hooks: ['inbox', 'thread', 'search', 'compose', 'actions', 'hooks', 'shell'],
  shell: ALL_CARDS.map((card) => card.id),
  sandbox: ['thread', 'hooks', 'shell', 'sandbox'],
  api: ['shell', 'api', 'email-api', 'search-api', 'triage-api', 'todos-api', 'gmail', 'ai'],
  'email-api': ['inbox', 'hooks', 'shell', 'api', 'email-api', 'gmail'],
  'search-api': ['search', 'hooks', 'shell', 'api', 'search-api', 'ai'],
  'triage-api': ['actions', 'hooks', 'shell', 'api', 'triage-api'],
  'todos-api': ['actions', 'hooks', 'shell', 'api', 'todos-api'],
  gmail: ['inbox', 'hooks', 'shell', 'api', 'email-api', 'gmail'],
  ai: ['search', 'hooks', 'shell', 'api', 'search-api', 'ai'],
}

const ICONS: Record<CardKind, ReactNode> = {
  ui: <svg viewBox="0 0 16 16"><rect x="1.5" y="2" width="13" height="10" rx="2" /><path d="M5 14h6M8 12v2" /></svg>,
  hooks: <svg viewBox="0 0 16 16"><path d="M4 5a4 4 0 1 1 4 4v4" /><circle cx="8" cy="14" r="1" /></svg>,
  center: <svg viewBox="0 0 16 16"><rect x="1.5" y="1.5" width="5" height="5" rx="1" /><rect x="9.5" y="1.5" width="5" height="5" rx="1" /><rect x="1.5" y="9.5" width="5" height="5" rx="1" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /></svg>,
  sandbox: <svg viewBox="0 0 16 16"><path d="M8 1.5 2.5 4v3.5c0 3 2.2 5.8 5.5 7 3.3-1.2 5.5-4 5.5-7V4Z" /><path d="m5.5 8 1.7 1.7 3.4-3.4" /></svg>,
  api: <svg viewBox="0 0 16 16"><path d="m5 4-4 4 4 4M11 4l4 4-4 4M9.5 2.5l-3 11" /></svg>,
  endpoint: <svg viewBox="0 0 16 16"><rect x="1.5" y="4" width="13" height="8" rx="2" /><path d="M5 8h6M8 6v4" /></svg>,
  service: <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" /><path d="M1.5 8h13M8 1.5c1.6 1.8 2.4 4 2.4 6.5S9.6 12.7 8 14.5C6.4 12.7 5.6 10.5 5.6 8S6.4 3.3 8 1.5Z" /></svg>,
}

function Card({
  card,
  activeId,
  related,
  onActivate,
  onSelect,
}: {
  card: ArchCard
  activeId: string
  related: Set<string>
  onActivate: (id: string | null) => void
  onSelect: (card: ArchCard) => void
}) {
  return (
    <button
      type="button"
      className={[
        styles.card,
        styles[`card_${card.kind}`],
        activeId === card.id ? styles.cardActive : '',
        !related.has(card.id) ? styles.cardDim : '',
      ].filter(Boolean).join(' ')}
      onMouseEnter={() => onActivate(card.id)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(card.id)}
      onBlur={() => onActivate(null)}
      onClick={() => onSelect(card)}
    >
      <span className={styles.cardIcon}>{ICONS[card.kind]}</span>
      <span className={styles.cardCopy}>
        <strong>{card.label}</strong>
        <small>{card.sub}</small>
      </span>
      <span className={styles.cardArrow} aria-hidden="true">↗</span>
    </button>
  )
}

function LaneHeading({ num, title, copy }: { num: string; title: string; copy: string }) {
  return (
    <div className={styles.laneHeading}>
      <span>{num}</span>
      <div>
        <strong>{title}</strong>
        <small>{copy}</small>
      </div>
    </div>
  )
}

export default function LunaArchitectureDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState(DEFAULT_CARD)
  const activeId = hovered ?? selected.id
  const activeCard = ALL_CARDS.find((card) => card.id === activeId) ?? selected
  const related = new Set(PATHS[activeId] ?? [activeId])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEntered(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const selectCard = (card: ArchCard) => {
    setSelected(card)
    document.getElementById(card.section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cardProps = { activeId, related, onActivate: setHovered, onSelect: selectCard }

  return (
    <div ref={wrapRef} className={`${styles.wrapper} ${entered ? styles.wrapperVisible : ''}`}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}><i /> Interactive frontend map</span>
          <h3>From product surface to integration</h3>
        </div>
        <p>Hover to trace a path. Click a card to explore the case study.</p>
      </header>

      <div className={styles.map}>
        <section className={styles.lane}>
          <LaneHeading num="01" title="Product surfaces" copy="What people interact with" />
          <div className={styles.surfaceGrid}>
            {SURFACES.map((card) => <Card key={card.id} card={card} {...cardProps} />)}
          </div>
        </section>

        <div className={styles.connector}><span>state flows inward</span></div>

        <section className={styles.lane}>
          <LaneHeading num="02" title="State & orchestration" copy="Where frontend behavior stays coordinated" />
          <div className={styles.coreGrid}>
            <Card card={CORE[0]} {...cardProps} />
            <span className={styles.inlineConnector} aria-hidden="true"><i /></span>
            <Card card={CORE[1]} {...cardProps} />
          </div>
        </section>

        <div className={`${styles.connector} ${styles.connectorSplit}`}><span>two deliberate boundaries</span></div>

        <section className={styles.lane}>
          <LaneHeading num="03" title="Frontend boundary" copy="Narrow exits from the dashboard shell" />
          <div className={styles.boundaryGrid}>
            {BOUNDARIES.map((card) => <Card key={card.id} card={card} {...cardProps} />)}
          </div>
        </section>

        <div className={styles.connector}><span>typed communication</span></div>

        <section className={styles.lane}>
          <LaneHeading num="04" title="API contracts" copy="Contracts and providers the client depends on" />
          <div className={styles.integrationGrid}>
            <div className={styles.endpointGrid}>
              {ENDPOINTS.map((card) => <Card key={card.id} card={card} {...cardProps} />)}
            </div>
            <div className={styles.serviceGrid}>
              {SERVICES.map((card) => <Card key={card.id} card={card} {...cardProps} />)}
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.spotlight}>
        <span className={styles.spotlightIcon}>{ICONS[activeCard.kind]}</span>
        <div>
          <strong>{activeCard.label}</strong>
          <p>{activeCard.note}</p>
        </div>
        <span className={styles.spotlightHint}>active path</span>
      </footer>
    </div>
  )
}
