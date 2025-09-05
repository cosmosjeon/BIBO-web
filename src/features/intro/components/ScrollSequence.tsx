'use client'

import { useEffect, useRef, useState, RefObject, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MultiQuoteTyping from '@/features/intro/components/MultiQuoteTyping'
import { useMousePosition } from '@/hooks/use-mouse-position'

interface ScrollSequenceProps {
	onBlackSectionExpanded?: () => void
	onTypingCompleted?: () => void
}

export default function ScrollSequence({ 
	onBlackSectionExpanded, 
	onTypingCompleted 
}: ScrollSequenceProps) {
	const sectionRef = useRef<HTMLElement>(null)
	const blackSectionRef = useRef<HTMLDivElement>(null)
	const [typing, setTyping] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const { x, y } = useMousePosition(blackSectionRef as RefObject<HTMLElement | null>)

	// 타이핑 시작을 한 번만 트리거하기 위한 가드
	const hasStartedTypingRef = useRef(false)
	const startTypingOnce = useCallback(() => {
		if (hasStartedTypingRef.current) return
		hasStartedTypingRef.current = true
		setTyping(true)
		onBlackSectionExpanded?.()
	}, [onBlackSectionExpanded])

	// 모바일 감지
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	// 모든 타이핑이 완료된 후 부모 상태 변경
	useEffect(() => {
		if (!typing) return
		
		// 7개 명언이 모두 타이핑되는 시간 계산 (가장 긴 지연시간 + 타이핑 시간)
		const maxDelay = 1200 // 가장 긴 initialDelay
		const maxTypingTime = 8000 // 예상 최대 타이핑 시간
		const totalTime = maxDelay + maxTypingTime + 2000 // 여유시간 추가
		
		const timer = setTimeout(() => {
			// ScrollTrigger 정리 및 새로고침
			ScrollTrigger.killAll()
			ScrollTrigger.refresh()
			// 다음 프레임에서 상태 변경하여 렌더링 충돌 방지
			requestAnimationFrame(() => {
				onTypingCompleted?.()
			})
		}, totalTime)
		
		return () => clearTimeout(timer)
	}, [typing, onTypingCompleted])

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)
		const ctx = gsap.context(() => {
			const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top top',
					end: '+=150%', // 스크롤 범위 축소 (검은 섹션 확장까지만)
					scrub: prefersReduced ? false : 1,
					pin: true,
				}
			})

			if (isMobile) {
				// 모바일: 아래에서 위로 검은색 섹션 나타남 (1:9 비율)
				gsap.set('.split', { gridTemplateRows: '100% 0%' })
				gsap.set('.logo', { width: '200px' }) // 초기 큰 크기
				tl.to('.split', { gridTemplateRows: '10% 90%', ease: 'none', duration: 1 })
				tl.to('.logo', { width: '80px', ease: 'none', duration: 1 }, 0) // 동시에 로고 크기 축소
				// 확장 완료 직후 타이핑 및 스크롤 락 시작
				tl.add(() => startTypingOnce())
			} else {
				// 데스크톱: 오른쪽에서 왼쪽으로 검은색 섹션 나타남
				gsap.set('.split', { gridTemplateColumns: '100% 0%' })
				gsap.set('.logo', { width: '300px' }) // 초기 큰 크기
				tl.to('.split', { gridTemplateColumns: '30% 70%', ease: 'none', duration: 1 })
				tl.to('.logo', { width: '200px', ease: 'none', duration: 1 }, 0) // 동시에 로고 크기 축소
				// 확장 완료 직후 타이핑 및 스크롤 락 시작
				tl.add(() => startTypingOnce())
			}
		}, sectionRef)
		return () => ctx.revert()
	}, [isMobile, startTypingOnce])

	return (
		<section ref={sectionRef} className="h-screen">
			<div className={`split grid h-screen ${isMobile ? 'grid-rows-2' : 'grid-cols-2 items-center'}`}>
				<div className={`${isMobile ? 'order-1 flex items-center justify-center px-4 py-2' : 'left flex items-center justify-center p-[clamp(1rem,4vw,3rem)]'}`}>
					<img 
						src="/logo.png" 
						alt="BIBO" 
						className="logo h-auto" 
					/>
				</div>
				<div ref={blackSectionRef} className={`${isMobile ? 'order-2' : 'right'} h-full w-full bg-black text-white flex items-start justify-start overflow-hidden cursor-none relative`}>
					{typing && (
						<MultiQuoteTyping
							containerRef={blackSectionRef as RefObject<HTMLElement | null>}
							className="w-full h-full flex items-start justify-start pt-[clamp(4rem,8vh,6rem)] pl-[clamp(2rem,6vw,4rem)]"
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
						</div>
					)}
				</div>
			</div>
		</section>
	)
}