'use client'

import { useState, useCallback } from 'react'

export type ScrollPhase = 'initial' | 'typing' | 'completed'

interface ScrollPhaseState {
  currentPhase: ScrollPhase
  isScrollLocked: boolean
}

export const useScrollPhaseControl = () => {
  const [state, setState] = useState<ScrollPhaseState>({
    currentPhase: 'initial',
    isScrollLocked: false
  })

  // 검은 섹션 확장 완료 시 호출
  const onBlackSectionExpanded = useCallback(() => {
    setState({
      currentPhase: 'typing',
      isScrollLocked: true
    })
  }, [])

  // 타이핑 완료 시 호출
  const onTypingCompleted = useCallback(() => {
    setState({
      currentPhase: 'completed',
      isScrollLocked: false
    })
  }, [])

  // 초기 상태로 리셋
  const resetToInitial = useCallback(() => {
    setState({
      currentPhase: 'initial',
      isScrollLocked: false
    })
  }, [])

  return {
    currentPhase: state.currentPhase,
    isScrollLocked: state.isScrollLocked,
    onBlackSectionExpanded,
    onTypingCompleted,
    resetToInitial
  }
}
