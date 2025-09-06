'use client'

import DeviceRenderer from '@/components/DeviceRenderer'
import ScrollSequenceDesktop from './Desktop'
import ScrollSequenceMobile from './Mobile'

export default function ScrollSequence() {
  return (
    <DeviceRenderer
      mobile={ScrollSequenceMobile}
      tablet={ScrollSequenceDesktop}
      desktop={ScrollSequenceDesktop}
    />
  )
}