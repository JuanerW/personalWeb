import { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../LangContext'
import use2048 from './hooks/use2048'
import useSwipe from './hooks/useSwipe'
import Board from './components/Board'
import ScorePanel from './components/ScorePanel'
import styles from './Game2048.module.css'

export default function Game2048() {
  const { T } = useLang()
  const { board, score, bestScore, status, move, reset, continueGame, lastMove } = use2048()

  const handleKeyDown = useCallback((e) => {
    const keyMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
    const dir = keyMap[e.key]
    if (dir) { e.preventDefault(); move(dir) }
  }, [move])

  useSwipe(move)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.back}>{T.back}</Link>
          <h1 className={styles.title}>2048</h1>
          <button className={styles.resetBtn} onClick={reset}>{T.restart}</button>
        </div>

        <div className={styles.scoreRow}>
          <ScorePanel score={score} bestScore={bestScore} />
        </div>

        <div className={styles.boardWrapper}>
          <Board board={board} lastMove={lastMove} />
          {status !== 'playing' && (
            <div className={styles.overlay}>
              {status === 'won' && (
                <div className={styles.overlayContent}>
                  <div className={styles.overlayText}>{T.won2048}</div>
                  <div className={styles.overlayBtns}>
                    <button className={styles.btn} onClick={continueGame}>{T.continueGame}</button>
                    <button className={styles.btn} onClick={reset}>{T.restart}</button>
                  </div>
                </div>
              )}
              {status === 'lost' && (
                <div className={styles.overlayContent}>
                  <div className={styles.overlayText}>{T.gameOver}</div>
                  <button className={styles.btn} onClick={reset}>{T.restart}</button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className={styles.hint}>{T.hint2048}</p>
      </div>
    </div>
  )
}
