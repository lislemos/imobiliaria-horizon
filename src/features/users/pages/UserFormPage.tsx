import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Role } from '@/features/auth/types'
import { roleDescriptions, roleLabels } from '@/features/auth/types'
import type { CreateUserData } from '../useUsers'

type UserFormPageProps = {
  onSave: (data: CreateUserData) => { success: boolean; error?: string }
  onGoToConsultar: () => void
}

export function UserFormPage({ onSave, onGoToConsultar }: UserFormPageProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [role, setRole] = useState<Role>('corretor')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!nome.trim()) nextErrors.nome = 'Informe o nome completo.'
    if (!email.trim() || !email.includes('@')) nextErrors.email = 'Informe um e-mail válido.'
    if (!senha.trim() || senha.length < 4)
      nextErrors.senha = 'A senha deve ter pelo menos 4 caracteres.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const result = onSave({ nome: nome.trim(), email: email.trim(), senha: senha.trim(), role })
    if (!result.success && result.error) {
      setErrors({ email: result.error })
      return
    }

    onGoToConsultar()
  }

  return (
    <>
      <PageHeader
        title="Cadastrar usuário"
        description="Adicione um novo colaborador e defina sua permissão de acesso no sistema."
        action={
          <Button variant="secondary" onClick={onGoToConsultar}>
            Ver usuários cadastrados
          </Button>
        }
      />

      <section className="card form-card">
        <form onSubmit={submit} noValidate>
          <div className="form-section">
            <div className="form-section__heading">
              <span>01</span>
              <div>
                <h2>Dados de acesso</h2>
                <p>Identificação e credenciais de login do usuário.</p>
              </div>
            </div>

            <div className="form-grid">
              <label className={`field field--full ${errors.nome ? 'field--error' : ''}`}>
                <span>
                  Nome completo <em>*</em>
                </span>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    setErrors((prev) => ({ ...prev, nome: '' }))
                  }}
                  placeholder="Ex.: Carlos Eduardo Santos"
                  autoFocus
                />
                {errors.nome && <small>{errors.nome}</small>}
              </label>

              <label className={`field ${errors.email ? 'field--error' : ''}`}>
                <span>
                  E-mail corporativo <em>*</em>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({ ...prev, email: '' }))
                  }}
                  placeholder="usuario@horizonte.com.br"
                />
                {errors.email && <small>{errors.email}</small>}
              </label>

              <label className={`field ${errors.senha ? 'field--error' : ''}`}>
                <span>
                  Senha inicial <em>*</em>
                </span>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => {
                    setSenha(e.target.value)
                    setErrors((prev) => ({ ...prev, senha: '' }))
                  }}
                  placeholder="Mínimo de 4 caracteres"
                />
                {errors.senha && <small>{errors.senha}</small>}
              </label>
            </div>
          </div>

          <div className="form-divider" />

          <div className="form-section">
            <div className="form-section__heading">
              <span>02</span>
              <div>
                <h2>Nível de permissão</h2>
                <p>O perfil define quais telas e operações o usuário poderá acessar.</p>
              </div>
            </div>

            <div className="role-options-grid">
              {(['admin', 'corretor', 'atendente'] as Role[]).map((r) => (
                <label
                  key={r}
                  className={`role-option-card ${role === r ? 'role-option-card--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                  />
                  <div className="role-option-card__content">
                    <div className="role-option-card__header">
                      <Icon
                        name={r === 'admin' ? 'shield' : r === 'corretor' ? 'building' : 'users'}
                        size={20}
                      />
                      <strong>{roleLabels[r]}</strong>
                    </div>
                    <p>{roleDescriptions[r]}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setNome('')
                setEmail('')
                setSenha('')
                setErrors({})
              }}
            >
              Limpar campos
            </Button>
            <Button type="submit" icon="check">
              Confirmar cadastro
            </Button>
          </div>
        </form>
      </section>
    </>
  )
}
