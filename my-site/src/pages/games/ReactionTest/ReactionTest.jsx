import { Link } from 'react-router-dom'
import { useLang } from '../../../LangContext'
import useReactionTest, { PHASE } from './hooks/useReactionTest'
import styles from './ReactionTest.module.css'

const PHASE_DATA = {
  [PHASE.idle]:    { bg: 'idle' },
  [PHASE.waiting]: { bg: 'waiting' },
  [PHASE.ready]:   { bg: 'ready' },
  [PHASE.result]:  { bg: 'result' },
}

export default function ReactionTest() {
  const { T } = useLang()
  const { phase, result, history, best, avg, click, reset } = useReactionTest()

  const earlyResult = phase === PHASE.result && result?.tooEarly

  function mainMessage() {
    if (phase === PHASE.idle)    return T.reactionClickToStart
    if (phase === PHASE.waiting) return T.reactionWaiting
    if (phase === PHASE.ready)   return T.reactionGo
    if (earlyResult)             return T.reactionTooEarly
    return T.reactionMs(result.time)
  }

  function subMessage() {
    if (phase === PHASE.idle)    return T.reactionIdleHint
    if (phase === PHASE.waiting) return T.reactionWaitingHint
    if (phase === PHASE.ready)   return null
    if (earlyResult)             return T.reactionTryAgain
    return T.reactionAgainHint
  }

  const sub = subMessage()

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <div className={styles.header}>
          <Link to="/" className={styles.back}>{T.back}</Link>
          <h1 className={styles.title}>{T.reactionTitle}</h1>
          <button className={styles.resetBtn} onClick={reset}>{T.restart}</button>
        </div>

        {/* Main game area */}
        <div
          className={`${styles.arena} ${earlyResult ? styles.early : styles[PHASE_DATA[phase].bg]}`}
          onClick={click}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === ' ' || e.key === 'Enter' ? click() : null}
          aria-label={mainMessage()}
        >
          <div className={styles.mainMsg}>{mainMessage()}</div>
          {sub && <div className={styles.subMsg}>{sub}</div>}
        </div>

        {/* Stats */}
        {history.length > 0 && (
          <div className={styles.stats}>
            <div className={styles.statRow}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>{T.reactionBest}</div>
                <div className={styles.statVal}>{best} ms</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>{T.reactionAvg}</div>
                <div className={styles.statVal}>{avg} ms</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>{T.reactionAttempts}</div>
                <div className={styles.statVal}>{history.length}</div>
              </div>
            </div>
            <div className={styles.history}>
              {history.map((t, i) => (
                <span key={i} className={`${styles.histChip} ${t === best ? styles.histBest : ''}`}>
                  {t} ms
                </span>
              ))}
            </div>
          </div>
        )}

        <p className={styles.hint}>{T.hintReaction}</p>
      </div>
    </div>
  )
}
