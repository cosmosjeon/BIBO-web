'use client'

import { Rythem, Line, Word, Picture } from '@/components/ui/rythemic-reveal'

interface RythemicRevealSectionProps {
  isVisible?: boolean
  className?: string
}

export default function RythemicRevealSection({
  isVisible = true,
  className = '',
}: RythemicRevealSectionProps) {
  if (!isVisible) return null

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-[20vh] bg-background border-b flex justify-center items-center border-white text-white px-3">
        Scroll to Preview
      </div>
      <Rythem
        className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-7xl"
        imgsWidth={110}
      >
        <Line className="flex mx-auto w-fit gap-3">
          <Word>FROM</Word>
          <Word className="rounded-md inline-block overflow-hidden h-full">
            <Picture
              className=""
              src="https://rhythm-influence.transforms.svdcdn.com/staging/NBA-Branden.png?w=124&h=88&q=85&auto=format&fit=crop&dm=1729194929&s=77711c1f0cdc73e0e8bf384e490e5c33"
              alt=""
            />
          </Word>
          <Word>Athletes</Word>
          <Word>+</Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3 ">
          <Word>Celebrities</Word>
          <Word className="rounded-md inline-block overflow-hidden">
            <Picture
              src="https://rhythm-influence.transforms.svdcdn.com/staging/Influencer-03.png?w=124&h=88&q=85&auto=format&fit=crop&dm=1728475186&s=a57b961567e886a8167a413374ece559"
              alt=""
            />
          </Word>
          <Word>to</Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3 ">
          <Word>social</Word>
          <Word className="rounded-md ">
            <Picture
              src="https://rhythm-influence.transforms.svdcdn.com/staging/Tyra-2.png?w=124&h=88&q=85&auto=format&fit=crop&dm=1730838293&s=3b5c0a69e126e8434fb981fe8c162ceb"
              alt=""
            />
          </Word>
          <Word>media</Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3 ">
          <Word>stars,</Word>
          <Word>we</Word>
          <Word>select</Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3 ">
          <Word>the</Word>
          <Word className="rounded-md ">
            <Picture
              src="https://rhythm-influence.transforms.svdcdn.com/staging/Influencer-04.png?w=124&h=88&q=85&auto=format&fit=crop&dm=1728475186&s=a533a28b3c05a37d67a36b9219566d80"
              alt=""
            />
          </Word>
          <Word>most</Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3 ">
          <Word>authentic</Word>
          <Word>voices</Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3 ">
          <Word>to</Word>
          <Word>partner</Word>
          <Word>with</Word>
        </Line>

        <Line className="flex mx-auto w-fit gap-3 ">
          <Word>your</Word>
          <Word className="rounded-md ">
            <Picture
              src="https://rhythm-influence.transforms.svdcdn.com/staging/Influencer-05.png?w=124&h=88&q=85&auto=format&fit=crop&dm=1728475187&s=7c30b81ed396dd722a3a615fc941621f"
              alt=""
            />
          </Word>
          <Word>brand</Word>
        </Line>
      </Rythem>
    </div>
  )
}
