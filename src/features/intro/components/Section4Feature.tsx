'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProfileCards } from '@/components/ui/profile-cards'
import TrueFocus from '@/components/ui/true-focus'

export default function Section4Feature() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // 등장 애니메이션(페이드 + 살짝 업)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.set(contentRef.current, { opacity: 0, y: 40, clearProps: 'none' })

      gsap.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: prefersReduced ? false : false,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-30 bg-black text-white cursor-auto"
    >
      <div ref={contentRef} className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12 py-24 pb-48 md:py-20 lg:py-24">
        {/* 제목 + TrueFocus 애니메이션 */}
        <div className="mb-24 md:mb-20 lg:mb-24">
          <TrueFocus
            sentence="SO WHO ARE WE?"
            manualMode={false}
            blurAmount={5}
            borderColor="red"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
        </div>

        {/* 두 개의 프로필 카드 레이아웃 (스와이프 제거) */}
        <div className="relative rounded-2xl bg-transparent cursor-auto">
          <ProfileCards />
        </div>
      </div>
    </section>
  )
}
