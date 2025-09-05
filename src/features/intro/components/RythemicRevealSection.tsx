'use client'

import { Rythem, Line, Word, Picture } from "@/components/ui/rythemic-reveal"

interface RythemicRevealSectionProps {
  isVisible?: boolean
}

export default function RythemicRevealSection({ isVisible = true }: RythemicRevealSectionProps) {
  return (
    <section className={`min-h-screen bg-white transition-all duration-1000 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="w-full h-[20vh] bg-white border-b flex justify-center items-center border-gray-200 text-gray-800 px-3">
        <span className="text-lg font-medium">Scroll to Preview</span>
      </div>
      
      <div className="py-[10vh]">
        <Rythem
          className="text-xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-7xl text-black font-bold"
          imgsWidth={110}
        >
          <Line className="flex mx-auto w-fit gap-3">
            <Word>혁신적인</Word>
            <Word className="rounded-md inline-block overflow-hidden h-full">
              <Picture
                className=""
                src="https://picsum.photos/124/88?random=1"
                alt="Innovation"
              />
            </Word>
            <Word>아이디어로</Word>
            <Word>+</Word>
          </Line>

          <Line className="flex mx-auto w-fit gap-3">
            <Word>세상을</Word>
            <Word className="rounded-md inline-block overflow-hidden">
              <Picture
                src="https://picsum.photos/124/88?random=2"
                alt="World"
              />
            </Word>
            <Word>바꾸는</Word>
          </Line>

          <Line className="flex mx-auto w-fit gap-3">
            <Word>디지털</Word>
            <Word className="rounded-md">
              <Picture
                src="https://picsum.photos/124/88?random=3"
                alt="Digital"
              />
            </Word>
            <Word>경험을</Word>
          </Line>

          <Line className="flex mx-auto w-fit gap-3">
            <Word>만들어</Word>
            <Word>갑니다.</Word>
          </Line>

          <Line className="flex mx-auto w-fit gap-3">
            <Word>우리는</Word>
            <Word className="rounded-md">
              <Picture
                src="https://picsum.photos/124/88?random=4"
                alt="Team"
              />
            </Word>
            <Word>최고의</Word>
          </Line>

          <Line className="flex mx-auto w-fit gap-3">
            <Word>기술과</Word>
            <Word>창의성으로</Word>
          </Line>

          <Line className="flex mx-auto w-fit gap-3">
            <Word>당신의</Word>
            <Word>꿈을</Word>
            <Word>현실로</Word>
          </Line>

          <Line className="flex mx-auto w-fit gap-3">
            <Word>만듭니다</Word>
            <Word className="rounded-md">
              <Picture
                src="https://picsum.photos/124/88?random=5"
                alt="Dreams"
              />
            </Word>
          </Line>
        </Rythem>
      </div>
    </section>
  )
}
