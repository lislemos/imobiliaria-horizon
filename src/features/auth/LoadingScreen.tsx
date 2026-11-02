import { BrandMark } from '@/components/brand/BrandMark'
import { CloudBank } from '@/components/illustrations/CloudBank'
import { palette as hz } from '@/components/illustrations/palette'
import { SkyClouds } from '@/components/illustrations/SkyClouds'

const loadingSkyline: [x: number, width: number, top: number, fill: string][] = [
  [18, 26, 66, hz.horizon],
  [40, 20, 52, hz.neutral],
  [62, 30, 74, hz.neutralDeep],
  [150, 28, 60, hz.neutral],
  [176, 22, 72, hz.horizon],
  [196, 28, 56, hz.neutralDeep],
]

export function LoadingScreen() {
  return (
    <main className="login-page loading-screen" role="status" aria-live="polite">
      <SkyClouds />
      <div className="loading-screen__content">
        <svg className="loading-emblem" viewBox="0 0 240 124" aria-hidden="true">
          <clipPath id="loading-horizon">
            <rect x="0" y="0" width="240" height="104" />
          </clipPath>
          <g clipPath="url(#loading-horizon)">
            <g className="loading-emblem__sun">
              <circle cx="120" cy="66" r="50" fill={hz.sun} opacity=".3" />
              <circle cx="120" cy="66" r="32" fill={hz.sun} />
            </g>
          </g>
          <CloudBank
            id="loading-cloud-left"
            className="login-city__drift--sway"
            base={hz.mist}
            light="#ffffff"
            puffs={[
              [20, 96, 16],
              [40, 90, 20],
              [60, 98, 14],
            ]}
          />
          <CloudBank
            id="loading-cloud-right"
            className="login-city__drift--sway-reverse"
            base={hz.mistDeep}
            light={hz.mist}
            puffs={[
              [184, 96, 14],
              [204, 90, 20],
              [224, 97, 15],
            ]}
          />
          {loadingSkyline.map(([x, width, top, fill]) => (
            <rect key={x} x={x} y={top} width={width} height={104 - top} fill={fill} />
          ))}
          <rect x="98" y="82" width="44" height="22" fill={hz.cream} />
          <polygon points="94,83 120,64 146,83" fill={hz.clay} />
          <rect x="114" y="90" width="12" height="14" rx="2" fill={hz.forest} />
          <rect x="12" y="102" width="216" height="5" rx="2.5" fill={hz.forest} />
        </svg>
        <div className="login-brand loading-screen__brand">
          <BrandMark glass />
          <span>
            <strong>Horizonte</strong>
            <small>Imobiliária</small>
          </span>
        </div>
        <p>Abrindo seu painel…</p>
      </div>
    </main>
  )
}
