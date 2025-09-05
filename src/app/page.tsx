'use client'

import ScrollSequence from '@/features/intro/components/ScrollSequence'
import RythemicRevealSection from '@/features/intro/components/RythemicRevealSection'
import { useScrollPhaseControl } from '@/hooks/use-scroll-phase-control'
import { useScrollLock } from '@/hooks/use-scroll-lock'

type PageProps = {
	params: Promise<Record<string, string>>
}

export default function Page() {
	const { 
		currentPhase, 
		isScrollLocked, 
		onBlackSectionExpanded, 
		onTypingCompleted 
	} = useScrollPhaseControl()
	
	// 스크롤 락 적용
	useScrollLock(isScrollLocked)

	return (
		<div className="scroll-container">
			<ScrollSequence 
				onBlackSectionExpanded={onBlackSectionExpanded}
				onTypingCompleted={onTypingCompleted}
			/>
			{currentPhase === 'completed' && (
				<RythemicRevealSection isVisible={true} />
			)}
		</div>
	)
}
