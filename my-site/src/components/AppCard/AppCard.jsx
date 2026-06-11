import { Link } from 'react-router-dom'
import styles from './AppCard.module.css'

export default function AppCard({ title, description, path, color, emoji }) {
  return (
    <Link to={path} className={styles.card} style={{ backgroundColor: `var(${color})` }}>
      <div className={styles.emoji}>{emoji}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </Link>
  )
}