import { useEffect, useState, type ReactNode } from 'react'
import CaseStudyHero from '../CaseStudyHero/CaseStudyHero'
import Cursor from '../Cursor/Cursor'
import Footer from '../Footer/Footer'
import PillNav from '../Nav/PillNav'
import EmailPipelineFlow from './EmailPipelineFlow'
import LunaArchitectureDiagram from './LunaArchitectureDiagram'
import styles from './LunaCaseStudy.module.css'

const TOC_ITEMS = [
  { id: 'glance', label: 'At a Glance' },
  { id: 'problems', label: 'Hardest Problems' },
  { id: 'rendering', label: 'Safe Rendering' },
  { id: 'ai-inbox', label: 'AI-Native Inbox' },
  { id: 'sync', label: 'Background Sync' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'reflection', label: 'Reflection' },
]

type GlanceItem = { label: string; icon: string; wide?: boolean; live?: boolean } &
  ({ value: string; pills?: never } | { pills: string[]; value?: never })

const GLANCE_ITEMS: GlanceItem[] = [
  { label: 'Role',         value: 'Sole frontend engineer and product builder', icon: 'role' },
  { label: 'Project Type', value: 'Full-stack AI email platform',               icon: 'type' },
  { label: 'Status',       value: 'Active development',                         icon: 'status', live: true },
  { label: 'Interface',    value: 'Three-panel email workspace',                 icon: 'interface' },
  { label: 'Stack',        pills: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Tiptap'], icon: 'stack' },
  { label: 'Focus',        value: 'Frontend architecture · AI-native workflows · Secure email rendering · Inbox sync UX', icon: 'focus' },
]

const PROBLEMS = [
  {
    num: '01',
    icon: 'shield',
    title: 'Safe Email Rendering',
    text: 'Rendered untrusted Gmail HTML through a sandboxed iframe flow with verified postMessage height updates, late-image-load handling, and CSP nonce protection.',
    tags: ['iframe sandbox', 'CSP nonce', 'postMessage', 'DOMPurify'],
  },
  {
    num: '02',
    icon: 'cpu',
    title: 'AI-Native Inbox',
    text: 'Rendered assistant answers, summaries, drafts, and todos through typed frontend contracts instead of treating AI output as loose text.',
    tags: ['TypeScript', 'typed contracts', 'UI branching'],
  },
  {
    num: '03',
    icon: 'refresh',
    title: 'Background Sync UX',
    text: 'Kept the inbox usable during background sync by separating sync state from render-blocking loading state and merging new threads without unmounting the list.',
    tags: ['React hooks', 'state isolation', 'list merge'],
  },
]

const RENDERING_CODE = `{ type: "iframeHeight", height }

iframe.contentWindow === event.source`

const AI_CODE = `// representative shape from InboxSearchResponse["aiAnswer"]
type Confidence = "high" | "medium" | "low";
type AiAnswerShape = {
  answer: string;
  confidence: Confidence;
  structured?: StructuredAnswer;
};`

const SYNC_CODE = `backgroundSync
  → fetch latest threads
  → merge by externalId
  → sort newest-first
  → keep ThreadList mounted`


function FactIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    role:      <><circle cx="12" cy="8" r="3" /><path d="M5.5 19c.8-3.1 3-4.6 6.5-4.6s5.7 1.5 6.5 4.6" /></>,
    type:      <><path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" /><path d="m6.5 10 5.5 3 5.5-3M6.5 13.5l5.5 3 5.5-3" /></>,
    stack:     <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8M8 12h5M8 15h7" /></>,
    interface: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M8 4v16M15 4v16" /></>,
    status:    <><circle cx="12" cy="12" r="8" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    focus:     <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
    shield:    <><path d="M12 2 4 6v5c0 4.5 3.5 8.7 8 9.9 4.5-1.2 8-5.4 8-9.9V6Z" /><path d="m9 12 2 2 4-4" /></>,
    cpu:       <><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M9 7V5M12 7V5M15 7V5M9 19v-2M12 19v-2M15 19v-2M7 9H5M7 12H5M7 15H5M19 9h-2M19 12h-2M19 15h-2" /></>,
    refresh:   <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>,
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function ImageSlot({
  caption,
  hero = false,
  className = '',
  src,
  videoSrc,
}: {
  caption: string
  hero?: boolean
  className?: string
  src?: string
  videoSrc?: string
}) {
  return (
    <figure className={`${styles.imageSlot} ${hero ? styles.heroImage : ''} ${className}`}>
      {videoSrc ? (
        <video src={videoSrc} autoPlay loop muted playsInline preload="metadata" aria-label={caption} />
      ) : src ? (
        <img src={src} alt={caption} />
      ) : (
        <div role="img" aria-label={`${caption} placeholder`}>
          <span>IMAGE SLOT</span>
          <strong>Drop screenshot or GIF here</strong>
        </div>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function CodeProof({
  code,
  children,
}: {
  code: string
  children: ReactNode
}) {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className={styles.proof}>
      <div className={styles.proofHead}>
        <span>Technical Proof</span>
        <button type="button" onClick={copyCode}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  )
}

function SectionIntro({
  num,
  title,
  children,
}: {
  num: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className={`${styles.sectionIntro} ${styles.reveal}`}>
      <span>{num}</span>
      <h2>{title}</h2>
      {children}
    </header>
  )
}

export default function LunaCaseStudy() {
  const [activeSection, setActiveSection] = useState('glance')

  useEffect(() => {
    const sections = TOC_ITEMS
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-20% 0px -62% 0px', threshold: [0, 0.15, 0.4] },
    )

    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add(styles.visible)
          reveal.unobserve(entry.target)
        })
      },
      { threshold: 0.08 },
    )

    sections.forEach((section) => spy.observe(section))
    document.querySelectorAll(`.${styles.reveal}`).forEach((element) => reveal.observe(element))

    return () => {
      spy.disconnect()
      reveal.disconnect()
    }
  }, [])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Cursor />
      <PillNav homePrefix="/" />

      <main id="main" className={styles.page}>
        <CaseStudyHero
          titleLines={[
            { text: 'Email' },
            { text: 'Intelligence' },
            { text: 'Workspace', em: true },
          ]}
          eyebrow="Frontend Engineering Case Study"
          pitch="LUNA turns a noisy inbox into a structured workspace for search, triage, tasks, summaries, and replies."
          stackCopy={<><strong>Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Tiptap</strong></>}
          imageSrc="/luna-hero-bg.jpg"
          videoSrc="/luna-inbox-video.mp4"
          imageAlt="LUNA dashboard"
          wordmark="LUNA"
          metaCards={[
            { icon: 'role',   label: 'Role',   value: 'Sole frontend engineer and product builder' },
            { icon: 'stack',  label: 'Stack',  value: 'Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Tiptap' },
            { icon: 'status', label: 'Status', value: 'Active development', live: true },
          ]}
        />

        <div className={`wrap ${styles.bodyGrid}`}>
          <aside className={styles.toc}>
            <p>On this page</p>
            <nav aria-label="Case study sections">
              {TOC_ITEMS.map((item) => (
                <a
                  key={item.id}
                  className={activeSection === item.id ? styles.active : ''}
                  href={`#${item.id}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <article className={styles.content}>
            <section className={styles.contentSection} id="glance">
              <SectionIntro num="01" title="At a Glance" />
              <div className={styles.glanceGrid}>
                {GLANCE_ITEMS.map((item, i) => (
                  <div
                    key={item.label}
                    className={`${styles.glanceCard} ${item.wide ? styles.glanceWide : ''} ${styles.reveal}`}
                    style={{ '--reveal-delay': `${i * 65}ms` } as React.CSSProperties}
                  >
                    <div className={styles.glanceIcon}><FactIcon name={item.icon} /></div>
                    <span className={styles.glanceLabel}>
                      {item.label}
                      {item.live && <span className={styles.liveDot} aria-label="Active" />}
                    </span>
                    {item.pills ? (
                      <div className={styles.glancePills}>
                        {item.pills.map((p) => <span key={p}>{p}</span>)}
                      </div>
                    ) : (
                      <p className={styles.glanceValue}>{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Architecture overview diagram ─────────────────────── */}
            <section className={styles.contentSection} id="arch-diagram">
              <SectionIntro num="01b" title="Frontend Architecture and API Surface">
                <p>
                  A layered view of how the five product surfaces feed through focused hooks into the dashboard shell, cross deliberate frontend boundaries, and communicate with the integrations they depend on.
                  Hover a card to trace its path, then click to jump to the relevant section.
                </p>
              </SectionIntro>
              <LunaArchitectureDiagram />
            </section>

            <section className={styles.contentSection} id="problems">
              <SectionIntro num="02" title="Hardest Frontend Problems Solved" />
              <div className={styles.problemGrid}>
                {PROBLEMS.map((problem, i) => (
                  <article
                    key={problem.title}
                    className={`${styles.problemCard} ${styles.reveal}`}
                    style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
                  >
                    <div className={styles.problemHead}>
                      <div className={styles.problemIcon}><FactIcon name={problem.icon} /></div>
                      <span className={styles.problemNum}>{problem.num}</span>
                    </div>
                    <h3>{problem.title}</h3>
                    <p>{problem.text}</p>
                    <div className={styles.problemTags}>
                      {problem.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className={`${styles.contentSection} ${styles.deepDive}`} id="rendering">
              <SectionIntro num="03" title="Rendering Untrusted Email Safely">
                <p>
                  Rendering real email HTML was one of the hardest problems. Email is hostile content — arbitrary HTML,
                  inline CSS, tracking pixels, inline images, and unsafe scripts or handlers — so rendering it directly in
                  React would leak styles into the app or open security holes. LUNA renders email bodies in a sandboxed
                  iframe instead.
                </p>
              </SectionIntro>

              <EmailPipelineFlow />

              <p className={styles.reveal}>
                The hard part is layout: React can't know the natural height of an isolated email document, and that height
                shifts after first paint as tables reflow and images load. The iframe solves this by measuring itself and
                reporting up to the parent — with a few safeguards:
              </p>

              <details className={`${styles.details} ${styles.reveal}`} open>
                <summary>Mechanism details</summary>
                <ul>
                  <li><strong>Verified resize</strong> — the parent applies the height only after confirming <code>event.source</code> is that iframe's own <code>contentWindow</code>, so other frames can't spoof a resize.</li>
                  <li><strong>Late images</strong> — height is reported more than once: immediately, again after each image's <code>load</code>/<code>error</code>, and once more on a timeout fallback.</li>
                  <li><strong>Link safety</strong> — clicks are intercepted inside the iframe; <code>javascript:</code> and hash-only URLs are rejected, navigation is blocked, and valid links open in a new tab.</li>
                  <li><strong>Defense-in-depth</strong> — the backend serves DOMPurify-sanitized HTML under a CSP nonce, so only LUNA's trusted script runs; anything that survived sanitization still couldn't execute without the matching nonce.</li>
                </ul>
              </details>

              <div className={styles.reveal}>
                <CodeProof code={RENDERING_CODE}>
                  <span className={styles.codePunctuation}>{'{'}</span> <span className={styles.codeKey}>type</span>: <span className={styles.codeString}>"iframeHeight"</span>, <span className={styles.codeKey}>height</span> <span className={styles.codePunctuation}>{'}'}</span>{'\n\n'}
                  <span className={styles.codeKey}>iframe</span>.contentWindow === <span className={styles.codeKey}>event</span>.source
                </CodeProof>
              </div>
              <p className={`${styles.proofNote} ${styles.reveal}`}>
                The parent verifies the message source before applying height updates, preventing unrelated frames from spoofing resize events.
              </p>
              <p className={`${styles.why} ${styles.reveal}`}><strong>Why It Matters</strong>LUNA can display real email HTML while protecting the React app from unsafe markup, style leakage, iframe navigation, spoofed resizes, and layout corruption.</p>
              <ImageSlot caption="Sandboxed email rendering flow" videoSrc="/luna-rendering-flow.mp4" className={styles.reveal} />
            </section>

            <section className={`${styles.contentSection} ${styles.deepDive}`} id="ai-inbox">
              <SectionIntro num="04" title="Making AI Feel Native to the Inbox">
                <p>
                  I didn't want LUNA to feel like an email client with a chatbot bolted on. AI shows up inside the normal
                  workflow: search answers in the inbox, summaries on threads, drafts in the compose flow, tasks in the
                  Actions area — all rendered through dedicated cards rather than a separate tool.
                </p>
              </SectionIntro>
              <p className={styles.reveal}>
                The challenge is that AI output has many shapes — plain answers, structured results, summaries, drafts,
                todos. LUNA types each at the API boundary instead of treating it as loose text. Search and assistant
                responses share a common <code>aiAnswer</code> shape; structured answers carry answer type, primary value,
                details, sources, and caveats; summaries, drafts, and todos each have explicit types.
              </p>
              <details className={`${styles.details} ${styles.reveal}`} open>
                <summary>The UI then branches on real fields rather than guessing:</summary>
                <ul>
                  <li>assistant mode renders through <code>AssistantAnswerCard</code></li>
                  <li>structured answers render value, details, sources, and caveats</li>
                  <li>plain answers render as text</li>
                  <li>drafts check <code>shouldDraft</code> before filling the composer</li>
                  <li>todos use typed status, bucket, and type to drive the Actions UI</li>
                </ul>
              </details>
              <div className={`${styles.flow} ${styles.reveal}`}>
                <span>Typed API Response</span><i>→</i>
                <span>Search / Assistant / Draft / Todo shape</span><i>→</i>
                <span>Conditional UI branch</span><i>→</i>
                <span>Dedicated renderer</span>
              </div>
              <div className={styles.reveal}>
                <CodeProof code={AI_CODE}>
                  <span className={styles.codeComment}>// representative shape from InboxSearchResponse["aiAnswer"]</span>{'\n'}
                  <span className={styles.codeKeyword}>type</span> Confidence = <span className={styles.codeString}>"high"</span> | <span className={styles.codeString}>"medium"</span> | <span className={styles.codeString}>"low"</span>;{'\n'}
                  <span className={styles.codeKeyword}>type</span> AiAnswerShape = {'{'}{'\n'}
                  {'  '}answer: <span className={styles.codeKeyword}>string</span>;{'\n'}
                  {'  '}confidence: Confidence;{'\n'}
                  {'  '}structured?: StructuredAnswer;{'\n'}
                  {'}'};
                </CodeProof>
              </div>
              <p className={`${styles.proofNote} ${styles.reveal}`}>Branching on real fields like <code>structured</code> and <code>shouldDraft</code> instead of guessing at runtime.</p>
              <p className={`${styles.why} ${styles.reveal}`}><strong>Why It Matters</strong>An unexpected payload fails predictably instead of rendering garbage — the UI switches between plain answers, structured results, draft review, and todo workflows without fragile runtime assumptions.</p>
              <ImageSlot caption="AI answer card in the inbox" videoSrc="/luna-search-results.mp4" className={styles.reveal} />
            </section>

            <section className={`${styles.contentSection} ${styles.deepDive}`} id="sync">
              <SectionIntro num="05" title="Keeping the Inbox Fresh Without a Global Store">
                <p>
                  When a user connects Gmail, the inbox has to stay fresh while they keep working in it — handled with
                  composable hooks instead of Redux or Zustand. <code>useThreads</code> owns the canonical thread list and exposes
                  explicit sync paths:
                </p>
              </SectionIntro>
              <details className={`${styles.details} ${styles.reveal}`} open>
                <summary>Thread refresh paths</summary>
                <ul>
                  <li>full crawl sync reloads the list</li>
                  <li>background sync merges newer data into the existing list</li>
                  <li>pagination loads more threads without overlapping requests</li>
                  <li>closing a thread can trigger a refresh after message actions</li>
                </ul>
              </details>
              <p className={styles.reveal}>
                The dashboard lifts this state just high enough to coordinate the inbox, search, triage, and thread panels.
                Background sync runs only when Gmail is connected, no thread is open, and the tab is visible, and it also
                refreshes on focus.
              </p>
              <div className={`${styles.flow} ${styles.reveal}`}>
                <span>Dashboard state</span><i>→</i>
                <span>useThreads</span><i>→</i>
                <span>backgroundSync / loadThreads / loadMoreThreads</span><i>→</i>
                <span>ThreadList update</span>
              </div>
              <p className={styles.reveal}>
                The key detail: <code>backgroundSync</code> never triggers the main loading state, so the thread list stays mounted
                while data is fetched and merged — the inbox updates without collapsing into a spinner. Triage status
                runs separately through <code>useTriageStatus</code>, polling faster while a scan is active and cleaning up on
                unmount.
              </p>
              <aside className={`${styles.honest} ${styles.reveal}`}>
                <strong>Honest Status</strong>
                <p>
                  The triage flow is wired through <code>TriageScanBanner</code>, mounted in the inbox panel and receiving <code>triageStatus</code>. The separate <code>InboxCrawlBanner</code> and <code>useInboxCrawlStatus</code> exist, but the crawl banner isn't yet mounted in the active dashboard — a small wiring task, not missing functionality.
                </p>
              </aside>
              <div className={styles.reveal}>
                <CodeProof code={SYNC_CODE}>
                  <span className={styles.codeKey}>backgroundSync</span>{'\n'}
                  {'  '}<span className={styles.codeString}>→</span> fetch latest threads{'\n'}
                  {'  '}<span className={styles.codeString}>→</span> merge by externalId{'\n'}
                  {'  '}<span className={styles.codeString}>→</span> sort newest-first{'\n'}
                  {'  '}<span className={styles.codeString}>→</span> keep ThreadList mounted
                </CodeProof>
              </div>
              <p className={`${styles.why} ${styles.reveal}`}><strong>Why It Matters</strong>The inbox stays fresh without global state infrastructure and without interrupting the user's reading flow.</p>
              <ImageSlot caption="Background sync UI" videoSrc="/luna-inbox-video.mp4" className={styles.reveal} />
            </section>

            <section className={styles.contentSection} id="architecture">
              <SectionIntro num="06" title="Frontend Architecture: Hooks, Boundaries, and UI Systems">
                <p>
                  LUNA's frontend state spans auth, thread loading and selection, search, sync and triage progress,
                  pagination, and row-level UI. Rather than a global store, I split it by domain into focused hooks — <code>useAuth</code>, <code>useThreads</code>, <code>useSearch</code>, <code>useTriageStatus</code>, <code>useInboxCrawlStatus</code>. The point isn't "no global store"; it's that each hook owns one clear part of the product's behavior.
                </p>
              </SectionIntro>
              <p className={styles.reveal}>Backend communication goes through a single typed API client:</p>
              <div className={`${styles.flow} ${styles.reveal}`}>
                <span>React Components</span><i>→</i>
                <span>Custom Hooks</span><i>→</i>
                <span>Typed API Client</span><i>→</i>
                <span>Backend API</span>
              </div>
              <p className={styles.reveal}>This keeps raw fetch calls out of components and centralizes auth and error handling. Components are organized by product system:</p>
              <ul className={`${styles.systemList} ${styles.reveal}`}>
                <li><strong>Inbox:</strong> <code>InboxPanel</code>, <code>ThreadList</code>, <code>ThreadRow</code></li>
                <li><strong>Thread reading:</strong> <code>ThreadPanel</code>, <code>MessageCard</code></li>
                <li><strong>AI interaction:</strong> <code>LunaSearch</code>, <code>AssistantAnswerCard</code></li>
                <li><strong>Compose:</strong> <code>ReplyComposer</code>, <code>ComposeCard</code></li>
                <li><strong>Productivity:</strong> <code>ActionsPage</code>, <code>PeoplePage</code>, <code>TodoQualityPage</code></li>
              </ul>

              <div className={`${styles.limits} ${styles.reveal}`}>
                <h3>7. Performance, Accessibility, and Honest Limits</h3>
                <p>The frontend is built around practical performance boundaries, not premature optimization:</p>
                <ul>
                  <li>background sync fetches and merges threads without triggering the main loading state</li>
                  <li>the thread list stays mounted while new data is fetched</li>
                  <li>pagination is guarded against overlapping load requests</li>
                  <li>repeated todo and people projections are memoized</li>
                  <li>row-level UI state stays inside the thread list rather than being lifted</li>
                  <li>iframe content measures itself instead of forcing React to compute unknown email height</li>
                </ul>
                <p>I avoided overclaiming: the app uses React 19 but not its concurrent APIs (<code>startTransition</code>, <code>useTransition</code>, <code>useDeferredValue</code>), and it doesn't yet use list virtualization or <code>React.memo</code>. Those are future work, not current claims.</p>
                <p>Accessibility is the clearest gap — keyboard navigation and focus management matter for an email tool. Next: keyboard shortcuts, stronger focus states, screen-reader labels, virtualized lists, better loading/empty/error states, Playwright E2E tests, streaming AI responses, and explicit React transitions for large background updates.</p>
              </div>
            </section>

            <section className={`${styles.contentSection} ${styles.reflection}`} id="reflection">
              <SectionIntro num="07" title="Closing — Outcome and Reflection" />
              <p className={styles.reveal}>Building LUNA's frontend taught me that strong frontend engineering is less about visual polish than about making complex system behavior understandable.</p>
              <p className={styles.reveal} style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>The clearest case was inbox sync: an empty inbox during background processing can feel broken even when nothing is wrong, which pushed me to treat sync and triage as product UI rather than backend status. The same instinct shaped the harder problems — typing AI so the UI branches on real fields instead of guessing, and sandboxing email so security and faithful rendering aren't a tradeoff.</p>
              <p className={styles.reveal} style={{ '--reveal-delay': '160ms' } as React.CSSProperties}>To me, frontend is the layer where product behavior, system architecture, data contracts, and user trust meet.</p>
              <p className={styles.reveal} style={{ '--reveal-delay': '240ms' } as React.CSSProperties}><strong>Next for LUNA:</strong> keyboard navigation, stronger accessibility, virtualized lists, Playwright E2E tests, and streaming AI responses.</p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </>
  )
}
