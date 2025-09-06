"use client"
import { RefObject, useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"

/**
 *Default:- className="text-8xl font-semibold h-fit flex-col gap-10 justify-center items-center uppercase w-full"
 *
 */

function Rythem({
  children,
  className,
  imgsWidth,
  positionToAnimation = 75,
}: {
  children: React.ReactNode
  className?: string
  imgsWidth: number
  positionToAnimation?: number
  scrollerRef?: RefObject<HTMLElement>
  markers?: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [textElements, setTextElements] = useState<Element[]>([])
  const [imageElements, setImageElements] = useState<Element[]>([])

  // 요소들을 찾고 초기화
  useEffect(() => {
    if (!sectionRef.current) return

    const allLines = Array.from(sectionRef.current.querySelectorAll("p"))
    const allImages = Array.from(sectionRef.current.querySelectorAll("img"))

    setTextElements(allLines)
    setImageElements(allImages)

    // 초기 상태 설정 - 텍스트와 이미지를 함께 처리
    allLines.forEach((line) => {
      const walker = document.createTreeWalker(
        line,
        NodeFilter.SHOW_TEXT,
        null
      )
      
      const textNodes: Text[] = []
      let node
      while (node = walker.nextNode()) {
        textNodes.push(node as Text)
      }
      
      textNodes.forEach((textNode) => {
        const text = textNode.textContent || ''
        const chars = text.split('')
        
        // 텍스트 노드를 span으로 감싸기
        const fragment = document.createDocumentFragment()
        chars.forEach((char, index) => {
          if (char === ' ') {
            fragment.appendChild(document.createTextNode(' '))
          } else {
            const span = document.createElement('span')
            span.className = `char-reveal char-${index}`
            span.style.cssText = 'opacity: 0.2; transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1); transition-delay: ' + (index * 0.05) + 's;'
            span.textContent = char
            fragment.appendChild(span)
          }
        })
        
        textNode.parentNode?.replaceChild(fragment, textNode)
      })
    })

    // 이미지 초기 상태
    allImages.forEach((img) => {
      const parent = img.parentElement
      if (parent) {
        parent.style.overflow = 'hidden'
        parent.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
        // 초기 너비는 유지하되, 이미지만 숨김
        if (!parent.style.width) {
          parent.style.width = `${imgsWidth}px`
        }
      }
      img.style.transform = 'scaleX(0)'
      img.style.transformOrigin = 'left center'
      img.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      img.style.opacity = '0'
    })
  }, [children, imgsWidth])

  // 스크롤 감지 및 애니메이션 실행
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement

            // 텍스트 애니메이션
            if (element.tagName === 'P') {
              const chars = element.querySelectorAll('.char-reveal')
              chars.forEach((char, index) => {
                setTimeout(() => {
                  (char as HTMLElement).style.opacity = '1'
                }, index * 50)
              })
            }

            // 이미지 애니메이션
            if (element.tagName === 'IMG') {
              setTimeout(() => {
                element.style.transform = 'scaleX(1)'
                element.style.opacity = '1'
              }, 100)
            }
          }
        })
      },
      {
        threshold: positionToAnimation / 100,
        rootMargin: '-10% 0px -10% 0px'
      }
    )

    // 모든 텍스트와 이미지 요소를 관찰
    const allElements = [
      ...Array.from(sectionRef.current.querySelectorAll('p')),
      ...Array.from(sectionRef.current.querySelectorAll('img'))
    ]

    allElements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      allElements.forEach((element) => {
        observer.unobserve(element)
      })
    }
  }, [textElements, imageElements, imgsWidth, positionToAnimation])

  return (
    <section
      ref={sectionRef}
      className={cn(
        "text-8xl font-semibold h-screen flex-col justify-center items-center uppercase w-full",
        className
      )}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {children}
    </section>
  )
}

type LineProps = React.HTMLAttributes<HTMLParagraphElement> & {
  children: React.ReactNode
}

function Line({ children, className, ...props }: LineProps) {
  return (
    <p {...props} className={cn("items-center inline-block", className)}>
      {children}
    </p>
  )
}

type WordProps = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode
}

function Word({ children, className, ...props }: WordProps) {
  return (
    <span 
      {...props} 
      className={cn(
        "overflow-hidden text-nowrap inline-block",
        "relative px-1 -mx-1",
        "transition-all duration-300 ease-in-out",
        "text-black",
        className
      )}
      style={{
        boxShadow: 'inset 0 0 0 0 transparent',
        color: 'inherit',
        transition: 'color 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
      }}
      onMouseEnter={(e) => {
        const element = e.currentTarget
        const width = element.offsetWidth
        element.style.color = '#fff'
        element.style.boxShadow = `inset ${width}px 0 0 0 #000`
      }}
      onMouseLeave={(e) => {
        const element = e.currentTarget
        element.style.color = 'inherit'
        element.style.boxShadow = 'inset 0 0 0 0 transparent'
      }}
    >
      {children}
    </span>
  )
}

type PictureProps = React.ImgHTMLAttributes<HTMLImageElement>
/**
 *Default:- className="h-full"
 *
 */

function Picture({ className, ...props }: PictureProps) {
  return (
    <img 
      className={cn("aspect-[none] object-cover h-full w-full", className)} 
      alt=""
      {...props} 
    />
  )
}

export { Rythem, Line, Word, Picture }
