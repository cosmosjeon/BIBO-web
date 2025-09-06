import ScrollSequence from '@/features/intro/components/ScrollSequence'
import RythemicRevealSection from '@/features/intro/components/RythemicRevealSection'

export default function Page() {
	return (
		<div>
			<ScrollSequence />
			<RythemicRevealSection isVisible={true} />
		</div>
	)
}
