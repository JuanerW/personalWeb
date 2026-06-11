import { Link } from 'react-router-dom'
import { useLang } from '../../LangContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { T } = useLang()
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <a href="../" className={styles.back}>{T.backToResume}</a>
        <Link to="/" className={styles.logo}>{T.navTitle}</Link>
      </div>
    </nav>
  )
}
