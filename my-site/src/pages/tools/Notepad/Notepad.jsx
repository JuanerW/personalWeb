import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../LangContext'
import styles from './Notepad.module.css'

const STORAGE_KEY = 'notepad-content'

export default function Notepad() {
  const { T } = useLang()
  const [content, setContent] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setContent(saved)
  }, [])

  function handleChange(e) {
    const val = e.target.value
    setContent(val)
    localStorage.setItem(STORAGE_KEY, val)
  }

  function handleClear() {
    if (!confirmClear) { setConfirmClear(true); return }
    setContent('')
    localStorage.removeItem(STORAGE_KEY)
    setConfirmClear(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.back}>{T.back}</Link>
          <h1 className={styles.title}>{T.notepadTitle}</h1>
          <button className={styles.clearBtn} onClick={handleClear}>
            {confirmClear ? T.notepadConfirmClear : T.notepadClear}
          </button>
        </div>
        <div className={styles.status}>{T.notepadStatus(content.length)}</div>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={handleChange}
          placeholder={T.notepadPlaceholder}
        />
      </div>
    </div>
  )
}
