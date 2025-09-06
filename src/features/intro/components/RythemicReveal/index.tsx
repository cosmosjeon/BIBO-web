'use client'

import DeviceRenderer from '@/components/DeviceRenderer'
import RythemicRevealDesktop from './Desktop'
import RythemicRevealMobile from './Mobile'

interface RythemicRevealSectionProps {
  isVisible?: boolean
  className?: string
}

export default function RythemicRevealSection(props: RythemicRevealSectionProps) {
  return (
    <DeviceRenderer
      mobile={RythemicRevealMobile}
      tablet={RythemicRevealDesktop}
      desktop={RythemicRevealDesktop}
      {...props}
    />
  )
}