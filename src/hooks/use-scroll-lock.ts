'use client'

import { useEffect } from 'react'

// Prevent scroll using overflow lock + wheel/touch/key guards.
// Note: 'scroll' events are non-cancelable, so don't attach a preventDefault handler to them.
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isLocked) e.preventDefault()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isLocked) e.preventDefault()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked) return
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']
      if (scrollKeys.includes(e.key)) e.preventDefault()
    }

    if (isLocked) {
      document.addEventListener('wheel', handleWheel, { passive: false })
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('keydown', handleKeyDown, { passive: false })
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }

    return () => {
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }
  }, [isLocked])
}
