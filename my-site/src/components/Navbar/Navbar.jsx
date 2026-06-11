import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <a href="../" className={styles.back}>← 简历</a>
        <Link to="/" className={styles.logo}>
          🎮 小游戏与工具
        </Link>
      </div>
    </nav>
  )
}