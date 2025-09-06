'use client'

import { useEffect, useRef, useState, RefObject } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MultiQuoteTyping from '@/features/intro/components/MultiQuoteTyping'
import { useMousePosition } from '@/hooks/use-mouse-position'

export default function ScrollSequence() {
	const sectionRef = useRef<HTMLElement>(null)
	const blackSectionRef = useRef<HTMLDivElement>(null)
	const [isMobile, setIsMobile] = useState(false)
	const [scrollProgress, setScrollProgress] = useState(0)
	const { x, y } = useMousePosition(blackSectionRef as RefObject<HTMLElement | null>)

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
			
			// 초기 상태 설정 - 검은색 섹션을 완전히 숨김
			if (isMobile) {
				gsap.set('.split', { 
					gridTemplateRows: '100% 0%',
					clearProps: 'none' // CSS 속성 초기화 방지
				})
				gsap.set('.logo', { width: '200px' })
			} else {
				gsap.set('.split', { 
					gridTemplateColumns: '100% 0%',
					clearProps: 'none' // CSS 속성 초기화 방지
				})
				gsap.set('.logo', { width: '300px' })
			}

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top top',
					end: '+=200%', // 타이핑을 위한 더 긴 스크롤 범위
					scrub: prefersReduced ? false : 0.5, // 적당한 스크롤 반응
					pin: true,
					// snap 제거 - 사용자 스크롤에만 의존
					onUpdate: (self) => {
						// 스크롤 진행률을 상태로 업데이트
						setScrollProgress(self.progress)
					}
				}
			})

			if (isMobile) {
				// 모바일: 아래에서 위로 검은색 섹션 나타남 (1:9 비율)
				// 스크롤 기반 애니메이션 (부드러운 효과)
				tl.to('.split', { 
					gridTemplateRows: '10% 90%', 
					ease: 'power2.out', // 더 부드러운 이징
					duration: 1 // 더 긴 지속시간으로 부드럽게
				})
				tl.to('.logo', { 
					width: '80px', 
					ease: 'power2.out', 
					duration: 1
				}, 0)
			} else {
				// 데스크톱: 오른쪽에서 왼쪽으로 검은색 섹션 나타남 (1:9 비율)
				// 스크롤 기반 애니메이션 (부드러운 효과)
				tl.to('.split', { 
					gridTemplateColumns: '10% 90%', 
					ease: 'power2.out', // 더 부드러운 이징
					duration: 1 // 더 긴 지속시간으로 부드럽게
				})
				tl.to('.logo', { 
					width: '200px', 
					ease: 'power2.out', 
					duration: 1
				}, 0)
			}
		}, sectionRef)
		return () => ctx.revert()
	}, [isMobile])

	// 검은 섹션이 보이기 시작하면 타이핑 시작 (스크롤 진행률 기준)
	const shouldShowTyping = scrollProgress > 0.1

	return (
		<section ref={sectionRef} className="h-screen">
			<div className={`split grid h-screen ${isMobile ? 'grid-rows-2' : 'grid-cols-2 items-center'}`}>
				<div className={`${isMobile ? 'order-1 flex items-center justify-center px-4 py-2' : 'left flex items-center justify-center p-[clamp(1rem,4vw,3rem)]'}`}>
					<Image 
						src="/logo.png" 
						alt="BIBO" 
						width={300}
						height={200}
						className="logo h-auto" 
					/>
				</div>
				<div ref={blackSectionRef} className={`${isMobile ? 'order-2' : 'right'} h-full w-full bg-black text-white flex items-start justify-start overflow-hidden cursor-none relative`}>
					{shouldShowTyping && (
						<MultiQuoteTyping
							containerRef={blackSectionRef as RefObject<HTMLElement | null>}
							className="w-full h-full flex items-start justify-start pt-[clamp(4rem,8vh,6rem)] pl-[clamp(2rem,6vw,4rem)]"
							scrollProgress={scrollProgress} // 스크롤 진행률 전달
						/>
					)}
					
					{/* 마우스/터치 커서 효과 */}
					<div
						className="absolute w-px h-full bg-white/20 top-0 -translate-x-1/2 pointer-events-none"
						style={{
							left: `${x}px`,
						}}
					/>
					<div
						className="absolute w-full h-px bg-white/20 left-0 -translate-y-1/2 pointer-events-none"
						style={{
							top: `${y}px`,
						}}
					/>
					<div
						className={`absolute bg-white -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none ${
							isMobile ? 'w-3 h-3' : 'w-2 h-2'
						}`}
						style={{
							top: `${y}px`,
							left: `${x}px`,
						}}
					/>
					
					{/* 좌표 표시 - 데스크톱에서만 */}
					{!isMobile && (
						<div className="absolute bottom-8 left-8 flex flex-col font-azeret-mono">
							<span className="text-xs text-white/60 tabular-nums">
								x: {Math.round(x)}
							</span>
							<span className="text-xs text-white/60 tabular-nums">
								y: {Math.round(y)}
							</span>
							<span className="text-xs text-white/60 tabular-nums">
								progress: {Math.round(scrollProgress * 100)}%
							</span>
						</div>
					)}
				</div>
			</div>
		</section>
	)
}