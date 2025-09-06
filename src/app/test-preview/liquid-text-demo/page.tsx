import { MorphingText } from '@/components/ui/liquid-text'

export default function Page() {
  return (
    <div className="px-6 py-12">
      <div className="mb-10 text-center text-sm text-muted-foreground">Liquid Text Demo</div>
      <MorphingText
        texts={[
          'Hello',
          'Designali',
          'Text',
          'Animation',
          'Design',
          'Component',
          'Smooth',
          'Transition',
        ]}
        className="text-white"
      />
    </div>
  )
}

