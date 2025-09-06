'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Feature } from '@/components/ui/feature-with-image-comparison'

export default function Section4Feature() {
	const sectionRef = useRef<HTMLElement>(null)
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
			
			// 콘텐츠 초기 상태 (약간 숨김)
			gsap.set(contentRef.current, {
				opacity: 0,
				scale: 1.1,
				clearProps: 'none'
			})

			// 섹션 4 애니메이션
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top 80%',
					end: 'bottom 20%',
					scrub: prefersReduced ? false : 1,
					pin: false,
				}
			})

			// 콘텐츠 나타나는 애니메이션 (줌인 효과)
			tl.to(contentRef.current, {
				opacity: 1,
				scale: 1,
				duration: 1,
				ease: 'power2.out'
			})

		}, sectionRef)
		return () => ctx.revert()
	}, [isMobile])

	return (
		<section ref={sectionRef} className="h-screen relative z-30">
			<div ref={contentRef} className="w-full h-full">
				<Feature />
			</div>
		</section>
	)
}
