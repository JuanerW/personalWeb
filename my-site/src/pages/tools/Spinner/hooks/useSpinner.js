import { useState, useCallback } from 'react'

const STORAGE_KEY = 'spinner-items'

const defaultItems = [
  { id: '1', label: '选项一', color: '#FAC775', emoji: '🎉' },
  { id: '2', label: '选项二', color: '#F5C4B3', emoji: '🌟' },
  { id: '3', label: '选项三', color: '#F4C0D1', emoji: '🎊' },
  { id: '4', label: '选项四', color: '#EEEDFE', emoji: '✨' },
]

function loadItems() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try { return JSON.parse(saved) } catch { return defaultItems }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems))
  return defaultItems
}

export default function useSpinner() {
  const [items, setItems] = useState(loadItems)
  const [rotating, setRotating] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState(null)

  const saveItems = useCallback((newItems) => {
    setItems(newItems)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
  }, [])

  const addItem = useCallback(() => {
    const newItem = {
      id: Date.now().toString(),
      label: `选项${items.length + 1}`,
      color: '#FAC775',
      emoji: '🎉',
    }
    saveItems([...items, newItem])
  }, [items, saveItems])

  const updateItem = useCallback((id, updates) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    )
    saveItems(newItems)
  }, [items, saveItems])

  const removeItem = useCallback((id) => {
    if (items.length <= 2) return
    const newItems = items.filter(item => item.id !== id)
    saveItems(newItems)
  }, [items, saveItems])

  const spin = useCallback(() => {
    if (rotating || items.length < 2) return
    setRotating(true)
    setResult(null)

    const extraSpins = 3 + Math.floor(Math.random() * 3)
    const randomOffset = Math.random() * 360
    const finalAngle = rotation + extraSpins * 360 + randomOffset

    setRotation(finalAngle)

    setTimeout(() => {
      const normalized = ((finalAngle % 360) + 360) % 360
      const pointerAngle = (360 - normalized + 270) % 360
      const sectorSize = 360 / items.length

      let winnerIndex = 0
      for (let i = 0; i < items.length; i++) {
        const start = i * sectorSize
        const end = (i + 1) * sectorSize
        if (pointerAngle >= start && pointerAngle < end) {
          winnerIndex = i
          break
        }
      }

      setResult(items[winnerIndex])
      setRotating(false)
    }, 4200)
  }, [rotating, items, rotation])

  const closeResult = useCallback(() => {
    setResult(null)
  }, [])

  return {
    items,
    rotation,
    rotating,
    result,
    addItem,
    updateItem,
    removeItem,
    spin,
    closeResult,
    setResult,
  }
}