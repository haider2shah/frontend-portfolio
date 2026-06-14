export type SkillLevel = 'Strong' | 'Comfortable' | 'Learning' | 'Daily' | 'Assignments';

export type Skill = {
  name: string;
  level: SkillLevel;
  strong?: boolean;
};

export type SkillGroupData = {
  id: string;
  icon: 'languages' | 'web' | 'systems' | 'tools';
  label: string;
  skills: Skill[];
};

export const skillGroups: SkillGroupData[] = [
  {
    id: 'languages',
    icon: 'languages',
    label: 'Languages',
    skills: [
      { name: 'Python', level: 'Strong', strong: true },
      { name: 'TypeScript', level: 'Strong', strong: true },
      { name: 'JavaScript', level: 'Strong', strong: true },
      { name: 'C', level: 'Comfortable' },
      { name: 'Go', level: 'Comfortable' },
      { name: 'Rust', level: 'Learning' },
      { name: 'SQL', level: 'Comfortable' },
    ],
  },
  {
    id: 'web',
    icon: 'web',
    label: 'Web',
    skills: [
      { name: 'React / Next.js', level: 'Strong', strong: true },
      { name: 'HTML & CSS', level: 'Strong', strong: true },
      { name: 'Node.js', level: 'Comfortable' },
      { name: 'REST + GraphQL', level: 'Comfortable' },
      { name: 'Tailwind', level: 'Comfortable' },
    ],
  },
  {
    id: 'systems',
    icon: 'systems',
    label: 'Systems & data',
    skills: [
      { name: 'PostgreSQL', level: 'Strong', strong: true },
      { name: 'Git & CI', level: 'Strong', strong: true },
      { name: 'Linux / Unix', level: 'Comfortable' },
      { name: 'Docker', level: 'Comfortable' },
      { name: 'Redis', level: 'Comfortable' },
    ],
  },
  {
    id: 'tools',
    icon: 'tools',
    label: 'Also using',
    skills: [
      { name: 'Figma', level: 'Comfortable' },
      { name: 'AWS basics', level: 'Comfortable' },
      { name: 'Vitest / Pytest', level: 'Comfortable' },
      { name: 'Linear & Notion', level: 'Daily' },
      { name: 'LaTeX', level: 'Assignments' },
    ],
  },
];
