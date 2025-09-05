"use client"
import { useGSAP } from "@gsap/react"
import ScrollTrigger from "gsap/ScrollTrigger"
import { RefObject, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

/**
 *Default:- className="text-8xl font-semibold h-fit flex-col gap-10 justify-center items-center uppercase w-full"
 *
 */
function Rythem({
  children,
  className,
  imgsWidth,
  positionToAnimation = 75,
  scrollerRef,
  markers = false,
}: {
  children: React.ReactNode
  className?: string
  imgsWidth: number
  positionToAnimation?: number
  scrollerRef?: RefObject<HTMLElement>
  markers?: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [forceUpdate, setForceUpdate] = useState(false)
  useEffect(() => {
    if (scrollerRef?.current) {
      setForceUpdate(prev => !prev)
    }
  }, [scrollerRef])
  useGSAP(
    () => {
      if (!sectionRef.current) return
      
      // Get all lines (paragraphs) within the section
      const allLines = sectionRef.current.querySelectorAll("p")
      const allImages = sectionRef.current.querySelectorAll("img")
      const imgParents = Array.from(allImages).map((img) => {
        return img.parentElement!
      })

      // Animate each line separately without SplitText
      allLines.forEach((line) => {
        // Get all word spans within the line
        const words = line.querySelectorAll("span")
        
        // Set initial state for words
        gsap.set(words, {
          opacity: 0.2,
          y: 20,
        })

        // Create individual timeline for each line
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: line,
            start: `top ${positionToAnimation}%`,
            end: `top ${positionToAnimation - 10}%`,
            scrub: 1,
            scroller: scrollerRef?.current ?? window,
            markers: markers,
          },
        })

        // Animate words in sequence
        tl.to(words, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: {
            each: 0.1,
            from: "start",
          },
          ease: "power2.out",
        })
      })

      // Set initial state for images
      gsap.set(allImages, {
        scaleX: 0,
      })
      gsap.set(imgParents, {
        width: "0px",
      })
      
      // Animate images
      allImages.forEach((img, imgIndex) => {
        const imageTl = gsap.timeline({
          scrollTrigger: {
            trigger: img,
            start: `center ${positionToAnimation}%`,
            end: `center ${positionToAnimation}%`,
            toggleActions: "play none none reverse",
            scroller: scrollerRef?.current ?? window,
          },
        })
        imageTl
          .to(img, {
            scaleX: 1,
            duration: 0.3,
          })
          .to(
            imgParents[imgIndex],
            {
              width: imgsWidth + "px",
            },
            "<"
          )
      })
    },
    {
      scope: sectionRef,
      dependencies: [forceUpdate, positionToAnimation, imgsWidth, markers],
    }
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        "text-8xl font-semibold h-fit flex-col justify-center items-center uppercase w-full",
        className
      )}
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
    <span {...props} className={cn("overflow-hidden text-nowrap ", className)}>
      {children}
    </span>
  )
}

type PictureProps = React.ImgHTMLAttributes<HTMLImageElement>
/**
 *Default:- className="h-full"
 *
 */

function Picture({ ...props }: PictureProps) {
  return <img className="aspect-[none] object-cover" {...props} />
}

export { Rythem, Line, Word, Picture }
