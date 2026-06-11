import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Calendar.module.css'

const STORAGE_KEY = 'calendar-notes'

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const days = []
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, current: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false })
  }
  return days
}

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function Calendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [notes, setNotes] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [noteInput, setNoteInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setNotes(JSON.parse(saved))
  }, [])

  function saveNotes(newNotes) {
    setNotes(newNotes)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes))
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
  }

  function handleDayClick(day, current) {
    if (!current) return
    const dateStr = formatDate(year, month, day)
    setSelectedDate(dateStr)
    setNoteInput(notes[dateStr] || '')
  }

  function saveNote() {
    if (!selectedDate) return
    const newNotes = { ...notes }
    if (noteInput.trim()) {
      newNotes[selectedDate] = noteInput.trim()
    } else {
      delete newNotes[selectedDate]
    }
    saveNotes(newNotes)
  }

  const days = getMonthDays(year, month)
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate())
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.back}>&larr; 返回</Link>
          <h1 className={styles.title}>日历</h1>
        </div>

        <div className={styles.calendar}>
          <div className={styles.monthNav}>
            <button className={styles.navBtn} onClick={prevMonth}>{'<'}</button>
            <span className={styles.monthLabel}>{year}年{month + 1}月</span>
            <button className={styles.navBtn} onClick={nextMonth}>{'>'}</button>
          </div>

          <div className={styles.weekRow}>
            {weekDays.map(d => <div key={d} className={styles.weekDay}>{d}</div>)}
          </div>

          <div className={styles.daysGrid}>
            {days.map((d, i) => {
              const dateStr = d.current ? formatDate(year, month, d.day) : null
              const isToday = dateStr === todayStr
              const hasNote = dateStr && notes[dateStr]
              const isSelected = dateStr === selectedDate
              return (
                <div
                  key={i}
                  className={`${styles.day} ${d.current ? styles.current : styles.other} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handleDayClick(d.day, d.current)}
                >
                  <span>{d.day}</span>
                  {hasNote && <span className={styles.dot} />}
                </div>
              )
            })}
          </div>
        </div>

        {selectedDate && (
          <div className={styles.noteArea}>
            <div className={styles.noteHeader}>
              <span className={styles.noteDate}>{selectedDate} 的备忘</span>
              <button className={styles.saveBtn} onClick={saveNote}>保存</button>
            </div>
            <textarea
              className={styles.noteInput}
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="输入备忘内容..."
            />
          </div>
        )}
      </div>
    </div>
  )
}