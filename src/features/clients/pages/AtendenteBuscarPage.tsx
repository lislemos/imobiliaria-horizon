import { useMemo, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { ClientTable } from '../components/ClientTable'
import { EmptyState } from '../components/EmptyState'
import { interestLabel, interests } from '../model/interests'
import type { Client, Interest } from '../model/types'

type AtendenteBuscarPageProps = {
  clients: Client[]
  onSelectClientForEdit: (client: Client) => void
  onSelectClientForDelete: (client: Client) => void
  onGoToCadastrar: () => void
}

export function AtendenteBuscarPage({
  clients,
  onSelectClientForEdit,
  onSelectClientForDelete,
  onGoToCadastrar,
}: AtendenteBuscarPageProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Interest | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const numQ = query.replace(/\D/g, '')
    return clients.filter((c) => {
      const matchName = !q || c.nome.toLowerCase().includes(q)
      const matchPhone = numQ !== '' && c.telefone.replace(/\D/g, '').includes(numQ)
      const matchEmail = Boolean(c.email && c.email.toLowerCase().includes(q))
      const matchInterest = filter === 'all' || c.interesse === filter
      return (matchName || matchPhone || matchEmail) && matchInterest
    })
  }, [clients, query, filter])

  const clear = () => {
    setQuery('')
    setFilter('all')
  }

  return (
    <>
      <PageHeader
        title="Buscar cliente"
        description="Pesquise por nome, telefone ou filtre por tipo de interesse imobiliário."
      />

      <section className="card table-card">
        <div className="table-toolbar" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div className="search-box" style={{ maxWidth: '380px', width: '100%' }}>
            <div
              className="login-input"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                padding: '0 14px',
                height: '42px',
              }}
            >
              <Icon name="search" size={17} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite o nome, telefone ou e-mail..."
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '13px',
                  color: 'var(--heading)',
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    display: 'flex',
                  }}
                >
                  <Icon name="close" size={15} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
              Interesse:
            </span>
            <button
              type="button"
              className={`text-button ${filter === 'all' ? 'active-filter' : ''}`}
              onClick={() => setFilter('all')}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: filter === 'all' ? 700 : 500,
                background: filter === 'all' ? 'var(--primary-subtle)' : 'transparent',
                color: filter === 'all' ? 'var(--primary)' : 'var(--muted)',
              }}
            >
              Todos
            </button>
            {interests.map((interest) => (
              <button
                key={interest}
                type="button"
                className={`text-button ${filter === interest ? 'active-filter' : ''}`}
                onClick={() => setFilter(interest)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: filter === interest ? 700 : 500,
                  background: filter === interest ? 'var(--primary-subtle)' : 'transparent',
                  color: filter === interest ? 'var(--primary)' : 'var(--muted)',
                }}
              >
                {interestLabel[interest]}
              </button>
            ))}
          </div>

          <p style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--muted)' }}>
            <strong>{filtered.length}</strong> {filtered.length === 1 ? 'resultado' : 'resultados'}
          </p>
        </div>

        {filtered.length > 0 ? (
          <ClientTable
            clients={filtered}
            onView={onSelectClientForEdit}
            onEdit={onSelectClientForEdit}
            onDelete={onSelectClientForDelete}
          />
        ) : (
          <EmptyState
            search={Boolean(query || filter !== 'all')}
            onNew={onGoToCadastrar}
            onClear={clear}
          />
        )}
      </section>
    </>
  )
}
