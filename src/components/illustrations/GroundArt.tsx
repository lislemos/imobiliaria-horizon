import { CloudBank } from '@/components/illustrations/CloudBank'
import { palette as hz } from '@/components/illustrations/palette'
import { skyCloudPuffs } from './SkyClouds'

type PineProps = {
  x: number
  top: number
  width: number
  fill: string
  ground: number
  bottom: number
}

function Pine({ x, top, width, fill, ground, bottom }: PineProps) {
  const height = ground - top
  return (
    <g fill={fill}>
      <rect x={x - 3} y={ground - 8} width="6" height={bottom - ground + 8} fill={hz.forest} />
      {[0, 1, 2, 3].map((tier) => {
        const tierTop = top + tier * height * 0.2
        const half = (width / 2) * (0.42 + tier * 0.2)
        return (
          <polygon
            key={tier}
            points={`${x},${tierTop} ${x + half},${tierTop + height * 0.4} ${x - half},${tierTop + height * 0.4}`}
          />
        )
      })}
    </g>
  )
}

function GroundScene() {
  return (
    <svg className="ground-art__scene" viewBox="0 0 248 150">
      <circle cx="74" cy="98" r="24" fill={hz.sun} />
      <CloudBank
        id="sidebar-cloud-back"
        floor={150}
        base={hz.mistDeep}
        light={hz.mist}
        puffs={[
          [150, 112, 28],
          [196, 98, 36],
          [244, 112, 28],
        ]}
      />
      <Pine x={204} top={48} width={44} fill={hz.forestLight} ground={142} bottom={150} />
      <Pine x={228} top={70} width={38} fill={hz.forest} ground={142} bottom={150} />
      <CloudBank
        id="sidebar-cloud-front"
        floor={142}
        base={hz.mist}
        light={hz.mistLight}
        puffs={[
          [4, 128, 30],
          [48, 118, 34],
          [96, 130, 26],
          [136, 138, 18],
        ]}
      />
    </svg>
  )
}

export function GroundArt() {
  return (
    <div className="ground-art" aria-hidden="true">
      {[1, 2].map((n) => (
        <svg key={n} className={`ground-art__puff ground-art__puff--${n}`} viewBox="0 0 190 95">
          <CloudBank
            id={`ground-puff-${n}`}
            puffs={skyCloudPuffs}
            base={hz.mist}
            light={hz.mistLight}
          />
        </svg>
      ))}
      <GroundScene />
    </div>
  )
}
