import { useState, useCallback } from 'react'

let _nextId = 0
const uid = () => ++_nextId

function randomFreeCell(tiles) {
  const occupied = new Set(tiles.map(t => `${t.row},${t.col}`))
  const free = []
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (!occupied.has(`${r},${c}`)) free.push([r, c])
  if (!free.length) return null
  return free[Math.floor(Math.random() * free.length)]
}

function spawnRandom(tiles) {
  const cell = randomFreeCell(tiles)
  if (!cell) return tiles
  const [row, col] = cell
  return [...tiles, { id: uid(), value: Math.random() < 0.9 ? 2 : 4, row, col, isNew: true, isMerged: false }]
}

function initTiles() {
  return spawnRandom(spawnRandom([]))
}

// Coordinate transforms so all directions reduce to "slide left"
function toLocal(row, col, dir) {
  switch (dir) {
    case 'left':  return [row, col]
    case 'right': return [row, 3 - col]
    case 'up':    return [col, row]
    case 'down':  return [col, 3 - row]
    default:      return [row, col]
  }
}
function fromLocal(lr, lc, dir) {
  switch (dir) {
    case 'left':  return [lr, lc]
    case 'right': return [lr, 3 - lc]
    case 'up':    return [lc, lr]
    case 'down':  return [3 - lc, lr]
    default:      return [lr, lc]
  }
}

function applyMove(tiles, dir) {
  const local = tiles.map(t => {
    const [lr, lc] = toLocal(t.row, t.col, dir)
    return { ...t, lr, lc }
  })

  const rows = [[], [], [], []]
  local.forEach(t => rows[t.lr].push(t))
  rows.forEach(r => r.sort((a, b) => a.lc - b.lc))

  const result = []
  let addedScore = 0
  let moved = false

  rows.forEach((rowTiles, lr) => {
    let destCol = 0
    let i = 0
    while (i < rowTiles.length) {
      const a = rowTiles[i]
      if (i + 1 < rowTiles.length && rowTiles[i + 1].value === a.value) {
        result.push({ id: a.id, value: a.value * 2, lr, lc: destCol, isNew: false, isMerged: true })
        addedScore += a.value * 2
        moved = true  // merging always means movement
        i += 2
      } else {
        result.push({ id: a.id, value: a.value, lr, lc: destCol, isNew: false, isMerged: false })
        if (a.lr !== lr || a.lc !== destCol) moved = true
        i++
      }
      destCol++
    }
  })

  if (!moved) return { newTiles: tiles, addedScore: 0, moved: false }

  const worldTiles = result.map(t => {
    const [row, col] = fromLocal(t.lr, t.lc, dir)
    return { id: t.id, value: t.value, row, col, isNew: false, isMerged: t.isMerged }
  })

  return { newTiles: worldTiles, addedScore, moved: true }
}

function hasMove(tiles) {
  for (const dir of ['left', 'right', 'up', 'down']) {
    const { moved } = applyMove(tiles, dir)
    if (moved) return true
  }
  return false
}

export default function use2048() {
  const [tiles, setTiles] = useState(initTiles)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => parseInt(localStorage.getItem('2048-best'), 10) || 0)
  const [status, setStatus] = useState('playing')

  const move = useCallback((dir) => {
    if (status !== 'playing') return
    setTiles(prev => {
      const { newTiles, addedScore, moved } = applyMove(prev, dir)
      if (!moved) return prev

      const withSpawn = spawnRandom(newTiles)

      if (addedScore > 0) {
        setScore(s => {
          const ns = s + addedScore
          setBestScore(prevBest => {
            if (ns > prevBest) {
              localStorage.setItem('2048-best', String(ns))
              return ns
            }
            return prevBest
          })
          return ns
        })
      }

      const won  = withSpawn.some(t => t.value >= 2048)
      const over = !won && !hasMove(withSpawn)
      if (won)  setStatus('won')
      if (over) setStatus('lost')

      return withSpawn
    })
  }, [status])

  const reset = useCallback(() => {
    setTiles(initTiles())
    setScore(0)
    setStatus('playing')
  }, [])

  const continueGame = useCallback(() => setStatus('playing'), [])

  return { tiles, score, bestScore, status, move, reset, continueGame }
}
