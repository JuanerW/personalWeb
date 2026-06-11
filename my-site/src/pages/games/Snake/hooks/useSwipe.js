import { useEffect, useRef } from 'react'

export default function useSwipe(onSwipe, { minDistance = 30 } = {}) {
  const startRef = useRef(null)

  useEffect(() => {
    function getDir(dx, dy) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < minDistance) return null
      return Math.abs(dx) > Math.abs(dy)
        ? (dx > 0 ? 'right' : 'left')
        : (dy > 0 ? 'down'  : 'up')
    }

    // Touch
    function onTouchStart(e) {
      const t = e.touches[0]
      startRef.current = { x: t.clientX, y: t.clientY }
    }
    function onTouchEnd(e) {
      if (!startRef.current) return
      const t   = e.changedTouches[0]
      const dir = getDir(t.clientX - startRef.current.x, t.clientY - startRef.current.y)
      startRef.current = null
      if (dir) onSwipe(dir)
    }

    // Mouse
    function onMouseDown(e) {
      startRef.current = { x: e.clientX, y: e.clientY }
    }
    function onMouseUp(e) {
      if (!startRef.current) return
      const dir = getDir(e.clientX - startRef.current.x, e.clientY - startRef.current.y)
      startRef.current = null
      if (dir) onSwipe(dir)
    }
    function onMouseLeave() { startRef.current = null }

    window.addEventListener('touchstart',  onTouchStart, { passive: true })
    window.addEventListener('touchend',    onTouchEnd,   { passive: true })
    window.addEventListener('mousedown',   onMouseDown)
    window.addEventListener('mouseup',     onMouseUp)
    window.addEventListener('mouseleave',  onMouseLeave)

    return () => {
      window.removeEventListener('touchstart',  onTouchStart)
      window.removeEventListener('touchend',    onTouchEnd)
      window.removeEventListener('mousedown',   onMouseDown)
      window.removeEventListener('mouseup',     onMouseUp)
      window.removeEventListener('mouseleave',  onMouseLeave)
    }
  }, [onSwipe, minDistance])
}
