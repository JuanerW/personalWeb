import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Calculator.module.css'

function formatDisplay(n) {
  if (n === undefined || n === null) return '0'
  const str = String(n)
  if (str.length > 9) {
    return parseFloat(n).toExponential(3)
  }
  return str
}

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  function inputDigit(digit) {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(prev => prev === '0' ? String(digit) : prev + digit)
    }
  }

  function inputDecimal() {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (display.includes('.')) return
    setDisplay(prev => prev + '.')
  }

  function clearAll() {
    setDisplay('0')
    setPrevValue(null)
    setOperator(null)
    setWaitingForOperand(false)
  }

  function toggleSign() {
    const val = parseFloat(display)
    if (val === 0) return
    setDisplay(String(-val))
  }

  function inputPercent() {
    const val = parseFloat(display)
    setDisplay(String(val / 100))
  }

  function performOperation(nextOp) {
    const current = parseFloat(display)

    if (prevValue === null) {
      setPrevValue(current)
    } else if (operator) {
      const result = calculate(prevValue, current, operator)
      setDisplay(formatDisplay(result))
      setPrevValue(result)
    }

    if (nextOp === '=') {
      setOperator(null)
      setPrevValue(null)
    } else {
      setOperator(nextOp)
    }
    setWaitingForOperand(true)
  }

  function calculate(a, b, op) {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 'Error'
      default: return b
    }
  }

  const fontSize = display.length > 9 ? '24px' : display.length > 6 ? '32px' : '40px'

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/" className={styles.back}>&larr; 返回</Link>
          <h1 className={styles.title}>计算器</h1>
        </div>

        <div className={styles.calculator}>
          <div className={styles.display} style={{ fontSize }}>
            {display}
          </div>

          <div className={styles.keypad}>
            <button className={`${styles.key} ${styles.func}`} onClick={clearAll}>AC</button>
            <button className={`${styles.key} ${styles.func}`} onClick={toggleSign}>+/-</button>
            <button className={`${styles.key} ${styles.func}`} onClick={inputPercent}>%</button>
            <button className={`${styles.key} ${styles.op}`} onClick={() => performOperation('÷')}>÷</button>

            <button className={`${styles.key} ${styles.num}`} onClick={() => inputDigit(7)}>7</button>
            <button className={`${styles.key} ${styles.num}`} onClick={() => inputDigit(8)}>8</button>
            <button className={`${styles.key} ${styles.num}`} onClick={() => inputDigit(9)}>9</button>
            <button className={`${styles.key} ${styles.op}`} onClick={() => performOperation('×')}>×</button>

            <button className={`${styles.key} ${styles.num}`} onClick={() => inputDigit(4)}>4</button>
            <button className={`${styles.key} ${styles.num}`} onClick={() => inputDigit(5)}>5</button>
            <button className={`${styles.key} ${styles.num}`} onClick={() => inputDigit(6)}>6</button>
            <button className={`${styles.key} ${styles.op}`} onClick={() => performOperation('-')}>-</button>

            <button className={`${styles.key} ${styles.num}`} onClick={() => inputDigit(1)}>1</button>
            <button className={`${styles.key} ${styles.num}`} onClick={() => inputDigit(2)}>2</button>
            <button className={`${styles.key} ${styles.num}`} onClick={() => inputDigit(3)}>3</button>
            <button className={`${styles.key} ${styles.op}`} onClick={() => performOperation('+')}>+</button>

            <button className={`${styles.key} ${styles.num} ${styles.zero}`} onClick={() => inputDigit(0)}>0</button>
            <button className={`${styles.key} ${styles.num}`} onClick={inputDecimal}>.</button>
            <button className={`${styles.key} ${styles.eq}`} onClick={() => performOperation('=')}>=</button>
          </div>
        </div>
      </div>
    </div>
  )
}