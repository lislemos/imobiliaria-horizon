import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { InterestBadge } from '../components/InterestBadge'
import { formatClientId } from '../model/clientUtils'
import type { Client } from '../model/types'

type AtendenteExcluirPageProps = {
  clients: Client[]
  onDeleteClient: (id: number) => void
  onGoToListar: () => void
}

export function AtendenteExcluirPage({
  clients,
  onDeleteClient,
  onGoToListar,
}: AtendenteExcluirPageProps) {
  const [selectedForDeletion, setSelectedForDeletion] = useState<Client | null>(null)

  const handleConfirm = () => {
    if (!selectedForDeletion) return
    onDeleteClient(selectedForDeletion.id)
    setSelectedForDeletion(null)
  }

  return (
    <>
      <PageHeader
        title="Excluir cliente"
        description="Selecione um cliente para remover da base. O cadastro será excluído permanentemente."
        action={
          <Button variant="secondary" onClick={onGoToListar}>
            Ver lista de clientes
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
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Interesse</th>
                  <th style={{ textAlign: 'right' }}>Ação de Exclusão</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td className="id-cell">#{formatClientId(c.id)}</td>
                    <td>
                      <strong>{c.nome}</strong>
                    </td>
                    <td>{c.telefone}</td>
                    <td>{c.email || '—'}</td>
                    <td>
                      <InterestBadge interest={c.interesse} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="button button--danger"
                        style={{
                          minHeight: '32px',
                          padding: '0 14px',
                          fontSize: '12px',
                          gap: '6px',
                        }}
                        onClick={() => setSelectedForDeletion(c)}
                      >
                        <Icon name="trash" size={13} />
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>
            <Icon name="users" size={32} />
            <h3 style={{ marginTop: '12px', color: 'var(--heading)' }}>
              Nenhum cliente para excluir
            </h3>
            <p style={{ fontSize: '13px' }}>A base de clientes já está vazia.</p>
          </div>
        )}
      </section>

      {selectedForDeletion && (
        <div className="modal-backdrop" onClick={() => setSelectedForDeletion(null)}>
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', padding: '28px' }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="trash" size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--heading)' }}>
                  Confirmar exclusão
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                  Ação definitiva
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--text)',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              Deseja realmente excluir o cliente <strong>{selectedForDeletion.nome}</strong>?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setSelectedForDeletion(null)}>
                Cancelar
              </Button>
              <Button variant="danger" icon="trash" onClick={handleConfirm}>
                Sim, excluir cliente
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
