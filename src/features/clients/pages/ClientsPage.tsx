import type { Page } from '@/app/navigation'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { interestGroup, interestLabel } from '@/features/clients/model/interests'
import type { Client, Interest } from '@/features/clients/model/types'
import { useMemo } from 'react'
import { ClientTable } from '../components/ClientTable'
import { EmptyState } from '../components/EmptyState'

type ClientsPageProps = {
  clients: Client[]
  query: string
  setQuery: (value: string) => void
  filter: Interest | null
  setFilter: (filter: Interest | null) => void
  go: (p: Page) => void
  view: (c: Client) => void
  edit: (c: Client) => void
  remove: (c: Client) => void
}

export function ClientsPage({
  clients,
  query,
  setQuery,
  filter,
  setFilter,
  go,
  view,
  edit,
  remove,
}: ClientsPageProps) {
  const filtered = useMemo(() => {
    const nameQuery = query.toLowerCase()
    const phoneQuery = query.replace(/\D/g, '')
    return clients.filter(
      (client) =>
        (!filter || client.interesse === filter) &&
        (client.nome.toLowerCase().includes(nameQuery) ||
          (phoneQuery !== '' && client.telefone.replace(/\D/g, '').includes(phoneQuery))),
    )
  }, [clients, query, filter])
  const clear = () => {
    setQuery('')
    setFilter(null)
  }
  return (
    <>
      <PageHeader
        title={filter ? interestGroup[filter] : 'Clientes'}
        description="Consulte, organize e mantenha sua base sempre atualizada."
        action={
          <Button icon="plus" onClick={() => go('new')}>
            Novo cliente
          </Button>
        }
      />
      <section className="card table-card clients-card">
        <div className="table-toolbar">
          <p>
            <strong>{filtered.length}</strong> {filtered.length === 1 ? 'cliente' : 'clientes'}
            {filter && <> com interesse em {interestLabel[filter].toLowerCase()}</>}
            {query && <> para “{query}”</>}
          </p>
          {(query || filter) && (
            <button className="text-button" onClick={clear}>
              {filter ? 'Ver todos' : 'Limpar busca'}
            </button>
          )}
        </div>
        {filtered.length ? (
          <ClientTable clients={filtered} onView={view} onEdit={edit} onDelete={remove} />
        ) : (
          <EmptyState search={Boolean(query || filter)} onNew={() => go('new')} onClear={clear} />
        )}
      </section>
    </>
  )
}
