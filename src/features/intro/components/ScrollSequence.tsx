'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextType from '@/features/intro/components/TextType'

export default function ScrollSequence() {
	const sectionRef = useRef<HTMLElement>(null)
	const [typing, setTyping] = useState(false)

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)
		const ctx = gsap.context(() => {
			const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: 'top top',
					end: '+=250%',
					scrub: prefersReduced ? false : 1,
					pin: true
				}
			})
			// 1) 초기 상태: 100% / 0% (검은 섹션 완전 접힘, 잔상 방지)
			gsap.set('.split', { gridTemplateColumns: '100% 0%' })
			// 2) 스크롤 진행에 따라 30% : 70%로 확장
			tl.to('.split', { gridTemplateColumns: '30% 70%', ease: 'none', duration: 1 })
			// 3) 확장 완료 시 타이핑 동시 시작
			tl.add(() => setTyping(true))
		}, sectionRef)
		return () => ctx.revert()
	}, [])

	return (
		<section ref={sectionRef} className="h-screen">
			<div className="split grid items-center h-screen">
				<div className="left flex items-center justify-center p-[clamp(1rem,4vw,3rem)]">
					<img src="/logo.png" alt="BIBO" className="max-w-[60%] h-auto" />
				</div>
				<div className="right h-full w-full bg-black text-white grid place-items-center overflow-hidden">
					<div className="px-[clamp(1rem,4vw,3rem)] max-w-[120ch] space-y-[clamp(0.8rem,2vh,1.5rem)]">
						{typing && (
							<>
								<TextType
									text={"Failure is an option here. If things are not failing, you are not innovating enough."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(1rem,1.8vw,1.6rem)] leading-snug"
									animationConfig={{
										fromFontVariationSettings: "'wght' 300, 'slnt' 0",
										toFontVariationSettings: "'wght' 800, 'slnt' -15",
										transition: { duration: 1, type: "spring" },
										staggerDuration: 0.0
									}}
								/>
								<TextType
									text={"I'd rather be optimistic and wrong than pessimistic and right."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(1rem,1.8vw,1.6rem)] leading-snug"
									animationConfig={{
										fromFontVariationSettings: "'wght' 500, 'slnt' -5",
										toFontVariationSettings: "'wght' 700, 'slnt' -20",
										transition: { duration: 1.2, type: "easeInOut" },
										staggerDuration: 0.05,
										staggerFrom: "last"
									}}
								/>
								<TextType
									text={"Your time is limited, so don't waste it living someone else's life."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(1rem,1.8vw,1.6rem)] leading-snug"
									animationConfig={{
										fromFontVariationSettings: "'wght' 400, 'slnt' 0",
										toFontVariationSettings: "'wght' 950, 'slnt' 0",
										transition: { duration: 0.8, type: "spring" },
										staggerDuration: 0.06,
										staggerFrom: "center"
									}}
								/>
								<TextType
									text={"Stay hungry, stay foolish."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(1rem,1.8vw,1.6rem)] leading-snug"
									animationConfig={{
										fromFontVariationSettings: "'wght' 600, 'slnt' 5",
										toFontVariationSettings: "'wght' 900, 'slnt' -25",
										transition: { duration: 0.5, type: "spring" },
										staggerDuration: 0.0
									}}
								/>
								<TextType
									text={"The biggest risk is not taking any risk."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(1rem,1.8vw,1.6rem)] leading-snug"
									animationConfig={{
										fromFontVariationSettings: "'wght' 350, 'slnt' -2",
										toFontVariationSettings: "'wght' 850, 'slnt' -12",
										transition: { duration: 1.2, type: "easeInOut" },
										staggerDuration: 0.08,
										staggerFrom: "last"
									}}
								/>
								<div className="max-w-[60ch]">
									<TextType
										text={"The people who are crazy enough to think they can change the world are the ones who do."}
										typingSpeed={37.5}
										pauseDuration={1200}
										loop={false}
										showCursor
										stopAtEnd
										className="tracking-tight text-[clamp(1rem,1.8vw,1.6rem)] leading-snug"
										animationConfig={{
											fromFontVariationSettings: "'wght' 450, 'slnt' 0",
											toFontVariationSettings: "'wght' 900, 'slnt' -8",
											transition: { duration: 0.8, type: "spring" },
											staggerDuration: 0.06,
											staggerFrom: "center"
										}}
									/>
								</div>
								<TextType
									text={"The future doesn't wait for anyone. You have to invent it."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(1rem,1.8vw,1.6rem)] leading-snug"
									animationConfig={{
										fromFontVariationSettings: "'wght' 400, 'slnt' 0",
										toFontVariationSettings: "'wght' 900, 'slnt' -10",
										transition: { duration: 1.5, type: "spring" },
										staggerDuration: 0.08,
										staggerFrom: "center"
									}}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}


