'use client'

import { RefObject } from 'react'
import ScrollBasedText from '@/features/intro/components/ScrollBasedText'
import VariableFontAndCursor from '@/components/fancy/text/variable-font-and-cursor'

interface MultiQuoteTypingProps {
	containerRef: RefObject<HTMLElement | null>
	className?: string
	scrollProgress?: number
}

const QUOTES = [
	"Failure is an option here.\nIf things are not failing, you are not innovating enough.",
	"I'd rather be optimistic and wrong than pessimistic and right.",
	"Your time is limited, so don't waste it living someone else's life.",
	"Stay hungry, stay foolish.",
	"The biggest risk is not taking any risk.",
	"The people who are crazy enough to think \nthey can change the world are the ones who do.",
	"The future doesn't wait for anyone. You have to invent it.",
]

// 각 명언별로 다른 시작 지연과 지속 시간 설정 (스크롤 진행률 기준)
// 스크롤 범위를 늘리고 더 천천히 타이핑되도록 조정
const QUOTE_CONFIGS = [
	{ delay: 0.05, duration: 0.9 }, // 더 일찍 시작하고 더 오래 진행 (속도 절반)
	{ delay: 0.1, duration: 0.85 },
	{ delay: 0.15, duration: 0.8 },
	{ delay: 0.2, duration: 0.75 },
	{ delay: 0.25, duration: 0.7 },
	{ delay: 0.3, duration: 0.65 },
	{ delay: 0.35, duration: 0.6 },
]

export default function MultiQuoteTyping({ 
	containerRef, 
	className = '',
	scrollProgress = 0
}: MultiQuoteTypingProps) {
	return (
		<VariableFontAndCursor
			containerRef={containerRef}
			fontVariationMapping={{
				y: { name: 'wght', min: 100, max: 900 },
			}}
			className={`max-w-[120ch] font-overused-grotesk tracking-wider ${className}`}
		>
			<div className="space-y-[clamp(3rem,6vh,4rem)]">
				{QUOTES.map((quote, index) => {
					const config = QUOTE_CONFIGS[index]
					return (
						<div 
							key={index}
							className="flex items-start"
						>
							<ScrollBasedText
								text={quote}
								scrollProgress={scrollProgress}
								delay={config.delay}
								duration={config.duration}
								showCursor
								className="tracking-wider text-[clamp(1rem,1.8vw,1.6rem)] leading-relaxed"
							/>
						</div>
					)
				})}
			</div>
		</VariableFontAndCursor>
	)
}