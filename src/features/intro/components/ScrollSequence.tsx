'use client'

import { useEffect, useRef, useState, RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TextType from '@/features/intro/components/TextType'
import VariableFontAndCursor from '@/components/fancy/text/variable-font-and-cursor'

export default function ScrollSequence() {
	const sectionRef = useRef<HTMLElement>(null)
	const blackSectionRef = useRef<HTMLDivElement>(null)
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
					<img src="/logo.png" alt="BIBO" className="w-[200px] h-auto" />
				</div>
				<div ref={blackSectionRef} className="right h-full w-full bg-black text-white grid place-items-center overflow-hidden cursor-none">
					<VariableFontAndCursor
						containerRef={blackSectionRef as RefObject<HTMLElement | null>}
						fontVariationMapping={{
							y: { name: 'wght', min: 200, max: 800 },
							x: { name: 'slnt', min: 0, max: -15 },
						}}
						className="px-[clamp(1rem,4vw,3rem)] max-w-[120ch] space-y-[clamp(3rem,7vh,6rem)]"
					>
						{typing && (
							<>
								<TextType
									text={"Failure is an option here.\nIf things are not failing, you are not innovating enough."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(0.8rem,1.4vw,1.2rem)] leading-snug"
								/>
								<TextType
									text={"I'd rather be optimistic and wrong than pessimistic and right."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(0.8rem,1.4vw,1.2rem)] leading-snug"
								/>
								<TextType
									text={"Your time is limited, so don't waste it living someone else's life."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(0.8rem,1.4vw,1.2rem)] leading-snug"
								/>
								<TextType
									text={"Stay hungry, stay foolish."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(0.8rem,1.4vw,1.2rem)] leading-snug"
								/>
								<TextType
									text={"The biggest risk is not taking any risk."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(0.8rem,1.4vw,1.2rem)] leading-snug"
								/>
							
									<TextType
										text={"The people who are crazy enough to think \nthey can change the world are the ones who do."}
										typingSpeed={37.5}
										pauseDuration={1200}
										loop={false}
										showCursor
										stopAtEnd
										className="tracking-tight text-[clamp(0.8rem,1.4vw,1.2rem)] leading-snug"
									/>
								
								<TextType
									text={"The future doesn't wait for anyone. You have to invent it."}
									typingSpeed={37.5}
									pauseDuration={1200}
									loop={false}
									showCursor
									stopAtEnd
									className="tracking-tight text-[clamp(0.8rem,1.4vw,1.2rem)] leading-snug"
								/>
							</>
						)}
					</VariableFontAndCursor>
				</div>
			</div>
		</section>
	)
}


