import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ClientForm } from '../components/ClientForm'
import { ClientTable } from '../components/ClientTable'
import { EmptyState } from '../components/EmptyState'
import type { Client, ClientData } from '../model/types'

type AtendenteAtualizarPageProps = {
  clients: Client[]
  selectedClient: Client | null
  onSelectClient: (client: Client | null) => void
  onUpdateClient: (id: number, data: ClientData) => void
  onGoToCadastrar: () => void
}

export function AtendenteAtualizarPage({
  clients,
  selectedClient,
  onSelectClient,
  onUpdateClient,
  onGoToCadastrar,
}: AtendenteAtualizarPageProps) {
  const [editingClient, setEditingClient] = useState<Client | null>(selectedClient)

  const handleSave = (data: ClientData) => {
    if (!editingClient) return
    onUpdateClient(editingClient.id, data)
    setEditingClient(null)
    onSelectClient(null)
  }

  return (
    <>
      <PageHeader
        title="Atualizar cliente"
        description={
          editingClient
            ? `Editando informações de ${editingClient.nome}.`
            : 'Selecione um cliente para alterar suas informações de contato e interesse.'
        }
        action={
          editingClient ? (
            <Button variant="secondary" onClick={() => setEditingClient(null)}>
              Escolher outro cliente
            </Button>
          ) : undefined
        }
      />

      {editingClient ? (
        <section className="card form-card">
          <ClientForm
            client={editingClient}
            onSave={handleSave}
            onCancel={() => setEditingClient(null)}
          />
        </section>
      ) : (
        <section className="card table-card">
          <div className="table-toolbar">
            <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Clique no botão de edição de qualquer cliente para atualizar seus dados:
            </p>
          </div>

          {clients.length > 0 ? (
            <ClientTable
              clients={clients}
              onView={(c) => setEditingClient(c)}
              onEdit={(c) => setEditingClient(c)}
              onDelete={() => {}}
            />
          ) : (
            <EmptyState search={false} onNew={onGoToCadastrar} />
          )}
        </section>
      )}
    </>
  )
}
