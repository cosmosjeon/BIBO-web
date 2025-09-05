'use client'

import { RefObject } from 'react'
import TextType from '@/features/intro/components/TextType'
import VariableFontAndCursor from '@/components/fancy/text/variable-font-and-cursor'

interface MultiQuoteTypingProps {
	containerRef: RefObject<HTMLElement | null>
	className?: string
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

// 각 명언별로 다른 시작 지연시간과 타이핑 속도 설정
const QUOTE_CONFIGS = [
	{ initialDelay: 0, typingSpeed: 45, pauseDuration: 2000 },
	{ initialDelay: 200, typingSpeed: 40, pauseDuration: 1800 },
	{ initialDelay: 400, typingSpeed: 50, pauseDuration: 2200 },
	{ initialDelay: 600, typingSpeed: 35, pauseDuration: 1900 },
	{ initialDelay: 800, typingSpeed: 55, pauseDuration: 2100 },
	{ initialDelay: 1000, typingSpeed: 42, pauseDuration: 1950 },
	{ initialDelay: 1200, typingSpeed: 48, pauseDuration: 2050 },
]

export default function MultiQuoteTyping({ 
	containerRef, 
	className = '' 
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
							<TextType
								text={quote}
								typingSpeed={config.typingSpeed}
								initialDelay={config.initialDelay}
								pauseDuration={config.pauseDuration}
								loop={false}
								showCursor
								stopAtEnd
								className="tracking-wider text-[clamp(1rem,1.8vw,1.6rem)] leading-relaxed"
							/>
						</div>
					)
				})}
			</div>
		</VariableFontAndCursor>
	)
}
