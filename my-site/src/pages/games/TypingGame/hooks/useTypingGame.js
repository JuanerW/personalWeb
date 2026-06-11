import { useRef, useReducer, useEffect, useCallback, useState } from 'react'
import { TIERS } from '../data/wordList'

// Speed: % of arena height per millisecond
const BASE_SPEED = 0.0095   // ~10.5 s to fall
const MAX_SPEED  = 0.030    // ~3.3 s to fall
const BASE_SPAWN = 3200     // ms between spawns (base)
const MIN_SPAWN  = 900      // ms between spawns (max difficulty)

function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)) }

function getSpeed(score) {
  return lerp(BASE_SPEED, MAX_SPEED, score / 700)
}

function getMaxWords(score) {
  return Math.min(2 + Math.floor(score / 250), 6)
}

function getSpawnInterval(score) {
  return Math.round(lerp(BASE_SPAWN, MIN_SPAWN, score / 700))
}

function tierWeights(score) {
  if (score < 150)  return [1,    0,    0]
  if (score < 400)  return [0.25, 0.75, 0]
  return                   [0.1,  0.55, 0.35]
}

function pickWord(score, used) {
  const w = tierWeights(score)
  const r = Math.random()
  let tier = 2
  let cum = 0
  for (let i = 0; i < w.length; i++) {
    cum += w[i]
    if (r < cum) { tier = i; break }
  }
  const pool = TIERS[tier].filter(word => !used.has(word))
  if (!pool.length) {
    // reset used for this tier and retry
    TIERS[tier].forEach(word => used.delete(word))
    return TIERS[tier][Math.floor(Math.random() * TIERS[tier].length)]
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

let _nextId = 1

export default function useTypingGame() {
  const [phase, setPhase] = useState('idle')
  const phaseRef = useRef('idle')

  const gRef = useRef({
    words: [],
    score: 0,
    lives: 3,
    input: '',
    targetId: null,
    used: new Set(),
    lastSpawn: -999999,
  })

  const [, forceRender] = useReducer(x => x + 1, 0)
  const rafRef   = useRef(null)
  const lastTsRef = useRef(null)

  // ── start / restart ─────────────────────────────────────────────────────
  const start = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    gRef.current = {
      words: [],
      score: 0,
      lives: 3,
      input: '',
      targetId: null,
      used: new Set(),
      lastSpawn: -999999,
    }
    lastTsRef.current = null
    phaseRef.current = 'playing'
    setPhase('playing')
  }, [])

  // ── RAF game loop ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return

    function loop(ts) {
      if (phaseRef.current !== 'playing') return

      const g = gRef.current
      const dt = lastTsRef.current == null
        ? 16
        : Math.min(ts - lastTsRef.current, 50)
      lastTsRef.current = ts

      // Spawn
      const spawnInt = getSpawnInterval(g.score)
      const maxW     = getMaxWords(g.score)
      if (g.words.length < maxW && ts - g.lastSpawn >= spawnInt) {
        const text = pickWord(g.score, g.used)
        g.used.add(text)
        g.words = [...g.words, {
          id:    _nextId++,
          text,
          x:     4 + Math.random() * 70,   // 4%–74% so long words fit
          y:     0,
          speed: getSpeed(g.score),
        }]
        g.lastSpawn = ts
      }

      // Move + boundary check
      let lost = 0
      const alive = []
      for (const w of g.words) {
        const ny = w.y + w.speed * dt
        if (ny >= 100) {
          lost++
          if (g.targetId === w.id) { g.targetId = null; g.input = '' }
        } else {
          alive.push({ ...w, y: ny })
        }
      }
      g.words = alive

      if (lost > 0) {
        g.lives = Math.max(0, g.lives - lost)
        if (g.lives === 0) {
          phaseRef.current = 'dead'
          forceRender()
          setPhase('dead')
          return
        }
      }

      forceRender()
      rafRef.current = requestAnimationFrame(loop)
    }

    lastTsRef.current = null
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase])

  // ── keyboard handler ────────────────────────────────────────────────────
  const handleKey = useCallback((e) => {
    if (phaseRef.current !== 'playing') return

    const g = gRef.current

    if (e.key === 'Backspace') {
      if (g.input.length > 1) {
        g.input = g.input.slice(0, -1)
      } else {
        g.input = ''
        g.targetId = null
      }
      forceRender()
      return
    }

    if (e.key === 'Escape') {
      g.input = ''
      g.targetId = null
      forceRender()
      return
    }

    if (!/^[a-zA-Z]$/.test(e.key)) return
    const ch   = e.key.toLowerCase()
    const next = g.input + ch

    if (g.targetId != null) {
      const target = g.words.find(w => w.id === g.targetId)
      if (!target) {
        // target already died
        g.targetId = null; g.input = ''
        forceRender(); return
      }
      if (!target.text.startsWith(next)) return   // wrong key, ignore
      g.input = next
      if (g.input === target.text) {
        g.words  = g.words.filter(w => w.id !== g.targetId)
        g.score += target.text.length * 10
        g.input  = ''
        g.targetId = null
      }
    } else {
      // Auto-target: find words whose text starts with `next`,
      // prefer the lowest (most urgent)
      const cands = g.words.filter(w => w.text.startsWith(next))
      if (!cands.length) return
      const target = cands.reduce((a, b) => a.y > b.y ? a : b)
      g.targetId = target.id
      g.input    = next
      if (g.input === target.text) {
        g.words  = g.words.filter(w => w.id !== g.targetId)
        g.score += target.text.length * 10
        g.input  = ''
        g.targetId = null
      }
    }

    forceRender()
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // ── public API ───────────────────────────────────────────────────────────
  const g = gRef.current
  return { phase, words: g.words, score: g.score, lives: g.lives, input: g.input, targetId: g.targetId, start }
}
