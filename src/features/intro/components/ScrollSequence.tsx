'use client'

import { useEffect, useRef, useState, RefObject } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MultiQuoteTyping from '@/features/intro/components/MultiQuoteTyping'
import { Squares } from '@/components/ui/squares-background'

export default function ScrollSequence() {
	const sectionRef = useRef<HTMLElement>(null)
	const blackSectionRef = useRef<HTMLDivElement>(null)
	const [isMobile, setIsMobile] = useState(false)
	const [scrollProgress, setScrollProgress] = useState(0)

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
					display: 'grid',
					gridTemplateRows: '100% 0%',
					gridTemplateColumns: 'none',
					clearProps: 'none' // CSS 속성 초기화 방지
				})
				gsap.set('.logo', { width: '200px' })
			} else {
				gsap.set('.split', { 
					display: 'grid',
					gridTemplateColumns: '100% 0%',
					gridTemplateRows: 'none',
					clearProps: 'none' // CSS 속성 초기화 방지
				})
				gsap.set('.logo', { width: '300px' })
			}

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=200%', // 기존 스크롤 범위로 복구
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
                // 모바일: 기존 동작 유지 (1:9 비율)
                // 스크롤 기반 애니메이션 (부드러운 효과)
                tl.to('.split', { 
                    gridTemplateRows: '10% 90%',
                    gridTemplateColumns: 'none',
                    ease: 'power2.out', // 더 부드러운 이징
                    duration: 1 // 더 긴 지속시간으로 부드럽게
                })
                tl.to('.logo', { 
                    width: '80px', 
                    ease: 'power2.out', 
                    duration: 1
                }, 0)
            } else {
                // 데스크톱: 오른쪽에서 왼쪽으로 검은색 섹션 나타남 (3:7 비율)
                // 스크롤 기반 애니메이션 (부드러운 효과)
                tl.to('.split', { 
                    gridTemplateColumns: '30% 70%',
                    gridTemplateRows: 'none',
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

    // 초기 로드시 브라우저의 스크롤 복원으로 인해 검은 섹션이 보이는 이슈 방지
    useEffect(() => {
        // 데스크톱에서만 초기 스크롤 복원 비활성화 적용
        if (typeof window === 'undefined') return
        if (window.innerWidth < 768) return
        const { history } = window
        const prev = history.scrollRestoration
        history.scrollRestoration = 'manual'
        if (window.scrollY !== 0) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        }
        return () => {
            history.scrollRestoration = prev || 'auto'
        }
    }, [])

	// 검은 섹션이 보이기 시작하면 타이핑 시작 (스크롤 진행률 기준)
	const shouldShowTyping = scrollProgress > 0.1


	return (
		<section ref={sectionRef} className="h-screen">
			<div className="split grid h-screen">
				<div className={`${isMobile ? 'order-1 flex items-center justify-center px-4 py-2' : 'left flex items-center justify-center p-[clamp(1rem,4vw,3rem)]'} relative overflow-hidden bg-white`}>
					<Image 
						src="/logo.png" 
						alt="BIBO" 
						width={300}
						height={200}
						className="logo h-auto relative z-10" 
					/>
				</div>
				<div ref={blackSectionRef} className={`${isMobile ? 'order-2' : 'right'} h-full w-full bg-black text-white flex items-start justify-start overflow-hidden relative`}>
					{/* Animated grid background */}
					<Squares
						direction="diagonal"
						speed={0.5}
						squareSize={40}
						borderColor="#333"
						hoverFillColor="#222"
						className="absolute inset-0 z-0"
					/>
					{shouldShowTyping && (
						<MultiQuoteTyping
							containerRef={blackSectionRef as RefObject<HTMLElement | null>}
							className="w-full h-full flex items-start justify-start pt-[clamp(4rem,8vh,6rem)] pl-[clamp(2rem,6vw,4rem)] relative z-10"
							scrollProgress={scrollProgress} // 스크롤 진행률 전달
						/>
					)}
				</div>
			</div>
		</section>
	)
}
