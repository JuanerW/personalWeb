import { useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../LangContext'
import useWordle from './hooks/useWordle'
import WordleBoard from './components/WordleBoard'
import WordleKeyboard from './components/WordleKeyboard'
import styles from './Wordle.module.css'

export default function Wordle() {
  const { T } = useLang()
  const {
    guesses, current, status, shake, message, letterStates,
    addLetter, deleteLetter, submitGuess, newGame, share,
  } = useWordle()

  const [copied, setCopied] = useState(false)

  const handleKey = useCallback(key => {
    if (key === 'ENTER') {
      submitGuess({
        notEnough: T.wordleNotEnough,
        invalid:   T.wordleInvalidWord,
        won:       T.wordleWon,
        lost:      T.wordleLost,
      })
    } else if (key === '⌫') {
      deleteLetter()
    } else if (/^[A-Z]$/.test(key)) {
      addLetter(key)
    }
  }, [submitGuess, deleteLetter, addLetter, T])

  useEffect(() => {
    const onKey = e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Enter')     { e.preventDefault(); handleKey('ENTER'); return }
      if (e.key === 'Backspace') { e.preventDefault(); handleKey('⌫');    return }
      if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleKey])

  const handleShare = useCallback(() => {
    share()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [share])

  const gameOver = status === 'won' || status === 'lost'

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <Link to="/" className={styles.back}>{T.back}</Link>
          <h1 className={styles.title}>{T.wordleTitle}</h1>
          <button className={styles.newBtn} onClick={newGame}>{T.wordleNew}</button>
        </div>

        {/* Toast message */}
        <div className={`${styles.toast} ${message ? styles.toastVisible : ''}`}>
          {message}
        </div>

        {/* Board */}
        <WordleBoard guesses={guesses} current={current} shake={shake} />

        {/* Spacer */}
        <div className={styles.gap} />

        {/* Keyboard */}
        {status !== 'loading' && (
          <WordleKeyboard
            letterStates={letterStates}
            onKey={handleKey}
            enterLabel={T.wordleEnter}
            deleteLabel="⌫"
          />
        )}

        {/* Post-game share strip */}
        {gameOver && (
          <button className={styles.shareBtn} onClick={handleShare}>
            {copied ? T.wordleCopied : T.wordleShare}
          </button>
        )}

        <p className={styles.hint}>{T.hintWordle}</p>
      </div>
    </div>
  )
}
