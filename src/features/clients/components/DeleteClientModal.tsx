import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import type { Client } from '@/features/clients/model/types'

type DeleteClientModalProps = {
  client: Client
  close: () => void
  confirm: () => void
}

export function DeleteClientModal({ client, close, confirm }: DeleteClientModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={close}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <span className="modal__danger">
          <Icon name="trash" size={23} />
        </span>
        <h2 id="delete-title">Excluir cliente?</h2>
        <p>
          Tem certeza de que deseja excluir o cadastro de <strong>{client.nome}</strong>? Esta ação
          não poderá ser desfeita.
        </p>
        <div className="modal__actions">
          <Button variant="secondary" onClick={close}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirm}>
            Excluir cliente
          </Button>
        </div>
      </div>
    </div>
  )
}
