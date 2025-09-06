'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Rythem, Line, Word, Picture } from '@/components/ui/rythemic-reveal'

interface RythemicRevealMobileProps {
  isVisible?: boolean
  className?: string
}

export default function RythemicRevealMobile({
  isVisible = true,
  className = '',
}: RythemicRevealMobileProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // 섹션 2 Pin 임시 비활성화 - 필요시 여기서 활성화
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  if (!isVisible) return null

  return (
    <div ref={sectionRef} className={`w-full relative ${className}`}>
      <div className="w-full h-[20vh] bg-background border-b flex justify-center items-center border-white text-white px-3">
        Scroll to Preview
      </div>
      <Rythem
        className="text-black h-[80vh] text-3xl xs:text-4xl sm:text-5xl"
        imgsWidth={85}
      >
        <Line className="flex mx-auto w-fit gap-3">
          <Word>TWO KOREAN</Word>
          <Word className="rounded-md inline-block overflow-hidden h-full pointer-events-none">
            <Picture
              className=""
              src="/images/rythemic/태극기1.svg"
              alt="Korean students"
            />
          </Word>
        </Line>

        <Line className="flex mx-auto w-fit items-center gap-1 min-h-[80px]">
          <Word>COLLEGE</Word>
          <Word 
            className="rounded-md inline-block overflow-hidden pointer-events-none flex items-center justify-center h-20"
            style={{ 
              width: '85px',
              maxWidth: '85px',
              minWidth: '85px',
              flexShrink: 0
            }}
          >
            <Picture
              src="/images/rythemic/성대로고.jpg"
              alt="College life"
              className="w-full h-full object-contain"
            />
          </Word>
          <Word>STUDENTS</Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3">
          <Word>ON A JOURNEY</Word>
        </Line>

        {/* 모바일에서는 분리된 레이아웃 */}
        <Line className="flex mx-auto w-fit gap-3">
          <Word>TO BUILD A UNICORN</Word>
        </Line>
        <Line className="flex mx-auto w-fit justify-center">
          <Word className="rounded-md inline-block overflow-hidden pointer-events-none">
            <Picture
              src="/images/rythemic/유니콘.png"
              alt="Unicorn startup"
            />
          </Word>
        </Line>
      </Rythem>
    </div>
  )
}