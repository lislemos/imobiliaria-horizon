import { useMemo, useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Role, User } from '@/features/auth/types'
import { roleLabels } from '@/features/auth/types'

type UserListPageProps = {
  users: User[]
  onGoToCadastrar: () => void
  onGoToExcluir: () => void
}

export function UserListPage({ users, onGoToCadastrar, onGoToExcluir }: UserListPageProps) {
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')

  const filteredUsers = useMemo(() => {
    const q = query.toLowerCase().trim()
    return users.filter((u) => {
      const matchQuery = !q || u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      return matchQuery && matchRole
    })
  }, [users, query, roleFilter])

  return (
    <>
      <PageHeader
        title="Consultar usuário"
        description="Pesquise, filtre e visualize os colaboradores e perfis cadastrados no sistema."
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={onGoToExcluir}>
              Excluir usuários
            </Button>
            <Button icon="plus" onClick={onGoToCadastrar}>
              Novo usuário
            </Button>
          </div>
        }
      />

      <section className="card table-card">
        <div className="table-toolbar" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div className="search-box" style={{ maxWidth: '360px', width: '100%' }}>
            <div
              className="login-input"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                padding: '0 14px',
                height: '40px',
              }}
            >
              <Icon name="search" size={16} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
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
                  <Icon name="close" size={14} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
              Filtrar por:
            </span>
            {(['all', 'admin', 'corretor', 'atendente'] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`text-button ${roleFilter === r ? 'active-filter' : ''}`}
                onClick={() => setRoleFilter(r)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: roleFilter === r ? 700 : 500,
                  background: roleFilter === r ? 'var(--primary-subtle)' : 'transparent',
                  color: roleFilter === r ? 'var(--primary)' : 'var(--muted)',
                }}
              >
                {r === 'all' ? 'Todos' : roleLabels[r]}
              </button>
            ))}
          </div>

          <p style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--muted)' }}>
            <strong>{filteredUsers.length}</strong>{' '}
            {filteredUsers.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
          </p>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Colaborador</th>
                  <th>E-mail</th>
                  <th>Permissão</th>
                  <th>Cadastrado em</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="id-cell">#{String(u.id).padStart(3, '0')}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar name={u.nome} />
                        <div>
                          <strong>{u.nome}</strong>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`role-badge role-badge--${u.role}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        <Icon
                          name={
                            u.role === 'admin'
                              ? 'shield'
                              : u.role === 'corretor'
                                ? 'building'
                                : 'users'
                          }
                          size={12}
                        />
                        {roleLabels[u.role]}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{u.criadoEm || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>
            <Icon name="search" size={32} />
            <h3 style={{ marginTop: '12px', color: 'var(--heading)' }}>
              Nenhum usuário encontrado
            </h3>
            <p style={{ fontSize: '13px' }}>
              Tente ajustar os termos da busca ou limpe os filtros.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
