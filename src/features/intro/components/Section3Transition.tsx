'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealText } from '@/components/ui/reveal-text'
import Image from 'next/image'

export default function Section3Transition() {
	const sectionRef = useRef<HTMLElement>(null)
	const blackOverlayRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const [isMobile, setIsMobile] = useState(false)

	// 모바일 감지
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
			const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
			
			// 초기 상태 설정 - 검은 오버레이를 화면 아래에 숨김
			gsap.set(blackOverlayRef.current, {
				y: '100%',
				clearProps: 'none'
			})
			
			// 콘텐츠 초기 상태 (완전히 숨김)
			gsap.set(contentRef.current, {
				opacity: 0,
				y: 30,
				clearProps: 'none'
			})

      // 섹션 3 자동 애니메이션
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          // 섹션이 뷰포트에 들어오면 애니메이션 시작
          start: 'top 80%',
          // scrub 제거 - 스크롤과 연동하지 않고 자동 재생
          toggleActions: 'play none none none',
        }
      })

      // 검은 오버레이가 아래에서 위로 올라오는 애니메이션
      tl.to(blackOverlayRef.current, {
        y: '0%',
        ease: 'power2.out',
        duration: 0.8
      })

      // 검은 오버레이가 올라온 후 콘텐츠 표시
      tl.to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, "-=0.2") // 오버레이와 약간 겹치게 시작

      // 브랜드 라인 순차 등장 (TESLA, META, GOOGLE, NVIDIA) - 자동 재생에 맞게 조정
      const brandLines = contentRef.current?.querySelectorAll('.brand-line')
      if (brandLines && brandLines.length) {
        tl.from(brandLines, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.3,
        }, "-=0.2")
      }

      // BIBO 로고와 LET's GO 텍스트 등장
      const biboLogo = contentRef.current?.querySelector('.bibo-logo')
      const letsGoText = contentRef.current?.querySelector('.lets-go-text')
      
      if (biboLogo) {
        tl.from(biboLogo, {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: 'power3.out',
        }, "-=0.4") // 브랜드 애니메이션과 자연스럽게 연결
      }
      
      if (letsGoText) {
        tl.from(letsGoText, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power2.out',
        }, "-=0.3") // 로고와 함께 자연스럽게 등장
      }

		}, sectionRef)
		return () => ctx.revert()
	}, [isMobile])


	return (
		<section ref={sectionRef} className="h-screen relative z-20">
			{/* 검은 오버레이 - 아래에서 위로 올라옴 */}
			<div 
				ref={blackOverlayRef}
				className="absolute inset-0 bg-black z-10"
			>
				{/* 섹션 3 콘텐츠 */}
				<div 
					ref={contentRef}
					className="section3-content relative z-20 h-full flex flex-col items-center justify-center px-4"
					style={{ color: 'white' }}
				>
      <div className="max-w-5xl mx-auto text-center space-y-10">
            {/* 회사명 텍스트 - RevealText로 호버 이미지 구현 */}
            <div className="mb-6 md:mb-10">
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold leading-tight drop-shadow-lg text-white text-center">
                <div className="brand-line mb-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                  <RevealText
                    variant="black"
                    className="font-semibold"
                    image="/images/일론.jpeg"
                    hoverImageClass="border-gray-400 rounded-lg"
                    href="https://tesla.com"
                  >
                    <span style={{ color: 'white' }}>TESLA</span>
                  </RevealText>
                  <RevealText
                    variant="black"
                    className="font-semibold"
                    image="/images/주커버그.png"
                    hoverImageClass="border-gray-400 rounded-lg"
                    href="https://meta.com"
                  >
                    <span style={{ color: 'white' }}>META</span>
                  </RevealText>
                </div>
                <div className="brand-line flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                  <RevealText
                    variant="black"
                    className="font-semibold"
                    image="/images/래리페이지1.png"
                    hoverImageClass="border-gray-400 rounded-lg"
                    href="https://google.com"
                  >
                    <span style={{ color: 'white' }}>GOOGLE</span>
                  </RevealText>
                  <RevealText
                    variant="black"
                    className="font-semibold"
                    image="/images/젠슨황.png"
                    hoverImageClass="border-gray-400 rounded-lg"
                    href="https://nvidia.com"
                  >
                    <span style={{ color: 'white' }}>NVIDIA</span>
                  </RevealText>
                </div>
              </div>
            </div>

            {/* BIBO 로고 */}
            <div className="bibo-logo mx-auto w-fit">
              <RevealText
                variant="black"
                className="font-semibold"
                image="/비보사진.jpeg"
                hoverImageClass="border-gray-400 rounded-lg min-w-64 h-40 md:min-w-80 md:h-48 lg:min-w-96 lg:h-56 xl:min-w-[28rem] xl:h-64"
              >
                <Image
                  src="/logo-white.png"
                  alt="BIBO"
                  width={320}
                  height={120}
                  className="mx-auto h-auto w-[clamp(160px,28vw,360px)]"
                  priority
                />
              </RevealText>
            </div>

            {/* LET's GO 텍스트 */}
            <div className="lets-go-text mx-auto w-fit mt-6">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
                LET&apos;s GO 🚀
              </h2>
            </div>
      </div>
				</div>
			</div>
		</section>
	)
}
