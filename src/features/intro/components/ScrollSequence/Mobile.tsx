'use client'

import { useEffect, useRef, useState, RefObject } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MultiQuoteTyping from '@/features/intro/components/MultiQuoteTyping'
import { BGPattern } from '@/components/ui/bg-pattern'
import { useMousePosition } from '@/hooks/use-mouse-position'

export default function ScrollSequenceMobile() {
	const sectionRef = useRef<HTMLElement>(null)
	const blackSectionRef = useRef<HTMLDivElement>(null)
	const [scrollProgress, setScrollProgress] = useState(0)
	const { x, y } = useMousePosition(sectionRef as RefObject<HTMLElement | null>)

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)
		let isMounted = true
		
		const ctx = gsap.context(() => {
			const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
			
			// 초기 상태 설정 - 검은색 섹션을 완전히 숨김
			gsap.set('.split', { 
				display: 'grid',
				gridTemplateRows: '100% 0%',
				gridTemplateColumns: 'none',
				clearProps: 'none'
			})
			gsap.set('.logo', { width: '200px' })

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top top',
					end: '+=220%',
					scrub: prefersReduced ? false : 0.5,
					pin: true,
					onUpdate: (self) => {
						// Only update state if component is still mounted
						if (isMounted) {
							setScrollProgress(self.progress)
						}
					}
				}
			})

			// 모바일: 아래 검은색 섹션이 70% 차지(흰 30 : 검 70)
			tl.to('.split', { 
				gridTemplateRows: '30% 70%',
				gridTemplateColumns: 'none',
				ease: 'power2.out',
				duration: 1
			})
			tl.to('.logo', { 
				width: '80px', 
				ease: 'power2.out', 
				duration: 1
			}, 0)

			// 추가 홀드 구간: 마지막에 약간 더 스크롤해야 섹션을 벗어나도록
			const proxy = { v: 0 }
			tl.to(proxy, { v: 1, duration: 0.35, ease: 'none' })
		}, sectionRef)
		
		return () => {
			isMounted = false
			ctx.revert()
		}
	}, [])

	const shouldShowTyping = scrollProgress > 0.1

	const getRelativePosition = () => {
		if (!blackSectionRef.current) return { x: 0, y: 0 }
		
		const sectionRect = sectionRef.current?.getBoundingClientRect()
		const blackRect = blackSectionRef.current.getBoundingClientRect()
		
		if (!sectionRect) return { x: 0, y: 0 }
		
		const relativeX = x - (blackRect.left - sectionRect.left)
		const relativeY = y - (blackRect.top - sectionRect.top)
		
		return {
			x: Math.max(0, Math.min(relativeX, blackRect.width)),
			y: Math.max(0, Math.min(relativeY, blackRect.height))
		}
	}

	const relativePos = getRelativePosition()

	return (
		<section ref={sectionRef} className="h-screen">
			<div className="split grid h-screen">
				<div className="order-1 flex items-center justify-center px-4 py-2">
					<Image 
						src="/logo.png" 
						alt="BIBO" 
						width={300}
						height={200}
						className="logo h-auto" 
					/>
				</div>
				<div 
					ref={blackSectionRef} 
                className="order-2 h-full w-full bg-black text-white flex items-start justify-start overflow-hidden cursor-none relative"
                >
                    {/* Dark grid background pattern */}
                    <BGPattern
                        variant="grid"
                        mask="fade-edges"
                        size={48}
                        fill={'oklch(1 0 0 / 0.16)'}
                        className="z-0 pointer-events-none"
                    />
                    {/* Center highlight to increase perceived brightness */}
                    <div
                        className="absolute inset-0 z-0 pointer-events-none"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 50% 50%, oklch(1 0 0 / 0.16) 0%, transparent 80%)',
                        }}
                    />
					{shouldShowTyping && (
						<MultiQuoteTyping
							containerRef={blackSectionRef as RefObject<HTMLElement | null>}
							className="w-full h-full flex items-start justify-start pt-[clamp(4rem,8vh,6rem)] pl-[clamp(2rem,6vw,4rem)]"
							scrollProgress={scrollProgress}
						/>
					)}
					
					{/* 터치 커서 효과 */}
					{shouldShowTyping && (
						<>
							<div
								className="absolute w-px h-full bg-white/20 top-0 -translate-x-1/2 pointer-events-none"
								style={{ left: `${relativePos.x}px` }}
							/>
							<div
								className="absolute w-full h-px bg-white/20 left-0 -translate-y-1/2 pointer-events-none"
								style={{ top: `${relativePos.y}px` }}
							/>
							<div
								className="absolute bg-white w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
								style={{
									top: `${relativePos.y}px`,
									left: `${relativePos.x}px`,
								}}
							/>
						</>
					)}
				</div>
			</div>
		</section>
	)
}
