import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { ClientTable } from '../components/ClientTable'
import { EmptyState } from '../components/EmptyState'
import type { Client } from '../model/types'

type AtendenteListarPageProps = {
  clients: Client[]
  onGoToCadastrar: () => void
  onSelectClientForEdit: (client: Client) => void
  onSelectClientForDelete: (client: Client) => void
}

export function AtendenteListarPage({
  clients,
  onGoToCadastrar,
  onSelectClientForEdit,
  onSelectClientForDelete,
}: AtendenteListarPageProps) {
  return (
    <>
      <PageHeader
        title="Listar clientes"
        description="Visualização completa de todos os clientes registrados no sistema."
        action={
          <Button icon="plus" onClick={onGoToCadastrar}>
            Novo cliente
          </Button>
        }
      />

      <section className="card table-card">
        <div className="table-toolbar">
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Total de <strong>{clients.length}</strong>{' '}
            {clients.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}
          </p>
        </div>

        {clients.length > 0 ? (
          <ClientTable
            clients={clients}
            onView={onSelectClientForEdit}
            onEdit={onSelectClientForEdit}
            onDelete={onSelectClientForDelete}
          />
        ) : (
          <EmptyState search={false} onNew={onGoToCadastrar} />
        )}
      </section>
    </>
  )
}
