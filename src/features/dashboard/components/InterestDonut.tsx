import { Icon } from '@/components/ui/Icon'
import {
  interestIcon,
  interestLabel,
  interests,
  interestTone,
} from '@/features/clients/model/interests'
import type { Client, Interest } from '@/features/clients/model/types'
import type { CSSProperties } from 'react'
import { percent } from '../summary'

const DONUT_R = 54

const DONUT_C = 2 * Math.PI * DONUT_R

const DONUT_GAP = 4

type InterestDonutProps = {
  clients: Client[]
  openClients: (filter: Interest) => void
}

export function InterestDonut({ clients, openClients }: InterestDonutProps) {
  const total = clients.length
  let offset = 0
  const arcs = interests.map((interest) => {
    const count = clients.filter((c) => c.interesse === interest).length
    const length = total ? (count / total) * DONUT_C : 0
    const arc = {
      interest,
      count,
      length: Math.max(length - DONUT_GAP, 0),
      offset,
    }
    offset += length
    return arc
  })
  return (
    <article className="bento-card donut-card" aria-labelledby="donut-title">
      <header className="bento-card__head">
        <h2 id="donut-title">Interesse da base</h2>
        <span className="bento-chip">
          {total} {total === 1 ? 'cliente' : 'clientes'}
        </span>
      </header>
      <div className="donut">
        <svg viewBox="0 0 140 140" aria-hidden="true">
          <circle cx="70" cy="70" r={DONUT_R} className="donut__track" />
          {arcs
            .filter((a) => a.length > 0)
            .map((a, i) => (
              <circle
                key={a.interest}
                cx="70"
                cy="70"
                r={DONUT_R}
                className="donut__arc"
                stroke={interestTone[a.interest]}
                strokeDasharray={`${a.length} ${DONUT_C}`}
                strokeDashoffset={-a.offset}
                style={
                  {
                    '--len': a.length,
                    '--c': DONUT_C,
                    animationDelay: `${i * 120}ms`,
                  } as CSSProperties
                }
              />
            ))}
        </svg>
        <div className="donut__center">
          <strong>{total}</strong>
          <span>na base</span>
        </div>
      </div>
      <div className="segment-bar" aria-hidden="true">
        {arcs
          .filter((a) => a.count)
          .map((a) => (
            <i
              key={a.interest}
              style={{
                flexGrow: a.count,
                background: interestTone[a.interest],
              }}
            />
          ))}
      </div>
      <ul className="legend">
        {arcs.map((a) => (
          <li key={a.interest}>
            <button
              className={`legend__row legend__row--${a.interest}`}
              onClick={() => openClients(a.interest)}
            >
              <span className="legend__icon">
                <Icon name={interestIcon[a.interest]} size={15} />
              </span>
              {interestLabel[a.interest]}
              <strong>{a.count}</strong>
              <em>{percent(a.count, total)}%</em>
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}
