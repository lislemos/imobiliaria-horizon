import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { InterestBadge as Badge } from '@/features/clients/components/InterestBadge'
import { formatClientId } from '@/features/clients/model/clientUtils'
import { interestLabel, interests } from '@/features/clients/model/interests'
import type { Client, Interest } from '@/features/clients/model/types'
import { useState } from 'react'

type ClientSpotlightProps = {
  clients: Client[]
  view: (c: Client) => void
  edit: (c: Client) => void
  remove: (c: Client) => void
}

export function ClientSpotlight({ clients, view, edit, remove }: ClientSpotlightProps) {
  const [show, setShow] = useState<Interest | 'all'>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const visible = [...clients]
    .sort((a, b) => b.id - a.id)
    .filter((c) => show === 'all' || c.interesse === show)
  const selected = visible.find((c) => c.id === selectedId) ?? visible[0]
  const tabs: [Interest | 'all', string][] = [
    ['all', 'Todos'],
    ...interests.map((i) => [i, interestLabel[i]] as [Interest, string]),
  ]
  return (
    <article className="bento-card spotlight" aria-labelledby="spotlight-title">
      <header className="spotlight__head">
        <h2 id="spotlight-title">Clientes em foco</h2>
        <div className="spotlight__tabs" role="group" aria-label="Filtrar por interesse">
          {tabs.map(([key, label]) => {
            const n =
              key === 'all' ? clients.length : clients.filter((c) => c.interesse === key).length
            return (
              <button key={key} aria-pressed={show === key} onClick={() => setShow(key)}>
                {label}
                <span>{n}</span>
              </button>
            )
          })}
        </div>
      </header>
      <div className="spotlight__body">
        <ul className="spotlight__list">
          {visible.map((c) => (
            <li key={c.id}>
              <button
                className={`spotlight__row ${
                  selected?.id === c.id ? 'spotlight__row--active' : ''
                }`}
                aria-pressed={selected?.id === c.id}
                onClick={() => setSelectedId(c.id)}
              >
                <Avatar name={c.nome} />
                <span>
                  <strong>{c.nome}</strong>
                  <small>
                    #{formatClientId(c.id)} · {interestLabel[c.interesse]}
                  </small>
                </span>
                <Icon name="chevron" size={15} />
              </button>
            </li>
          ))}
          {!visible.length && (
            <li className="spotlight__empty">Nenhum cliente com esse interesse.</li>
          )}
        </ul>
        {selected && (
          <div className={`spotlight__record spotlight__record--${selected.interesse}`}>
            <div className="spotlight__record-top">
              <div>
                <small>Ficha</small>
                <strong>#{formatClientId(selected.id)}</strong>
              </div>
              <Badge interest={selected.interesse} />
            </div>
            <div className="spotlight__who">
              <Avatar name={selected.nome} large />
              <div>
                <h3>{selected.nome}</h3>
                <p>Interesse em {interestLabel[selected.interesse].toLowerCase()}</p>
              </div>
            </div>
            <div className="spotlight__facts">
              <div>
                <Icon name="phone" size={16} />
                <small>Telefone</small>
                <strong>{selected.telefone}</strong>
              </div>
              <div>
                <Icon name="mail" size={16} />
                <small>E-mail</small>
                <strong>{selected.email || 'Não informado'}</strong>
              </div>
            </div>
            <div className="spotlight__actions">
              <button
                className="icon-button"
                onClick={() => edit(selected)}
                aria-label={`Editar ${selected.nome}`}
              >
                <Icon name="edit" />
              </button>
              <button
                className="icon-button icon-button--danger"
                onClick={() => remove(selected)}
                aria-label={`Excluir ${selected.nome}`}
              >
                <Icon name="trash" />
              </button>
              <button className="spotlight__open" onClick={() => view(selected)}>
                Abrir ficha <Icon name="arrow-up-right" size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
