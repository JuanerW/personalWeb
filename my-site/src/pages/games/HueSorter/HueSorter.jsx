import { Link } from 'react-router-dom'
import { useLang } from '../../../LangContext'
import useHueSorter from './hooks/useHueSorter'
import { hslStr } from './utils/colorUtils'
import styles from './HueSorter.module.css'

function pad2(n) { return String(n).padStart(2, '0') }
function fmtTime(ms) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${pad2(s % 60)}`
}

export default function HueSorter() {
  const { lang, T } = useLang()
  const {
    palette, items, moves, solved,
    draggingId, overId, elapsed,
    onDragStart, onDragOver, onDrop, onDragEnd,
    newGame, nextPalette,
  } = useHueSorter()

  const paletteName = lang === 'zh' ? palette.nameZh : palette.name

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <Link to="/" className={styles.back}>{T.back}</Link>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{T.hueTitle}</h1>
          <span className={styles.palName}>{paletteName}</span>
        </div>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <span className={styles.statLabel}>{T.hueMoves}</span>{moves}
          </span>
          <span className={styles.stat}>
            <span className={styles.statLabel}>{T.hueTime}</span>{fmtTime(elapsed)}
          </span>
        </div>
      </div>

      {/* ── Puzzle ── */}
      <div className={styles.arena}>
        <p className={styles.hint}>{T.hueHint}</p>

        {/* Swatch row */}
        <div className={styles.row}>
          {items.map(item => {
            const isDragging = draggingId === item.id
            const isOver     = overId === item.id && !item.locked
            return (
              <div
                key={item.id}
                className={[
                  styles.swatch,
                  item.locked   ? styles.locked   : '',
                  isDragging    ? styles.dragging  : '',
                  isOver        ? styles.over      : '',
                  solved        ? styles.solved    : '',
                ].filter(Boolean).join(' ')}
                style={{ '--color': hslStr(item.color) }}
                draggable={!item.locked && !solved}
                onDragStart={() => onDragStart(item.id)}
                onDragOver={e => { e.preventDefault(); onDragOver(item.id) }}
                onDrop={e => { e.preventDefault(); onDrop(item.id) }}
                onDragEnd={onDragEnd}
              />
            )
          })}
        </div>

        {/* Lock legend */}
        <p className={styles.lockNote}>{T.hueLockNote}</p>

        {/* Win banner */}
        {solved && (
          <div className={styles.winBanner}>
            <span className={styles.winEmoji}>🎨</span>
            <span className={styles.winText}>{T.hueSolved}</span>
            <span className={styles.winSub}>{T.hueSolvedSub(moves, fmtTime(elapsed))}</span>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.btn} onClick={newGame}>{T.hueRetry}</button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={nextPalette}>
            {T.hueNext}
          </button>
        </div>
      </div>
    </div>
  )
}
