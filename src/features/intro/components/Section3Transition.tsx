'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RevealText } from '@/components/ui/reveal-text'
import SimpleSplitText from '@/components/SimpleSplitText'

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

			// 섹션 3 애니메이션
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top 80%',
					end: 'bottom 20%',
					scrub: prefersReduced ? false : 1,
					pin: false,
				}
			})

			// 검은 오버레이가 아래에서 위로 올라오는 애니메이션
			tl.to(blackOverlayRef.current, {
				y: '0%',
				ease: 'power2.out',
				duration: 1.2
			})

			// 검은 오버레이가 올라온 후 콘텐츠 표시
			tl.to(contentRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.6,
				ease: 'power2.out'
			}, "-=0.3") // 오버레이와 약간 겹치게 시작

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
					<div className="max-w-4xl mx-auto text-center space-y-8">
						{/* 회사명 텍스트 - RevealText로 호버 이미지 구현 */}
						<div className="mb-6 md:mb-8">
							<div className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold mb-2 md:mb-4 leading-tight drop-shadow-lg text-white text-center">
								<div className="mb-2">
									<RevealText
										variant="black"
										className="font-semibold mr-4 md:mr-8"
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
								<div>
									<RevealText
										variant="black"
										className="font-semibold mr-4 md:mr-8"
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
						
						{/* BIBO 텍스트 - SimpleSplitText로 복원 */}
						<div className="mb-6 md:mb-8">
							<SimpleSplitText
								text="BIBO Let's Go 🚀"
								className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold leading-tight drop-shadow-lg text-white"
								delay={300} // 단어별로 하니까 더 느리게
								duration={1.2}
								ease="back.out(1.7)"
								splitType="words"
								from={{ opacity: 0, y: 80, scale: 0.5, rotation: 10 }}
								to={{ opacity: 1, y: 0, scale: 1, rotation: 0 }}
								threshold={0.05}
								rootMargin="0px"
								tag="h2"
								textAlign="center"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
