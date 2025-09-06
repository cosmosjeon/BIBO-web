import ScrollSequence from '@/features/intro/components/ScrollSequence'
import RythemicRevealSection from '@/features/intro/components/RythemicRevealSection'
import Section3Transition from '@/features/intro/components/Section3Transition'
import Section4Feature from '@/features/intro/components/Section4Feature'

export default function Page() {
	return (
		<div>
			<ScrollSequence />
			<RythemicRevealSection isVisible={true} />
			<Section3Transition />
			<Section4Feature />
		</div>
	)
}
