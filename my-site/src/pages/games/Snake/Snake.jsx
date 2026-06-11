import { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import useSnake from './hooks/useSnake'
import useSwipe from './hooks/useSwipe'
import SnakeBoard from './components/SnakeBoard'
import StatusPanel from './components/StatusPanel'
import styles from './Snake.module.css'

export default function Snake() {
  const { snake, food, score, bestScore, status, changeDirection, togglePause, reset } = useSnake()

  const handleKeyDown = useCallback((e) => {
    const keyMap = {
      ArrowUp: 'up', w: 'up',
      ArrowDown: 'down', s: 'down',
      ArrowLeft: 'left', a: 'left',
      ArrowRight: 'right', d: 'right',
    }
    const dir = keyMap[e.key]
    if (dir) {
      e.preventDefault()
      changeDirection(dir)
    }
    if (e.key === ' ') {
      e.preventDefault()
      togglePause()
    }
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
          <Link to="/" className={styles.back}>&larr; 返回</Link>
          <h1 className={styles.title}>贪吃蛇</h1>
          <button className={styles.resetBtn} onClick={reset}>重新开始</button>
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
                  <div className={styles.overlayText}>按方向键开始游戏</div>
                </div>
              )}
              {status === 'paused' && (
                <div className={styles.overlayContent}>
                  <div className={styles.overlayText}>已暂停</div>
                  <button className={styles.btn} onClick={togglePause}>继续</button>
                </div>
              )}
              {status === 'lost' && (
                <div className={styles.overlayContent}>
                  <div className={styles.overlayText}>游戏结束</div>
                  <div className={styles.scoreText}>得分：{score}</div>
                  <button className={styles.btn} onClick={reset}>重新开始</button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className={styles.hint}>方向键 / WASD / 滑动 来操作 · 空格暂停</p>
      </div>
    </div>
  )
}