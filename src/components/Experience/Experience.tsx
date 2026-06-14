import SectionHead from '../SectionHead/SectionHead'
import ExperienceItem from './ExperienceItem'
import { experience } from '../../data/experience'
import styles from './Experience.module.css'

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-h">
      <div className="wrap">
        <SectionHead
          num="02"
          title="Experience"
          titleId="experience-h"
        />
        <div className={`${styles.expList} reveal-stagger`}>
          {experience.map((item) => (
            <ExperienceItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
