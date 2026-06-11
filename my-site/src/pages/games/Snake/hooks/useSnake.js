import { useState, useCallback, useRef, useEffect } from 'react'

const GRID_SIZE = 20
const INITIAL_SPEED = 150
const SPEED_INCREMENT = 5
const MIN_SPEED = 80

function randomFood(snake) {
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`))
  let pos
  do {
    pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }
  } while (occupied.has(`${pos.x},${pos.y}`))
  return pos
}

function initGame() {
  const snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]
  const food = randomFood(snake)
  return { snake, food, direction: 'right', nextDirection: 'right', score: 0, status: 'idle' }
}

const oppositeDirs = { up: 'down', down: 'up', left: 'right', right: 'left' }

export default function useSnake() {
  const savedBest = parseInt(localStorage.getItem('snake-best'), 10) || 0
  const [state, setState] = useState(initGame)
  const [bestScore, setBestScore] = useState(savedBest)
  const intervalRef = useRef(null)

  const updateBest = useCallback((score) => {
    if (score > savedBest) {
      setBestScore(score)
      localStorage.setItem('snake-best', String(score))
    }
  }, [savedBest])

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const getSpeed = useCallback((score) => {
    return Math.max(INITIAL_SPEED - Math.floor(score / 5) * SPEED_INCREMENT, MIN_SPEED)
  }, [])

  const step = useCallback(() => {
    setState(prev => {
      if (prev.status !== 'playing') return prev
      const direction = prev.nextDirection
      const head = prev.snake[0]
      let newHead
      switch (direction) {
        case 'up':    newHead = { x: head.x, y: head.y - 1 }; break
        case 'down':  newHead = { x: head.x, y: head.y + 1 }; break
        case 'left':  newHead = { x: head.x - 1, y: head.y }; break
        case 'right': newHead = { x: head.x + 1, y: head.y }; break
        default: return prev
      }

      // Wrap around edges instead of dying
      newHead = {
        x: ((newHead.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE,
        y: ((newHead.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE,
      }

      // Check self collision
      if (prev.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
        return { ...prev, status: 'lost' }
      }

      const ateFood = newHead.x === prev.food.x && newHead.y === prev.food.y
      const newSnake = [newHead, ...prev.snake]
      if (!ateFood) newSnake.pop()

      const newScore = ateFood ? prev.score + 10 : prev.score
      const newFood = ateFood ? randomFood(newSnake) : prev.food

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        direction,
        score: newScore,
      }
    })
  }, [])

  // Timer effect
  useEffect(() => {
    if (state.status === 'playing') {
      const speed = getSpeed(state.score)
      clearTimer()
      intervalRef.current = setInterval(step, speed)
    } else {
      clearTimer()
    }
    return clearTimer
  }, [state.status, state.score, step, clearTimer, getSpeed])

  // Update best when score changes
  useEffect(() => {
    updateBest(state.score)
  }, [state.score, updateBest])

  const changeDirection = useCallback((dir) => {
    setState(prev => {
      if (prev.status === 'idle') {
        // Start game
        return { ...prev, nextDirection: dir, direction: dir, status: 'playing' }
      }
      if (prev.status !== 'playing') return prev
      if (dir === oppositeDirs[prev.direction]) return prev
      return { ...prev, nextDirection: dir }
    })
  }, [])

  const togglePause = useCallback(() => {
    setState(prev => {
      if (prev.status === 'playing') return { ...prev, status: 'paused' }
      if (prev.status === 'paused') return { ...prev, status: 'playing' }
      return prev
    })
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setState(initGame())
  }, [clearTimer])

  return {
    snake: state.snake,
    food: state.food,
    direction: state.direction,
    score: state.score,
    bestScore,
    status: state.status,
    changeDirection,
    togglePause,
    reset,
  }
}