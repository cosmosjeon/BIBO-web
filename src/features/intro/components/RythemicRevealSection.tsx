'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Rythem, Line, Word, Picture } from '@/components/ui/rythemic-reveal'
import { FlipLink } from '@/components/ui/flip-links'

interface RythemicRevealSectionProps {
  isVisible?: boolean
  className?: string
}

export default function RythemicRevealSection({
  isVisible = true,
  className = '',
}: RythemicRevealSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      // 섹션 2 Pin 임시 비활성화
      /*
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'bottom bottom',
        end: '+=150vh', // 더 많은 스크롤 공간
        pin: true,
        pinSpacing: true, // 추가 공간 생성하여 스크롤 가능하게 함
        scrub: prefersReduced ? false : true,
      })
      */
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
        className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-7xl text-black h-[80vh]"
        imgsWidth={150}
      >
        <Line className="flex mx-auto w-fit gap-3">
          <Word>
            <FlipLink 
              href="#"
              className="group text-black relative block overflow-hidden whitespace-nowrap font-black uppercase hover:text-primary"
            >
              TWO KOREAN
            </FlipLink>
          </Word>
          <Word className="rounded-md inline-block overflow-hidden h-full pointer-events-none">
            <Picture
              className=""
              src="/images/rythemic/태극기1.svg"
              alt="Korean students"
            />
          </Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3">
          <Word>
            <FlipLink 
              href="#"
              className="group text-black relative block overflow-hidden whitespace-nowrap font-black uppercase hover:text-primary"
            >
              COLLEGE
            </FlipLink>
          </Word>
          <Word className="rounded-md inline-block overflow-hidden pointer-events-none">
            <Picture
              src="/images/rythemic/성대로고.jpg"
              alt="College life"
            />
          </Word>
          <Word>
            <FlipLink 
              href="#"
              className="group text-black relative block overflow-hidden whitespace-nowrap font-black uppercase hover:text-primary"
            >
              STUDENTS
            </FlipLink>
          </Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3">
          <Word>
            <FlipLink 
              href="#"
              className="group text-black relative block overflow-hidden whitespace-nowrap font-black uppercase hover:text-primary"
            >
              ON A JOURNEY
            </FlipLink>
          </Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3">
          <Word>
            <FlipLink 
              href="#"
              className="group text-black relative block overflow-hidden whitespace-nowrap font-black uppercase hover:text-primary"
            >
              TO BUILD A UNICORN
            </FlipLink>
          </Word>
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