export type ExperienceItem = {
  id: string;
  date: string;
  title: string;
  org: string;
  description: string;
  tags: string[];
};

export const experience: ExperienceItem[] = [
  {
    id: 'ta-sfsu',
    date: 'Aug 2025 — Now',
    title: 'Undergraduate Teaching Assistant',
    org: 'San Francisco State University · CSC 210 (Intro to Programming)',
    description:
      'Run weekly office hours, grade lab assignments for ~80 students, and help redesign the autograder test suite to give kinder, more actionable feedback.',
    tags: ['Teaching', 'Python'],
  },
  {
    id: 'intern-beacon',
    date: 'May 2025 — Aug 2025',
    title: 'Software Engineering Intern',
    org: 'Beacon Health Tech · San Francisco, CA',
    description:
      'Rebuilt a patient-intake form that cut completion time by ~40%. Worked across the stack in TypeScript + Go, shipped behind feature flags, wrote the migration runbook.',
    tags: ['TypeScript', 'Go', 'Postgres'],
  },
  {
    id: 'oss',
    date: 'Sep 2024 — Now',
    title: 'Open Source Contributor',
    org: 'Various · GitHub',
    description:
      'Small, focused PRs to the tools I use every day — error messages, docs fixes, one non-trivial feature in a popular Rust CLI. Slow and steady.',
    tags: ['Rust', 'Docs'],
  },
  {
    id: 'freelance',
    date: 'Jun 2024 — Aug 2024',
    title: 'Freelance Web Developer',
    org: 'Local businesses · Bay Area',
    description:
      'Built 3 small marketing sites for family-owned businesses. Shaped my taste for writing CSS people can actually maintain, and for honest estimates.',
    tags: ['HTML/CSS', 'Astro'],
  },
];
