export type ProjectLink = {
  label: string;
  url: string;
  icon: 'github' | 'external';
};

export type Project = {
  id: string;
  url?: string;
  featured?: boolean;
  thumbVariant: string;
  tagOverlay: string;
  year: string;
  meta: string[];
  title: string;
  description: string;
  stack: string[];
  links: ProjectLink[];
  readLabel: string;
};

export const projects: Project[] = [
  {
    id: 'luna',
    url: '/case-studies/luna',
    featured: true,
    thumbVariant: 'luna',
    tagOverlay: 'Frontend · Case study',
    year: 'Active development',
    meta: [],
    title: 'LUNA — Email Intelligence Workspace',
    description:
      'LUNA turns a noisy inbox into a structured workspace for search, triage, tasks, summaries, and replies.',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Tiptap'],
    links: [],
    readLabel: 'Read case study',
  },
  {
    id: 'plum',
    thumbVariant: 'plum',
    tagOverlay: 'Systems · CLI',
    year: '2025',
    meta: [],
    title: 'plum — a tiny, fast package manager',
    description:
      'A learn-by-building exercise in parsing, dependency resolution and async I/O. Ships as a single 4MB binary with a friendlier UX than the tool it imitates.',
    stack: ['Rust', 'Tokio', 'SQLite'],
    links: [],
    readLabel: 'Details',
  },
  {
    id: 'nano-sh',
    thumbVariant: 'nano',
    tagOverlay: 'C · Operating Systems',
    year: '2025',
    meta: [],
    title: 'nano-sh — a Unix shell in ~600 lines of C',
    description:
      "Pipes, redirects, job control, tab completion. Built as the capstone for my OS course — the best way I've found to actually understand how fork/exec/dup2 fit together.",
    stack: ['C', 'POSIX', 'Make'],
    links: [],
    readLabel: 'Write-up',
  },
  {
    id: 'leaf',
    thumbVariant: 'leaf',
    tagOverlay: 'Python · ML',
    year: '2024',
    meta: ['Python · ML', 'Research'],
    title: 'leaf — predicting study-session productivity',
    description:
      'A small classifier trained on sensor + calendar data from my own quantified-self logs. Not Nobel-worthy, but honest work on cleaning messy real-world data.',
    stack: ['Python', 'scikit-learn', 'pandas'],
    links: [],
    readLabel: 'Details',
  },
  {
    id: 'tidepool',
    thumbVariant: 'tidepool',
    tagOverlay: 'Go · Hackathon winner',
    year: '2025',
    meta: ['Go + WebSockets', 'Team of 3'],
    title: 'tidepool — real-time collaborative whiteboard',
    description:
      'A 36-hour hackathon build that won "Best Technical" at CodeSF \'25. Supports 50+ concurrent editors with CRDT-based conflict resolution and a tiny Go backend.',
    stack: ['Go', 'WebSockets', 'React', 'Yjs'],
    links: [],
    readLabel: 'Read more',
  },
];
