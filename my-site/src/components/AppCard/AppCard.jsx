import { Link } from 'react-router-dom'
import styles from './AppCard.module.css'

export default function AppCard({ title, description, path, href, emoji, type }) {
  const inner = (
    <>
      <div className={styles.emoji}>{emoji}</div>
      <div className={styles.type}>{type}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </>
  )

  if (href) {
    return <a href={href} className={styles.card}>{inner}</a>
  }
  return <Link to={path} className={styles.card}>{inner}</Link>
}
