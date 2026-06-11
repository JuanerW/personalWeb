import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Notepad.module.css'

const STORAGE_KEY = 'notepad-content'

export default function Notepad() {
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
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    setContent('')
    localStorage.removeItem(STORAGE_KEY)
    setConfirmClear(false)
  }

  const wordCount = content.length

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.back}>&larr; 返回</Link>
          <h1 className={styles.title}>记事本</h1>
          <button className={styles.clearBtn} onClick={handleClear}>
            {confirmClear ? '确认清空？' : '清空'}
          </button>
        </div>
        <div className={styles.status}>
          已自动保存 · 共 {wordCount} 字
        </div>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={handleChange}
          placeholder="开始输入..."
        />
      </div>
    </div>
  )
}