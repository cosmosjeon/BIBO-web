'use client'

import { useState, useEffect } from 'react'
import { DeviceInfo, DeviceType, BREAKPOINTS } from '@/types/device'

function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.mobile) return 'mobile'
  if (width < BREAKPOINTS.tablet) return 'tablet'
  return 'desktop'
}

function createDeviceInfo(width: number, height: number): DeviceInfo {
  const type = getDeviceType(width)
  
  return {
    type,
    isMobile: type === 'mobile',
    isTablet: type === 'tablet', 
    isDesktop: type === 'desktop',
    width,
    height,
  }
}

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // SSR safe default
    return createDeviceInfo(1024, 768)
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceInfo(createDeviceInfo(window.innerWidth, window.innerHeight))
    }

    // 초기 설정
    updateDeviceInfo()

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}