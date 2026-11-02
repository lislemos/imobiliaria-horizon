import { CloudBank } from '@/components/illustrations/CloudBank'
import { palette as hz } from '@/components/illustrations/palette'
import type { Interest } from '@/features/clients/model/types'

type InterestArtProps = { interest: Interest }

export function InterestArt({ interest }: InterestArtProps) {
  return (
    <svg
      className="interest-card__art"
      viewBox="18 14 142 96"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      {interest === 'compra' && (
        <g>
          <rect x="44" y="52" width="78" height="50" fill="#fff8f2" />
          <rect x="52" y="62" width="38" height="28" fill="#5d8fbf" />
          <rect x="70" y="62" width="2" height="28" fill="white" />
          <rect x="98" y="66" width="16" height="36" fill="#d8b99c" />
          <rect x="38" y="44" width="90" height="9" rx="2" fill="white" />
          <rect x="38" y="53" width="90" height="3" fill="#dce4ee" />
        </g>
      )}
      {interest === 'venda' && (
        <g>
          <rect x="40" y="58" width="62" height="44" fill="#fff8f2" />
          <polygon points="34,60 71,30 108,60" fill={hz.clay} />
          <rect x="50" y="68" width="18" height="16" fill="#5d8fbf" />
          <rect x="78" y="74" width="14" height="28" fill="#d8b99c" />
          <rect x="121" y="58" width="3" height="44" fill={hz.forest} />
          <rect x="108" y="48" width="38" height="16" rx="3" fill="white" />
          <text x="127" y="59" textAnchor="middle" fontSize="7" fontWeight="800" fill="#c2413f">
            VENDE-SE
          </text>
        </g>
      )}
      {interest === 'aluguel' && (
        <g>
          <rect x="52" y="22" width="48" height="80" rx="3" fill="#fff8f2" />
          {[0, 1, 2, 3, 4].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={59 + col * 13}
                y={30 + row * 13}
                width="8"
                height="8"
                rx="1.5"
                fill={hz.tealLight}
              />
            )),
          )}
          <rect x="70" y="92" width="12" height="10" fill="#d8b99c" />
          <rect x="119" y="58" width="3" height="44" fill={hz.forest} />
          <rect x="104" y="48" width="38" height="16" rx="3" fill="white" />
          <text x="123" y="59" textAnchor="middle" fontSize="7" fontWeight="800" fill="#1d6b62">
            ALUGA-SE
          </text>
        </g>
      )}
      <CloudBank
        id={`interest-art-${interest}`}
        floor={102}
        base="white"
        light="white"
        puffs={[
          [14, 100, 16],
          [36, 96, 14],
          [138, 98, 16],
          [156, 94, 14],
        ]}
      />
    </svg>
  )
}
