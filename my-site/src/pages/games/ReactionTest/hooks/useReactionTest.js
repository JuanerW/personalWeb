import { useState, useRef, useCallback, useEffect } from 'react'

export const PHASE = { idle: 'idle', waiting: 'waiting', ready: 'ready', result: 'result' }

export default function useReactionTest() {
  const [phase,   setPhase]   = useState(PHASE.idle)
  const [result,  setResult]  = useState(null)   // { time: number|null, tooEarly: boolean }
  const [history, setHistory] = useState([])     // valid times only

  const timerRef = useRef(null)
  const startRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }, [])

  // Clean up timer on unmount
  useEffect(() => clearTimer, [clearTimer])

  const startRound = useCallback(() => {
    setPhase(PHASE.waiting)
    setResult(null)
    const delay = 2000 + Math.random() * 4000   // 2 – 6 s
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now()
      setPhase(PHASE.ready)
    }, delay)
  }, [])

  const click = useCallback(() => {
    switch (phase) {
      case PHASE.idle:
        startRound()
        break

      case PHASE.waiting:
        clearTimer()
        setResult({ time: null, tooEarly: true })
        setPhase(PHASE.result)
        break

      case PHASE.ready: {
        const ms = Math.round(performance.now() - startRef.current)
        setResult({ time: ms, tooEarly: false })
        setHistory(h => [ms, ...h].slice(0, 5))
        setPhase(PHASE.result)
        break
      }

      case PHASE.result:
        setPhase(PHASE.idle)
        break
    }
  }, [phase, startRound, clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    setPhase(PHASE.idle)
    setResult(null)
    setHistory([])
  }, [clearTimer])

  const best = history.length ? Math.min(...history) : null
  const avg  = history.length ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : null

  return { phase, result, history, best, avg, click, reset }
}
