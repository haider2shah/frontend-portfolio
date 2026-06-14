import type { SkillGroupData } from '../../data/skills'
import { LanguagesIcon, WebIcon, SystemsIcon, ToolsIcon } from '../../icons/Icons'
import styles from './Skills.module.css'

const iconMap = {
  languages: <LanguagesIcon />,
  web: <WebIcon />,
  systems: <SystemsIcon />,
  tools: <ToolsIcon />,
}

interface Props {
  group: SkillGroupData
}

export default function SkillGroup({ group }: Props) {
  const strongCount = group.skills.filter((skill) => skill.strong).length

  return (
    <div className={styles.skillGroup}>
      <div className={styles.groupHead}>
        <h4>
          <span className={styles.ico}>{iconMap[group.icon]}</span>
          {group.label}
        </h4>
        <span className={styles.count}>{strongCount || group.skills.length}</span>
      </div>
      <ul>
        {group.skills.map((skill) => (
          <li key={skill.name} className={skill.strong ? styles.strong : undefined}>
            <span className={styles.skillName}>{skill.name}</span>
            <span className={styles.level}>{skill.level}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
