import styles from './WordleKeyboard.module.css'

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
]

export default function WordleKeyboard({ letterStates, onKey, enterLabel, deleteLabel }) {
  return (
    <div className={styles.keyboard}>
      {ROWS.map((row, r) => (
        <div key={r} className={styles.row}>
          {row.map(key => {
            const isWide  = key === 'ENTER' || key === '⌫'
            const display = key === 'ENTER' ? enterLabel : key === '⌫' ? deleteLabel : key
            const state   = key.length === 1 ? letterStates[key.toLowerCase()] : undefined
            return (
              <button
                key={key}
                className={`${styles.key} ${isWide ? styles.wide : ''} ${state ? styles[state] : ''}`}
                onClick={() => onKey(key)}
                aria-label={key}
              >
                {display}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
