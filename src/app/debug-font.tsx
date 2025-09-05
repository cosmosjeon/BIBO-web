'use client'

import { useRef } from "react"
import { useMousePosition } from "@/hooks/use-mouse-position"

export default function DebugFont() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { x, y } = useMousePosition(containerRef)

  const weight = Math.round(100 + (y / 600) * 800)

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-black text-white flex items-center justify-center cursor-none relative"
    >
      <div className="text-center space-y-8">
        <div
          className="text-8xl font-overused-grotesk tracking-wider text-white"
          style={{
            fontVariationSettings: `'wght' ${weight}`,
          }}
        >
          Variable Font Test
        </div>
        
        <div className="text-2xl font-roboto-flex tracking-wide">
          Weight: {weight}
        </div>
        
        <div className="text-lg font-roboto-flex">
          Mouse: x={Math.round(x)}, y={Math.round(y)}
        </div>
      </div>
    </div>
  )
}
