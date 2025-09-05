'use client'

import { useEffect } from 'react'

export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (isLocked) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (isLocked) {
        e.preventDefault()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isLocked) {
        e.preventDefault()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) {
        // 스크롤 관련 키들 차단
        const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']
        if (scrollKeys.includes(e.key)) {
          e.preventDefault()
        }
      }
    }

    if (isLocked) {
      // 스크롤 이벤트 차단
      document.addEventListener('scroll', handleScroll, { passive: false })
      document.addEventListener('wheel', handleWheel, { passive: false })
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('keydown', handleKeyDown, { passive: false })
      
      // body 스크롤 차단
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }

    return () => {
      document.removeEventListener('scroll', handleScroll)
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
      document.documentElement.style.overflow = 'auto'
    }
  }, [isLocked])
}
