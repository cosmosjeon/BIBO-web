'use client'

import { ElementType, useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react'
import { gsap } from 'gsap'


interface TextTypeProps {
	className?: string
	showCursor?: boolean
	hideCursorWhileTyping?: boolean
	cursorCharacter?: string | React.ReactNode
	cursorBlinkDuration?: number
	cursorClassName?: string
	text: string | string[]
	as?: ElementType
	typingSpeed?: number
	initialDelay?: number
	pauseDuration?: number
	deletingSpeed?: number
	loop?: boolean
	textColors?: string[]
	variableSpeed?: { min: number; max: number }
	onSentenceComplete?: (sentence: string, index: number) => void
	/**
	 * 입력이 끝나면 삭제하지 않고 멈추게 함. 다중 문장 시에는 외부에서 다음 컴포넌트를 렌더링하여
	 * 순차 진행을 구성할 때 사용.
	 */
	stopAtEnd?: boolean
	/**
	 * 현재 문장의 타이핑이 끝나는 즉시 호출되는 콜백 (삭제 전 단계)
	 */
	onTypingComplete?: (sentence: string, index: number) => void
	startOnVisible?: boolean
	reverseMode?: boolean
}

const TextType = ({
	text,
	as: Component = 'div',
	typingSpeed = 50,
	initialDelay = 0,
	pauseDuration = 2000,
	deletingSpeed = 30,
	loop = true,
	className = '',
	showCursor = true,
	hideCursorWhileTyping = false,
	cursorCharacter = '|',
	cursorClassName = '',
	cursorBlinkDuration = 0.5,
	textColors = [],
	variableSpeed,
	onSentenceComplete,
	stopAtEnd = false,
	onTypingComplete,
	startOnVisible = false,
	reverseMode = false,
	...props
}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {
	const [displayedText, setDisplayedText] = useState('')
	const [currentCharIndex, setCurrentCharIndex] = useState(0)
	const [isDeleting, setIsDeleting] = useState(false)
	const [currentTextIndex, setCurrentTextIndex] = useState(0)
	const [isVisible, setIsVisible] = useState(!startOnVisible)
	const cursorRef = useRef<HTMLSpanElement>(null)
	const containerRef = useRef<HTMLElement>(null)

	const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text])

	const getRandomSpeed = useCallback(() => {
		if (!variableSpeed) return typingSpeed
		const { min, max } = variableSpeed
		return Math.random() * (max - min) + min
	}, [variableSpeed, typingSpeed])

	const getCurrentTextColor = () => {
		if (textColors.length === 0) return '#ffffff'
		return textColors[currentTextIndex % textColors.length]
	}

	useEffect(() => {
		if (!startOnVisible || !containerRef.current) return

		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						setIsVisible(true)
					}
				})
			},
			{ threshold: 0.1 }
		)

		observer.observe(containerRef.current)
		return () => observer.disconnect()
	}, [startOnVisible])

	useEffect(() => {
		if (showCursor && cursorRef.current) {
			gsap.set(cursorRef.current, { opacity: 1 })
			gsap.to(cursorRef.current, {
				opacity: 0,
				duration: cursorBlinkDuration,
				repeat: -1,
				yoyo: true,
				ease: 'power2.inOut'
			})
		}
	}, [showCursor, cursorBlinkDuration])

	useEffect(() => {
		if (!isVisible) return

		let timeout: NodeJS.Timeout

		const currentText = textArray[currentTextIndex]
		const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText

		const executeTypingAnimation = () => {
			if (isDeleting) {
				if (displayedText === '') {
					setIsDeleting(false)
					if (currentTextIndex === textArray.length - 1 && !loop) {
						return
					}

					if (onSentenceComplete) {
						onSentenceComplete(textArray[currentTextIndex], currentTextIndex)
					}

					setCurrentTextIndex(prev => (prev + 1) % textArray.length)
					setCurrentCharIndex(0)
					timeout = setTimeout(() => {}, pauseDuration)
				} else {
					timeout = setTimeout(() => {
						setDisplayedText(prev => prev.slice(0, -1))
					}, deletingSpeed)
				}
			} else {
				if (currentCharIndex < processedText.length) {
					timeout = setTimeout(
						() => {
							setDisplayedText(prev => prev + processedText[currentCharIndex])
							setCurrentCharIndex(prev => prev + 1)
						},
						variableSpeed ? getRandomSpeed() : typingSpeed
					)
				} else {
					// 타이핑이 끝난 시점
					if (onTypingComplete) onTypingComplete(textArray[currentTextIndex], currentTextIndex)
					if (textArray.length > 1 && !stopAtEnd) {
						timeout = setTimeout(() => {
							setIsDeleting(true)
						}, pauseDuration)
					}
				}
			}
		}

		if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
			timeout = setTimeout(executeTypingAnimation, initialDelay)
		} else {
			executeTypingAnimation()
		}

		return () => clearTimeout(timeout)
	}, [
		currentCharIndex,
		displayedText,
		isDeleting,
		typingSpeed,
		deletingSpeed,
		pauseDuration,
		textArray,
		currentTextIndex,
		loop,
		initialDelay,
		isVisible,
		reverseMode,
		variableSpeed,
		onSentenceComplete,
		stopAtEnd,
		onTypingComplete,
		getRandomSpeed
	])


	const shouldHideCursor =
		hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting)


	return createElement(
		Component,
		{
			ref: containerRef,
			className: `block whitespace-pre-wrap tracking-tight ${className}`,
			...props
		},
		<span className="inline" style={{ color: getCurrentTextColor() }}>
			{displayedText}
		</span>,
		showCursor && (
			<span
				ref={cursorRef}
				className={`ml-1 inline-block opacity-100 ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}
			>
				{cursorCharacter}
			</span>
		)
	)
}

export default TextType


