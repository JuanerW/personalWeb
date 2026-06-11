import { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../LangContext'
import useSnake from './hooks/useSnake'
import useSwipe from './hooks/useSwipe'
import SnakeBoard from './components/SnakeBoard'
import StatusPanel from './components/StatusPanel'
import styles from './Snake.module.css'

export default function Snake() {
  const { T } = useLang()
  const { snake, food, score, bestScore, status, changeDirection, togglePause, reset } = useSnake()

  const handleKeyDown = useCallback((e) => {
    const keyMap = {
      ArrowUp: 'up', w: 'up',
      ArrowDown: 'down', s: 'down',
      ArrowLeft: 'left', a: 'left',
      ArrowRight: 'right', d: 'right',
    }
    const dir = keyMap[e.key]
    if (dir) { e.preventDefault(); changeDirection(dir) }
    if (e.key === ' ') { e.preventDefault(); togglePause() }
  }, [changeDirection, togglePause])

  useSwipe(changeDirection)

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.back}>{T.back}</Link>
          <h1 className={styles.title}>{T.snakeTitle}</h1>
          <button className={styles.resetBtn} onClick={reset}>{T.restart}</button>
        </div>

        <div className={styles.scoreRow}>
          <StatusPanel score={score} bestScore={bestScore} />
        </div>

        <div className={styles.boardWrapper}>
          <SnakeBoard snake={snake} food={food} />
          {status !== 'playing' && (
            <div className={styles.overlay}>
              {status === 'idle' && (
                <div className={styles.overlayContent}>
                  <div className={styles.overlayText}>{T.pressToStart}</div>
                </div>
              )}
              {status === 'paused' && (
                <div className={styles.overlayContent}>
                  <div className={styles.overlayText}>{T.paused}</div>
                  <button className={styles.btn} onClick={togglePause}>{T.resume}</button>
                </div>
              )}
              {status === 'lost' && (
                <div className={styles.overlayContent}>
                  <div className={styles.overlayText}>{T.gameOver}</div>
                  <div className={styles.scoreText}>{T.scoreLabel}{score}</div>
                  <button className={styles.btn} onClick={reset}>{T.restart}</button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className={styles.hint}>{T.hintSnake}</p>
      </div>
    </div>
  )
}
