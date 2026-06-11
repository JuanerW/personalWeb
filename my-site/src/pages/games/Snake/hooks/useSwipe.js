import { useEffect, useRef } from 'react'

export default function useSwipe(onSwipe, { minDistance = 30 } = {}) {
  const startRef = useRef(null)

  useEffect(() => {
    function handleTouchStart(e) {
      const touch = e.touches[0]
      startRef.current = { x: touch.clientX, y: touch.clientY }
    }

    function handleTouchEnd(e) {
      if (!startRef.current) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - startRef.current.x
      const dy = touch.clientY - startRef.current.y
      startRef.current = null

      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      if (Math.max(absDx, absDy) < minDistance) return

      if (absDx > absDy) {
        onSwipe(dx > 0 ? 'right' : 'left')
      } else {
        onSwipe(dy > 0 ? 'down' : 'up')
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipe, minDistance])
}