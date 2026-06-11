import { useState, useEffect, useCallback } from 'react'

export const CORRECT = 'correct'
export const PRESENT = 'present'
export const ABSENT  = 'absent'

export const MAX_GUESSES = 6
export const WORD_LENGTH  = 5

const REVEAL_MS = (WORD_LENGTH - 1) * 300 + 500 + 150  // ~1950ms after submit

function evaluate(guess, answer) {
  const result = new Array(WORD_LENGTH).fill(ABSENT)
  const pool   = answer.split('')
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) { result[i] = CORRECT; pool[i] = null }
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === CORRECT) continue
    const j = pool.indexOf(guess[i])
    if (j !== -1) { result[i] = PRESENT; pool[j] = null }
  }
  return result
}

function dailyIndex(total) {
  const epoch = new Date(2024, 0, 1)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return (Math.floor((today - epoch) / 86400000) % total + total) % total
}

function randomIndex(total) {
  return Math.floor(Math.random() * total)
}

export default function useWordle() {
  const [words,   setWords]   = useState([])
  const [answer,  setAnswer]  = useState('')
  const [guesses, setGuesses] = useState([])   // [{word, result}]
  const [current, setCurrent] = useState('')
  const [status,  setStatus]  = useState('loading')  // loading | playing | won | lost
  const [shake,   setShake]   = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'words.txt')
      .then(r => r.text())
      .then(text => {
        const list = text.split(/\r?\n/)
          .map(w => w.trim().toLowerCase())
          .filter(w => w.length === WORD_LENGTH)
        setWords(list)
        setAnswer(list[dailyIndex(list.length)])
        setStatus('playing')
      })
      .catch(() => setStatus('error'))
  }, [])

  const flash = useCallback((msg, ms = 1800) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), ms)
  }, [])

  const triggerShake = useCallback(() => {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }, [])

  const addLetter = useCallback(letter => {
    if (status !== 'playing' || current.length >= WORD_LENGTH) return
    setCurrent(c => c + letter.toLowerCase())
  }, [status, current.length])

  const deleteLetter = useCallback(() => {
    if (status !== 'playing') return
    setCurrent(c => c.slice(0, -1))
  }, [status])

  const submitGuess = useCallback(msgs => {
    if (status !== 'playing') return
    if (current.length < WORD_LENGTH) {
      flash(msgs.notEnough); triggerShake(); return
    }
    if (!words.includes(current)) {
      flash(msgs.invalid); triggerShake(); return
    }

    const result      = evaluate(current, answer)
    const nextGuesses = [...guesses, { word: current, result }]
    setGuesses(nextGuesses)
    setCurrent('')

    if (current === answer) {
      const m = msgs.won(nextGuesses.length)
      setTimeout(() => { setStatus('won'); flash(m, 3500) }, REVEAL_MS)
    } else if (nextGuesses.length >= MAX_GUESSES) {
      const m = msgs.lost(answer.toUpperCase())
      setTimeout(() => { setStatus('lost'); flash(m, 4000) }, REVEAL_MS)
    }
  }, [status, current, words, answer, guesses, flash, triggerShake])

  // Keyboard letter states (correct > present > absent priority)
  const PRIO = { [CORRECT]: 3, [PRESENT]: 2, [ABSENT]: 1 }
  const letterStates = {}
  for (const { word, result } of guesses) {
    for (let i = 0; i < WORD_LENGTH; i++) {
      const l = word[i]; const s = result[i]
      if (!letterStates[l] || PRIO[s] > PRIO[letterStates[l]]) letterStates[l] = s
    }
  }

  const newGame = useCallback(() => {
    if (!words.length) return
    setAnswer(words[randomIndex(words.length)])
    setGuesses([])
    setCurrent('')
    setStatus('playing')
    setMessage('')
  }, [words])

  const share = useCallback(() => {
    const map  = { [CORRECT]: '🟩', [PRESENT]: '🟨', [ABSENT]: '⬛' }
    const score = status === 'won' ? guesses.length : 'X'
    const grid  = guesses.map(g => g.result.map(s => map[s]).join('')).join('\n')
    const text  = `Wordle ${score}/${MAX_GUESSES}\n\n${grid}`
    navigator.clipboard?.writeText(text)
    return text
  }, [guesses, status])

  return {
    answer, guesses, current, status, shake, message, letterStates,
    addLetter, deleteLetter, submitGuess, newGame, share,
  }
}
