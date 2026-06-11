import { useState, useCallback, useRef } from 'react'
import { PALETTES, generateGradient } from '../utils/colorUtils'

const COUNT = 12   // total swatches per puzzle (2 locked + 10 movable)

// ── helpers ──────────────────────────────────────────────────────────────────

function fisherYates(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildItems(paletteIdx) {
  const colors = generateGradient(PALETTES[paletteIdx], COUNT)
  const all = colors.map((color, id) => ({ id, color, locked: id === 0 || id === COUNT - 1 }))

  // Shuffle middle; guarantee it differs from solution
  const endpoints = [all[0], all[COUNT - 1]]
  let middle
  do {
    middle = fisherYates(all.slice(1, -1))
  } while (middle.every((item, i) => item.id === i + 1))

  return [endpoints[0], ...middle, endpoints[1]]
}

function isSolved(items) {
  return items.every((item, i) => item.id === i)
}

// ── hook ─────────────────────────────────────────────────────────────────────

export default function useHueSorter() {
  const paletteIdxRef = useRef(0)
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [items, setItems]           = useState(() => buildItems(0))
  const [moves, setMoves]           = useState(0)
  const [solved, setSolved]         = useState(false)
  const [draggingId, setDraggingId] = useState(null)
  const [overId, setOverId]         = useState(null)
  const [elapsed, setElapsed]       = useState(0)

  const t0Ref      = useRef(null)
  const timerRef   = useRef(null)
  const dropFired  = useRef(false)   // prevents dragend undoing a committed drop

  function startTimer() {
    if (t0Ref.current != null) return
    t0Ref.current = Date.now()
    timerRef.current = setInterval(() => setElapsed(Date.now() - t0Ref.current), 500)
  }

  function stopTimer() {
    clearInterval(timerRef.current)
    timerRef.current = null
  }

  // ── public actions ────────────────────────────────────────────────────────

  const newGame = useCallback((pIdx) => {
    const idx = pIdx ?? paletteIdxRef.current
    paletteIdxRef.current = idx
    setPaletteIdx(idx)
    stopTimer()
    t0Ref.current = null
    dropFired.current = false
    setItems(buildItems(idx))
    setMoves(0)
    setSolved(false)
    setDraggingId(null)
    setOverId(null)
    setElapsed(0)
  }, [])

  const nextPalette = useCallback(() => {
    newGame((paletteIdxRef.current + 1) % PALETTES.length)
  }, [newGame])

  function onDragStart(id) {
    if (solved) return
    dropFired.current = false
    setDraggingId(id)
    startTimer()
  }

  function onDragOver(id) {
    if (id !== draggingId) setOverId(id)
  }

  function onDrop(targetId) {
    dropFired.current = true
    setDraggingId(null)
    setOverId(null)

    if (draggingId == null || draggingId === targetId) return

    setItems(prev => {
      const fi = prev.findIndex(x => x.id === draggingId)
      const ti = prev.findIndex(x => x.id === targetId)
      if (prev[fi].locked || prev[ti].locked) return prev

      const next = [...prev]
      ;[next[fi], next[ti]] = [next[ti], next[fi]]

      if (isSolved(next)) {
        setSolved(true)
        stopTimer()
      }
      return next
    })
    setMoves(m => m + 1)
  }

  function onDragEnd() {
    // only clear visual state if no successful drop occurred
    if (!dropFired.current) {
      setDraggingId(null)
      setOverId(null)
    }
    dropFired.current = false
  }

  return {
    palette: PALETTES[paletteIdx],
    items,
    moves,
    solved,
    draggingId,
    overId,
    elapsed,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    newGame: () => newGame(),
    nextPalette,
  }
}
