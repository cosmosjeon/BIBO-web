'use client'

import React from 'react'
import { useDevice } from '@/hooks/useDevice'
import { DeviceType } from '@/types/device'

type Renderable = React.ComponentType<Record<string, unknown>>

interface DeviceRendererProps {
  mobile?: Renderable
  tablet?: Renderable
  desktop?: Renderable
  fallback?: Renderable
  [key: string]: unknown
}

// 단순하고 안전한 디바이스 분기 렌더러
// - 훅은 최상위에서만 호출
// - 컴포넌트는 JSX로만 렌더링(함수 호출 금지)
export default function DeviceRenderer({
  mobile: MobileComponent,
  tablet: TabletComponent,
  desktop: DesktopComponent,
  fallback: FallbackComponent,
  ...props
}: DeviceRendererProps) {
  const { type } = useDevice()

  const pick = React.useCallback(
    (deviceType: DeviceType): Renderable | undefined => {
      switch (deviceType) {
        case 'mobile':
          return MobileComponent || TabletComponent || DesktopComponent || FallbackComponent
        case 'tablet':
          return TabletComponent || DesktopComponent || MobileComponent || FallbackComponent
        case 'desktop':
          return DesktopComponent || TabletComponent || MobileComponent || FallbackComponent
        default:
          return FallbackComponent || DesktopComponent || TabletComponent || MobileComponent
      }
    },
    [MobileComponent, TabletComponent, DesktopComponent, FallbackComponent]
  )

  const Selected = pick(type)

  if (!Selected) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('DeviceRenderer: No component provided for any device type')
    }
    return null
  }

  return <Selected {...props} />
}
