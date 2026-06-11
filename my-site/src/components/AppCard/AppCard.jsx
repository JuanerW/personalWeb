import { Link } from 'react-router-dom'
import styles from './AppCard.module.css'

export default function AppCard({ title, description, path, emoji, type }) {
  return (
    <Link to={path} className={styles.card}>
      <div className={styles.emoji}>{emoji}</div>
      <div className={styles.type}>{type}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </Link>
  )
}
