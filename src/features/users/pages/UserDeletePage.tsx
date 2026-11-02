import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import type { User } from '@/features/auth/types'
import { roleLabels } from '@/features/auth/types'

type UserDeletePageProps = {
  users: User[]
  currentUserId: number
  onDeleteUser: (id: number) => void
  onGoToConsultar: () => void
}

export function UserDeletePage({
  users,
  currentUserId,
  onDeleteUser,
  onGoToConsultar,
}: UserDeletePageProps) {
  const [selectedForDeletion, setSelectedForDeletion] = useState<User | null>(null)

  const handleConfirm = () => {
    if (!selectedForDeletion) return
    onDeleteUser(selectedForDeletion.id)
    setSelectedForDeletion(null)
  }

  return (
    <>
      <PageHeader
        title="Excluir usuário"
        description="Selecione um usuário para remover do sistema. Esta ação revoga imediatamente todos os acessos do colaborador."
        action={
          <Button variant="secondary" onClick={onGoToConsultar}>
            Voltar para consulta
          </Button>
        }
      />

      <section className="card table-card">
        <div className="table-toolbar">
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Total de <strong>{users.length}</strong>{' '}
            {users.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}
          </p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Colaborador</th>
                <th>E-mail</th>
                <th>Permissão</th>
                <th style={{ textAlign: 'right' }}>Ação de Exclusão</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isCurrentUser = u.id === currentUserId
                return (
                  <tr key={u.id}>
                    <td className="id-cell">#{String(u.id).padStart(3, '0')}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar name={u.nome} />
                        <div>
                          <strong>{u.nome}</strong>
                          {isCurrentUser && (
                            <span
                              style={{
                                marginLeft: '8px',
                                fontSize: '11px',
                                color: 'var(--primary)',
                                fontWeight: 600,
                              }}
                            >
                              (Sua conta)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge role-badge--${u.role}`}>
                        {roleLabels[u.role]}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isCurrentUser ? (
                        <span
                          style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}
                        >
                          Conta em uso
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="button button--danger"
                          style={{
                            minHeight: '32px',
                            padding: '0 14px',
                            fontSize: '12px',
                            gap: '6px',
                          }}
                          onClick={() => setSelectedForDeletion(u)}
                        >
                          <Icon name="trash" size={13} />
                          Excluir
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
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
                  Ação permanente no sistema
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
              Tem certeza que deseja excluir o usuário <strong>{selectedForDeletion.nome}</strong> (
              {selectedForDeletion.email})? Esta ação removerá o acesso permanentemente.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setSelectedForDeletion(null)}>
                Cancelar
              </Button>
              <Button variant="danger" icon="trash" onClick={handleConfirm}>
                Sim, excluir usuário
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
