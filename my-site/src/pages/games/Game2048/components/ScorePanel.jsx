import styles from './ScorePanel.module.css'

export default function ScorePanel({ score, bestScore }) {
  return (
    <div className={styles.panel}>
      <div className={styles.capsule}>
        <span className={styles.label}>SCORE</span>
        <span className={styles.value}>{score}</span>
      </div>
      <div className={styles.capsule}>
        <span className={styles.label}>BEST</span>
        <span className={styles.value}>{bestScore}</span>
      </div>
    </div>
  )
}