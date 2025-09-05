'use client'

import { useState, useEffect, RefObject } from 'react'

interface UseMousePositionReturn {
  x: number
  y: number
}

export function useMousePosition(
  containerRef: RefObject<HTMLElement | null>
): UseMousePositionReturn {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handlePositionUpdate = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      // 컨테이너 영역 내에서만 업데이트
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setMousePosition({ x, y })
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      handlePositionUpdate(event.clientX, event.clientY)
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        handlePositionUpdate(touch.clientX, touch.clientY)
      }
    }

    // 성능 최적화를 위한 throttling
    let animationFrameId: number
    const throttledMouseMove = (event: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(() => handleMouseMove(event))
    }

    const throttledTouchMove = (event: TouchEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      animationFrameId = requestAnimationFrame(() => handleTouchMove(event))
    }

    container.addEventListener('mousemove', throttledMouseMove, { passive: true })
    container.addEventListener('touchmove', throttledTouchMove, { passive: true })

    return () => {
      container.removeEventListener('mousemove', throttledMouseMove)
      container.removeEventListener('touchmove', throttledTouchMove)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [containerRef])

  return mousePosition
}