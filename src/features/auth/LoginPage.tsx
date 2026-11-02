import { useState, type FormEvent } from 'react'
import loginBackdrop from '@/assets/login-fundo.webp'
import loginNight from '@/assets/login-noite.webp'
import { BrandMark } from '@/components/brand/BrandMark'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { Role, User } from '@/features/auth/types'
import { roleDescriptions, roleLabels } from '@/features/auth/types'
import type { Theme } from '@/hooks/useTheme'

type LoginPageProps = {
  users: User[]
  onLogin: (user: User) => void
  onExit: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function LoginPage({ users, onLogin, onExit, theme, onToggleTheme }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<Role>('admin')
  const [email, setEmail] = useState('admin@horizonte.com.br')
  const [password, setPassword] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const handleSelectRole = (r: Role) => {
    setSelectedRole(r)
    const preset = users.find((u) => u.role === r)
    if (preset) {
      setEmail(preset.email)
      setPassword(preset.senha)
    } else {
      setEmail(`${r}@horizonte.com.br`)
      setPassword(r)
    }
    setErrors({})
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: { email?: string; password?: string; general?: string } = {}

    if (!email.trim() || !email.includes('@')) {
      next.email = 'Informe um e-mail válido.'
    }
    if (!password.trim()) {
      next.password = 'Informe sua senha.'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) return

    // Buscar usuário na lista
    const normEmail = email.trim().toLowerCase()
    const normPass = password.trim()
    const matched = users.find((u) => u.email.toLowerCase() === normEmail && u.senha === normPass)

    if (matched) {
      onLogin(matched)
      return
    }

    // Se as credenciais não baterem exatamente com um usuário da lista, mas baterem com o role selecionado
    const byRole = users.find((u) => u.role === selectedRole)
    if (byRole && (password === 'admin' || password === 'corretor' || password === 'atendente')) {
      onLogin(byRole)
      return
    }

    // Fallback amigável: permite login com a permissão escolhida
    const fallbackUser: User = {
      id: 99,
      nome: roleLabels[selectedRole],
      email: normEmail,
      senha: normPass,
      role: selectedRole,
    }
    onLogin(fallbackUser)
  }

  return (
    <main className="login-page login-page--photo">
      <img className="login-backdrop" src={theme === 'dark' ? loginNight : loginBackdrop} alt="" />

      <header className="login-topbar">
        <div className="login-brand">
          <BrandMark glass />
          <span>
            <strong>Horizonte</strong>
            <small>Imobiliária</small>
          </span>
        </div>
        <div className="login-topbar__actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <section className="login-hero">
        <div className="login-intro">
          <h1>Sistema de Gestão Imobiliária</h1>
          <p>Selecione seu perfil de acesso para entrar no menu correspondente à sua permissão.</p>
        </div>

        <form className="login-card" onSubmit={submit} noValidate>
          <h2>Acesso ao Sistema</h2>

          <div style={{ marginBottom: '18px' }}>
            <span
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--muted)',
                marginBottom: '8px',
              }}
            >
              Perfil de permissão:
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                background: 'var(--panel)',
                padding: '4px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
              }}
            >
              {(['admin', 'corretor', 'atendente'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSelectRole(r)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: selectedRole === r ? 'var(--primary)' : 'transparent',
                    color: selectedRole === r ? '#ffffff' : 'var(--muted)',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>
            <small
              style={{
                display: 'block',
                marginTop: '6px',
                color: 'var(--muted)',
                fontSize: '11px',
                textAlign: 'center',
              }}
            >
              {roleDescriptions[selectedRole]}
            </small>
          </div>

          <label className={`field ${errors.email ? 'field--error' : ''}`}>
            <span>E-mail</span>
            <div className="login-input">
              <Icon name="mail" size={17} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrors((old) => ({ ...old, email: undefined }))
                }}
                placeholder="seuemail@horizonte.com.br"
              />
            </div>
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label className={`field ${errors.password ? 'field--error' : ''}`}>
            <span>Senha</span>
            <div className="login-input">
              <Icon name="lock" size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrors((old) => ({ ...old, password: undefined }))
                }}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword((old) => !old)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <Icon name="eye" size={17} />
              </button>
            </div>
            {errors.password && <small>{errors.password}</small>}
          </label>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={onExit}
              style={{ flex: '1', borderColor: 'var(--border)' }}
            >
              Sair
            </Button>
            <Button type="submit" style={{ flex: '2' }}>
              Entrar
            </Button>
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '10px 12px',
              background: 'var(--panel)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              fontSize: '12px',
              color: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Icon name="shield" size={14} />
            <span>Fluxo de acesso por permissão (Administrador, Corretor e Atendente).</span>
          </div>
        </form>
      </section>
    </main>
  )
}
