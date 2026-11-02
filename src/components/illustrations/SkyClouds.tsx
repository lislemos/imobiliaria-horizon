import { CloudBank } from '@/components/illustrations/CloudBank'
import { palette as hz } from '@/components/illustrations/palette'
import type { Puff } from './CloudBank'

const skyClouds: { base: string; light: string }[] = [
  { base: hz.mist, light: '#ffffff' },
  { base: hz.mistDeep, light: hz.mistLight },
  { base: hz.cream, light: '#fff7f0' },
  { base: hz.mistDeep, light: hz.mist },
  { base: hz.mist, light: '#ffffff' },
]
export const skyCloudPuffs: Puff[] = [
  [50, 62, 28],
  [88, 46, 38],
  [132, 58, 30],
  [108, 68, 24],
  [70, 70, 22],
  [160, 70, 20],
]

export function SkyClouds() {
  return (
    <>
      {skyClouds.map(({ base, light }, i) => (
        <svg
          key={i}
          className={`sky-cloud sky-cloud--${i + 1}`}
          viewBox="0 0 190 95"
          aria-hidden="true"
        >
          <CloudBank id={`sky-cloud-${i}`} puffs={skyCloudPuffs} base={base} light={light} />
        </svg>
      ))}
    </>
  )
}
