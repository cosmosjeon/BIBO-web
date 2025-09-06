'use client'

import { useMemo } from 'react'

interface ScrollBasedTextProps {
	text: string
	scrollProgress: number
	delay: number // 0-1 사이의 값으로, 언제부터 타이핑 시작할지
	duration: number // 0-1 사이의 값으로, 얼마나 오래 타이핑할지
	className?: string
	showCursor?: boolean
}

export default function ScrollBasedText({
	text,
	scrollProgress,
	delay,
	duration,
	className = '',
	showCursor = true
}: ScrollBasedTextProps) {
	const { displayedText, showCursorNow } = useMemo(() => {
		// 스크롤 진행률에 따른 타이핑 진행률 계산
		const adjustedProgress = Math.max(0, Math.min(1, (scrollProgress - delay) / duration))
		
		// 표시할 글자 수 계산
		const totalChars = text.length
		const charsToShow = Math.floor(adjustedProgress * totalChars)
		const displayed = text.slice(0, charsToShow)
		
		// 커서 표시 여부 (타이핑 중이거나 완료된 경우)
		const shouldShowCursor = showCursor && (adjustedProgress > 0 && adjustedProgress < 1)
		
		return {
			displayedText: displayed,
			showCursorNow: shouldShowCursor
		}
	}, [text, scrollProgress, delay, duration, showCursor])

	return (
		<div className={`${className}`}>
			<span className="inline whitespace-pre-wrap">
				{displayedText}
			</span>
			{showCursorNow && (
				<span className="ml-1 inline-block animate-pulse">|</span>
			)}
		</div>
	)
}
