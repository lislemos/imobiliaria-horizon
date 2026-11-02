import { PageHeader } from '@/components/ui/PageHeader'
import type { Client, ClientData } from '@/features/clients/model/types'
import { ClientForm } from '../components/ClientForm'
import { formatClientId } from '../model/clientUtils'

type ClientFormPageProps = {
  client?: Client
  onSave: (data: ClientData) => void
  onCancel: () => void
}

export function ClientFormPage({ client, onSave, onCancel }: ClientFormPageProps) {
  return (
    <>
      <PageHeader
        title={client ? 'Editar cliente' : 'Cadastrar cliente'}
        description={
          client
            ? `Atualize as informações de ${client.nome}.`
            : 'Adicione um novo contato à base da imobiliária.'
        }
      />
      {client && (
        <div className="record-id">
          <span>Identificador do registro</span>
          <strong>#{formatClientId(client.id)}</strong>
          <small>O ID é gerado automaticamente e não pode ser alterado.</small>
        </div>
      )}
      <section className="card form-card">
        <ClientForm client={client} onSave={onSave} onCancel={onCancel} />
      </section>
    </>
  )
}
