import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { InterestBadge as Badge } from '@/features/clients/components/InterestBadge'
import type { Client } from '@/features/clients/model/types'
import { formatClientId } from '../model/clientUtils'
import { interestLabel } from '../model/interests'

type ClientDetailsPageProps = {
  client: Client
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ClientDetailsPage({ client, onBack, onEdit, onDelete }: ClientDetailsPageProps) {
  return (
    <>
      <PageHeader title="Detalhes do cliente" />
      <button className="back-button" onClick={onBack}>
        <Icon name="arrow" />
        Voltar para clientes
      </button>
      <section className="card details-card">
        <div className="profile-heading">
          <Avatar name={client.nome} large />
          <div>
            <div className="profile-title">
              <h2>{client.nome}</h2>
              <Badge interest={client.interesse} />
            </div>
            <p>Cliente #{formatClientId(client.id)}</p>
          </div>
          <div className="profile-actions">
            <Button variant="secondary" icon="edit" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="ghost" icon="trash" onClick={onDelete}>
              Excluir
            </Button>
          </div>
        </div>
        <div className="details-grid">
          <div className="detail-item">
            <span>
              <Icon name="phone" />
            </span>
            <div>
              <small>Telefone</small>
              <strong>{client.telefone}</strong>
            </div>
          </div>
          <div className="detail-item">
            <span>
              <Icon name="mail" />
            </span>
            <div>
              <small>E-mail</small>
              <strong>{client.email || 'Não informado'}</strong>
            </div>
          </div>
          <div className="detail-item">
            <span>
              <Icon name="tag" />
            </span>
            <div>
              <small>Interesse imobiliário</small>
              <strong>{interestLabel[client.interesse]}</strong>
            </div>
          </div>
          <div className="detail-item">
            <span>
              <Icon name="shield" />
            </span>
            <div>
              <small>Identificador</small>
              <strong>#{formatClientId(client.id)}</strong>
            </div>
          </div>
        </div>
      </section>
      <div className="scope-note">
        <Icon name="check" />
        <p>
          <strong>Cadastro essencial</strong>
          <span>
            Esta visualização apresenta somente os dados disponíveis no sistema acadêmico original.
          </span>
        </p>
      </div>
    </>
  )
}
