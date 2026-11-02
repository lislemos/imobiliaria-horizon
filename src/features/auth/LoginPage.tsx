import loginBackdrop from '@/assets/login-fundo.webp'
import loginNight from '@/assets/login-noite.webp'
import { BrandMark } from '@/components/brand/BrandMark'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { Theme } from '@/hooks/useTheme'
import { useState, type FormEvent } from 'react'

type LoginPageProps = {
  onLogin: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function LoginPage({ onLogin, theme, onToggleTheme }: LoginPageProps) {
  const [email, setEmail] = useState('camila@horizonte.com.br')
  const [password, setPassword] = useState('horizonte')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: { email?: string; password?: string } = {}
    if (!email.trim() || !email.includes('@')) next.email = 'Informe um e-mail válido.'
    if (!password.trim()) next.password = 'Informe sua senha.'
    setErrors(next)
    if (!Object.keys(next).length) onLogin()
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
          <span className="login-topbar__pill">Ambiente de demonstração</span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>
      <section className="login-hero">
        <div className="login-intro">
          <h1>Do primeiro contato à chave na mão.</h1>
          <p>Clientes e interesses de compra, venda e aluguel organizados em um só lugar.</p>
        </div>
        <form className="login-card" onSubmit={submit} noValidate>
          <h2>Entrar na área administrativa</h2>
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
                autoFocus
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
          <div className="login-options">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>
                <Icon name="check" size={12} />
              </span>
              Manter acesso
            </label>
            <button
              type="button"
              className="text-button"
              onClick={() => alert('Nesta demonstração, use as credenciais já preenchidas.')}
            >
              Esqueci minha senha
            </button>
          </div>
          <Button type="submit">Entrar na plataforma</Button>
          <p className="login-card__note">
            <Icon name="shield" size={16} />
            <span>
              Simulação visual com dados fictícios: não há autenticação real, API ou envio de
              credenciais.
            </span>
          </p>
        </form>
      </section>
    </main>
  )
}
