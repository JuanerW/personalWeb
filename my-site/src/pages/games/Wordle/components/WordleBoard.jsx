import styles from './WordleBoard.module.css'
import { MAX_GUESSES, WORD_LENGTH } from '../hooks/useWordle'

function Tile({ letter, state, animate, delay }) {
  const cls = [
    styles.tile,
    state ? styles[state] : '',
    animate ? styles.reveal : '',
  ].join(' ')

  return (
    <div
      className={cls}
      data-state={state || 'empty'}
      style={animate ? { '--delay': `${delay}ms` } : undefined}
    >
      {letter}
    </div>
  )
}

export default function WordleBoard({ guesses, current, shake }) {
  const rows = []
  for (let r = 0; r < MAX_GUESSES; r++) {
    if (r < guesses.length) {
      rows.push({ type: 'submitted', guess: guesses[r], isLatest: r === guesses.length - 1 })
    } else if (r === guesses.length) {
      rows.push({ type: 'current' })
    } else {
      rows.push({ type: 'empty' })
    }
  }

  return (
    <div className={styles.board}>
      {rows.map((row, r) => (
        <div
          key={r}
          className={`${styles.row} ${shake && row.type === 'current' ? styles.shake : ''}`}
        >
          {row.type === 'submitted'
            ? row.guess.result.map((state, c) => (
                <Tile
                  key={c}
                  letter={row.guess.word[c].toUpperCase()}
                  state={state}
                  animate={row.isLatest}
                  delay={c * 300}
                />
              ))
            : Array.from({ length: WORD_LENGTH }, (_, c) => (
                <Tile
                  key={c}
                  letter={row.type === 'current' ? (current[c] || '').toUpperCase() : ''}
                  state={row.type === 'current' && current[c] ? 'typed' : null}
                />
              ))
          }
        </div>
      ))}
    </div>
  )
}
