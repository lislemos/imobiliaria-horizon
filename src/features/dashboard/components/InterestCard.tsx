import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { interestGroup } from '@/features/clients/model/interests'
import type { Client, Interest } from '@/features/clients/model/types'
import { percent } from '../summary'
import { InterestArt } from './InterestArt'

type InterestCardProps = {
  interest: Interest
  group: Client[]
  total: number
  onOpen: () => void
}

export function InterestCard({ interest, group, total, onOpen }: InterestCardProps) {
  return (
    <article className={`interest-card interest-card--${interest}`}>
      <header>
        <span className="interest-card__label">{interestGroup[interest]}</span>
        <button
          className="interest-card__open"
          onClick={onOpen}
          aria-label={`Ver clientes que ${interestGroup[interest].toLowerCase()}`}
        >
          <Icon name="arrow-up-right" size={16} />
        </button>
      </header>
      <strong className="interest-card__value">{percent(group.length, total)}%</strong>
      <span className="interest-card__note">
        {group.length} {group.length === 1 ? 'cliente' : 'clientes'} da base
      </span>
      <div className="avatar-stack">
        {group.slice(0, 3).map((c) => (
          <Avatar key={c.id} name={c.nome} />
        ))}
        {group.length > 3 && <span className="avatar avatar-stack__more">+{group.length - 3}</span>}
        {!group.length && <span className="avatar-stack__empty">Ninguém ainda</span>}
      </div>
      <InterestArt interest={interest} />
    </article>
  )
}
