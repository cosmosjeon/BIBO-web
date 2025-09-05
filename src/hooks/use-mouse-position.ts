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

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // 컨테이너 영역 내에서만 업데이트
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        setMousePosition({ x, y })
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

    container.addEventListener('mousemove', throttledMouseMove, { passive: true })

    return () => {
      container.removeEventListener('mousemove', throttledMouseMove)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [containerRef])

  return mousePosition
}
