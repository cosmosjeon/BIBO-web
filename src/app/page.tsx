import ScrollSequence from '@/features/intro/components/ScrollSequence'
import RythemicRevealSection from '@/features/intro/components/RythemicReveal'
import Section3Transition from '@/features/intro/components/Section3Transition'
import Section4Feature from '@/features/intro/components/Section4Feature'
import CursorScope from '@/components/lightswind/cursor-scope'

export default function Page() {
	return (
		<div>
			{/* 커서 스코프: 전체에 적용하되, 섹션4 카드 컨테이너에서는 기본 커서 */}
			<CursorScope>
				<ScrollSequence />
				<RythemicRevealSection isVisible={true} />
				<Section3Transition />
				<Section4Feature />
			</CursorScope>
		</div>
	)
}
