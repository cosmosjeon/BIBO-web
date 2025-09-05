'use client'

import ScrollSequence from '@/features/intro/components/ScrollSequence'

type PageProps = {
	params: Promise<Record<string, string>>
}

export default function Page(_: PageProps) {
	return <ScrollSequence />
}
