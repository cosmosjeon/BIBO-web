'use client'

import { useMemo, RefObject } from 'react'
import { motion } from 'motion/react'
import { useMousePosition } from '@/hooks/use-mouse-position'

interface FontVariationMapping {
  name: string
  min: number
  max: number
}

interface VariableFontAndCursorProps {
  children: React.ReactNode
  className?: string
  fontVariationMapping?: {
    x?: FontVariationMapping
    y?: FontVariationMapping
  }
  containerRef: RefObject<HTMLElement | null>
}

export default function VariableFontAndCursor({
  children,
  className = '',
  fontVariationMapping = {
    y: { name: 'wght', min: 100, max: 900 },
    x: { name: 'slnt', min: 0, max: -10 },
  },
  containerRef,
}: VariableFontAndCursorProps) {
  const { x, y } = useMousePosition(containerRef)

  const fontVariationSettings = useMemo(() => {
    if (!containerRef.current) return "'wght' 400, 'slnt' 0"

    const rect = containerRef.current.getBoundingClientRect()
    const settings: string[] = []

    // Y축 매핑 (일반적으로 weight)
    if (fontVariationMapping.y) {
      const { name, min, max } = fontVariationMapping.y
      const normalizedY = Math.max(0, Math.min(1, y / rect.height))
      const mappedValue = min + (max - min) * normalizedY
      settings.push(`'${name}' ${Math.round(mappedValue)}`)
    }

    // X축 매핑 (일반적으로 slant)
    if (fontVariationMapping.x) {
      const { name, min, max } = fontVariationMapping.x
      const normalizedX = Math.max(0, Math.min(1, x / rect.width))
      const mappedValue = min + (max - min) * normalizedX
      settings.push(`'${name}' ${Math.round(mappedValue)}`)
    }

    return settings.join(', ') || "'wght' 400, 'slnt' 0"
  }, [x, y, fontVariationMapping, containerRef])

  return (
    <motion.div
      className={className}
      style={{
        fontVariationSettings,
        willChange: 'font-variation-settings',
      }}
      animate={{
        fontVariationSettings,
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 200,
        mass: 0.8,
      }}
    >
      {children}
    </motion.div>
  )
}