import { useState, useCallback, useEffect } from 'react'

function getEmptyBoard() {
  return Array.from({ length: 4 }, () => Array(4).fill(0))
}

function getRandomEmptyCell(board) {
  const empty = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) empty.push([r, c])
    }
  }
  if (empty.length === 0) return null
  return empty[Math.floor(Math.random() * empty.length)]
}

function addRandomTile(board) {
  const cell = getRandomEmptyCell(board)
  if (!cell) return board
  const [r, c] = cell
  const newBoard = board.map(row => [...row])
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4
  return newBoard
}

function initBoard() {
  let board = getEmptyBoard()
  board = addRandomTile(board)
  board = addRandomTile(board)
  return board
}

function mergeLeft(row) {
  let filtered = row.filter(v => v !== 0)
  let score = 0
  const merged = []
  let i = 0
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2)
      score += filtered[i] * 2
      i += 2
    } else {
      merged.push(filtered[i])
      i += 1
    }
  }
  while (merged.length < 4) merged.push(0)
  return { row: merged, score }
}

function moveLeft(board) {
  let totalScore = 0
  const newBoard = board.map(row => {
    const { row: newRow, score } = mergeLeft(row)
    totalScore += score
    return newRow
  })
  return { newBoard, totalScore }
}

function moveRight(board) {
  const flipped = board.map(row => [...row].reverse())
  const { newBoard, totalScore } = moveLeft(flipped)
  return { newBoard: newBoard.map(row => row.reverse()), totalScore }
}

function moveUp(board) {
  const transposed = board[0].map((_, col) => board.map(row => row[col]))
  const { newBoard, totalScore } = moveLeft(transposed)
  const result = newBoard[0].map((_, col) => newBoard.map(row => row[col]))
  return { newBoard: result, totalScore }
}

function moveDown(board) {
  const transposed = board[0].map((_, col) => board.map(row => row[col]))
  const { newBoard, totalScore } = moveRight(transposed)
  const result = newBoard[0].map((_, col) => newBoard.map(row => row[col]))
  return { newBoard: result, totalScore }
}

const moveFunctions = { left: moveLeft, right: moveRight, up: moveUp, down: moveDown }

function boardsEqual(a, b) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (a[r][c] !== b[r][c]) return false
    }
  }
  return true
}

function isWon(board) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] >= 2048) return true
    }
  }
  return false
}

function isGameOver(board) {
  for (const dir of ['left', 'right', 'up', 'down']) {
    const { newBoard } = moveFunctions[dir](board)
    if (!boardsEqual(board, newBoard)) return false
  }
  return true
}

export default function use2048() {
  const savedBest = parseInt(localStorage.getItem('2048-best'), 10) || 0
  const [board, setBoard] = useState(initBoard)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(savedBest)
  const [status, setStatus] = useState('playing')
  const [lastMove, setLastMove] = useState(null) // { board, direction }

  const updateBest = useCallback((newScore) => {
    if (newScore > savedBest) {
      setBestScore(newScore)
      localStorage.setItem('2048-best', String(newScore))
    }
  }, [savedBest])

  const move = useCallback((direction) => {
    if (status !== 'playing') return
    setBoard(prev => {
      const fn = moveFunctions[direction]
      if (!fn) return prev
      const { newBoard, totalScore } = fn(prev)
      if (boardsEqual(prev, newBoard)) return prev

      setLastMove({ board: prev, direction })
      setScore(s => {
        const newScore = s + totalScore
        updateBest(newScore)
        return newScore
      })

      let nextBoard = addRandomTile(newBoard)

      if (isWon(nextBoard)) {
        setStatus('won')
      } else if (isGameOver(nextBoard)) {
        setStatus('lost')
      }

      return nextBoard
    })
  }, [status, updateBest])

  const reset = useCallback(() => {
    setBoard(initBoard())
    setScore(0)
    setStatus('playing')
    setLastMove(null)
  }, [])

  const continueGame = useCallback(() => {
    setStatus('playing')
  }, [])

  return { board, score, bestScore, status, move, reset, continueGame, lastMove }
}