'use client'

import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export interface SimpleSplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  ease?: string
  splitType?: 'chars' | 'words'
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  threshold?: number
  rootMargin?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  textAlign?: React.CSSProperties['textAlign']
}

const SimpleSplitText: React.FC<SimpleSplitTextProps> = ({
  text,
  className = '',
  delay = 100,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.05,
  rootMargin = '0px',
  tag = 'p',
  textAlign = 'center'
}) => {
  const ref = useRef<HTMLElement>(null)
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true)
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true)
      })
    }
  }, [])

  // 텍스트를 분할하는 함수 (이모티콘 및 띄어쓰기 처리 개선)
  const splitText = (text: string, type: 'chars' | 'words'): string[] => {
    if (type === 'words') {
      return text.split(' ').filter(word => word.length > 0)
    } else {
      // 이모티콘을 포함한 문자를 제대로 분할하기 위해 정규식 사용
      const chars = [...text] // 스프레드 연산자로 유니코드 문자 제대로 분할
      return chars
    }
  }

  useGSAP(() => {
    if (!ref.current || !text || !fontsLoaded) return

    const elements = ref.current.querySelectorAll('.split-item')
    if (elements.length === 0) return

    // Validate elements are still in DOM
    const validElements = Array.from(elements).filter(el => el.parentNode)
    if (validElements.length === 0) return

    // 초기 상태 설정
    gsap.set(validElements, from)

    // ScrollTrigger로 애니메이션
    const startPct = (1 - threshold) * 100
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin)
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0
    const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px'
    const sign = marginValue === 0 ? '' : marginValue < 0 
      ? `-=${Math.abs(marginValue)}${marginUnit}` 
      : `+=${marginValue}${marginUnit}`
    const start = `top ${startPct}%${sign}`

    // 부모 섹션 찾기
    const parentSection = ref.current?.closest('section')
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parentSection || ref.current, // 섹션을 트리거로 사용
        start: 'top 60%', // 더 늦게 트리거 (섹션이 더 들어와야 시작)
        end: 'bottom 20%',
        once: false,
        fastScrollEnd: true,
        onRefresh: () => {
          // Revalidate elements on refresh to avoid stale references
          const currentElements = ref.current?.querySelectorAll('.split-item')
          if (!currentElements || currentElements.length === 0) {
            tl.kill()
          }
        }
      }
    })

    // 1.2초 지연 후 애니메이션 시작
    tl.to(validElements, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      delay: 1.2,
      onComplete: () => {
        // Clean up timeline after completion
        tl.kill()
      }
    })

  }, {
    dependencies: [text, delay, duration, ease, splitType, JSON.stringify(from), JSON.stringify(to), threshold, rootMargin, fontsLoaded],
    scope: ref,
    revertOnUpdate: true // Ensures proper cleanup when dependencies change
  })

  const renderContent = () => {
    const items = splitText(text, splitType)
    
    return items.map((item, index) => (
      <span 
        key={index} 
        className="split-item inline-block"
        style={{ 
          whiteSpace: 'pre', // 띄어쓰기와 공백 문자 보존
          marginRight: splitType === 'words' && index < items.length - 1 ? '0.25em' : undefined
        }}
      >
        {item === ' ' ? '\u00A0' : item} {/* 공백을 non-breaking space로 변환 */}
      </span>
    ))
  }

  const style: React.CSSProperties = {
    textAlign,
    wordWrap: 'break-word',
    willChange: 'transform, opacity'
  }
  
  const classes = `split-parent overflow-hidden ${className}`

  switch (tag) {
    case 'h1':
      return <h1 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h1>
    case 'h2':
      return <h2 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h2>
    case 'h3':
      return <h3 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h3>
    case 'h4':
      return <h4 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h4>
    case 'h5':
      return <h5 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h5>
    case 'h6':
      return <h6 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>{renderContent()}</h6>
    default:
      return <p ref={ref as React.RefObject<HTMLParagraphElement>} style={style} className={classes}>{renderContent()}</p>
  }
}

export default SimpleSplitText