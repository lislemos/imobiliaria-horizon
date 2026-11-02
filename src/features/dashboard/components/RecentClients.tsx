import type { Page } from '@/app/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { formatClientId } from '@/features/clients/model/clientUtils'
import { interestGroup } from '@/features/clients/model/interests'
import type { Client } from '@/features/clients/model/types'

const RECENT_COUNT = 5

type RecentClientsProps = {
  clients: Client[]
  view: (c: Client) => void
  go: (p: Page) => void
}

export function RecentClients({ clients, view, go }: RecentClientsProps) {
  const recent = [...clients].sort((a, b) => b.id - a.id).slice(0, RECENT_COUNT)
  return (
    <article className="bento-card recent-card" aria-labelledby="recent-title">
      <header className="bento-card__head">
        <h2 id="recent-title">
          Últimos cadastros <span className="bento-chip">{recent.length}</span>
        </h2>
        <button className="text-button" onClick={() => go('new')}>
          <Icon name="plus" size={15} />
          Novo
        </button>
      </header>
      <ul className="recent-list">
        {recent.map((c) => (
          <li key={c.id}>
            <button onClick={() => view(c)}>
              <span className="recent-list__id">#{formatClientId(c.id)}</span>
              <Avatar name={c.nome} />
              <span className="recent-list__who">
                <strong>{c.nome}</strong>
                <small>{interestGroup[c.interesse]}</small>
              </span>
              <Icon name="chevron" size={15} />
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}
