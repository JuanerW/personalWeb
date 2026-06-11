import { Link } from 'react-router-dom'
import { useLang } from '../../../LangContext'
import useTypingGame from './hooks/useTypingGame'
import styles from './TypingGame.module.css'

function FallingWord({ word, input, isTarget }) {
  const typed = isTarget ? input.length : 0
  return (
    <div
      className={`${styles.word} ${isTarget ? styles.wordTarget : ''}`}
      style={{ left: `${word.x}%`, top: `${word.y}%` }}
    >
      {typed > 0 && <span className={styles.typed}>{word.text.slice(0, typed)}</span>}
      <span className={styles.untyped}>{word.text.slice(typed)}</span>
    </div>
  )
}

export default function TypingGame() {
  const { T } = useLang()
  const { phase, words, score, lives, input, targetId, start } = useTypingGame()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.back}>{T.back}</Link>
        <h1 className={styles.title}>{T.typingTitle}</h1>
        <div className={styles.hud}>
          <span className={styles.score}>{score}</span>
          <div className={styles.lives}>
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className={i < lives ? styles.heartOn : styles.heartOff}>♥</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.arena}>
        {/* Falling words */}
        {words.map(w => (
          <FallingWord
            key={w.id}
            word={w}
            input={input}
            isTarget={w.id === targetId}
          />
        ))}

        {/* Danger zone line */}
        <div className={styles.dangerLine} />

        {/* Start / Game Over overlay */}
        {phase !== 'playing' && (
          <div className={styles.overlay}>
            {phase === 'idle' && (
              <div className={styles.overlayBox}>
                <div className={styles.overlayHead}>{T.typingTitle}</div>
                <p className={styles.overlayDesc}>{T.typingSubtitle}</p>
                <button className={styles.startBtn} onClick={start}>{T.typingStart}</button>
                <p className={styles.overlayHint}>{T.typingHint}</p>
              </div>
            )}
            {phase === 'dead' && (
              <div className={styles.overlayBox}>
                <div className={styles.overlaySmall}>{T.gameOver}</div>
                <div className={styles.finalScore}>{score}</div>
                <div className={styles.scoreLabel}>{T.typingScore}</div>
                <button className={styles.startBtn} onClick={start}>{T.typingRetry}</button>
              </div>
            )}
          </div>
        )}

        {/* Live input indicator */}
        {phase === 'playing' && (
          <div className={styles.inputPill}>
            <span className={styles.inputText}>{input || '▮'}</span>
          </div>
        )}
      </div>

      <p className={styles.footHint}>{T.typingHint}</p>
    </div>
  )
}
