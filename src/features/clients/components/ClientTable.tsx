import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { InterestBadge as Badge } from '@/features/clients/components/InterestBadge'
import type { Client } from '@/features/clients/model/types'
import { formatClientId } from '../model/clientUtils'

type ClientTableProps = {
  clients: Client[]
  onView: (c: Client) => void
  onEdit: (c: Client) => void
  onDelete: (c: Client) => void
}

export function ClientTable({ clients, onView, onEdit, onDelete }: ClientTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Telefone</th>
            <th>E-mail</th>
            <th>Interesse</th>
            <th>
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="id-cell">#{formatClientId(client.id)}</td>
              <td>
                <button className="client-link" onClick={() => onView(client)}>
                  <Avatar name={client.nome} />
                  <span>
                    <strong>{client.nome}</strong>
                    <small>Ver detalhes</small>
                  </span>
                </button>
              </td>
              <td>{client.telefone}</td>
              <td>{client.email || '—'}</td>
              <td className="interest-cell">
                <Badge interest={client.interesse} />
              </td>
              <td>
                <div className="row-actions">
                  <button
                    className="icon-button"
                    onClick={() => onEdit(client)}
                    aria-label={`Editar ${client.nome}`}
                  >
                    <Icon name="edit" />
                  </button>
                  <button
                    className="icon-button icon-button--danger"
                    onClick={() => onDelete(client)}
                    aria-label={`Excluir ${client.nome}`}
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
