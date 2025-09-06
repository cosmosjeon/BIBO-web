"use client"

import { useRef, type PropsWithChildren } from 'react'
import SmoothCursor from './smooth-cursor'

type CursorScopeProps = PropsWithChildren<{
  autoInvertByBackground?: boolean
  glowEffect?: boolean
  rotateOnMove?: boolean
  scaleOnClick?: boolean
}>

export default function CursorScope({
  children,
  autoInvertByBackground = true,
  glowEffect = true,
  rotateOnMove = true,
  scaleOnClick = true,
}: CursorScopeProps) {
  const scopeRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={scopeRef} className="relative">
      <SmoothCursor
        containerRef={scopeRef}
        autoInvertByBackground={autoInvertByBackground}
        glowEffect={glowEffect}
        rotateOnMove={rotateOnMove}
        scaleOnClick={scaleOnClick}
        nativeCursorSelector="[data-native-cursor]"
      />
      {children}
    </div>
  )
}
