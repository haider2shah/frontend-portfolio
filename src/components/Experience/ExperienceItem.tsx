import type { ExperienceItem as ExperienceItemType } from '../../data/experience'
import styles from './Experience.module.css'

interface Props {
  item: ExperienceItemType
}

export default function ExperienceItem({ item }: Props) {
  return (
    <div className={styles.expItem}>
      <div className={styles.expDate}>{item.date}</div>
      <div className={styles.expBody}>
        <h3>{item.title}</h3>
        <div className={styles.org}>{item.org}</div>
        <p>{item.description}</p>
      </div>
      <div className={styles.expTags}>
        {item.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  )
}
