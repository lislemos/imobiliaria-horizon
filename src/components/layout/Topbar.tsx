import { pageTitle, type Page } from '@/app/navigation'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { User } from '@/features/auth/types'
import { roleLabels } from '@/features/auth/types'
import type { Theme } from '@/hooks/useTheme'

type TopbarProps = {
  user: User
  page: Page
  openMenu: () => void
  onLogoff: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function Topbar({ user, page, openMenu, onLogoff, theme, onToggleTheme }: TopbarProps) {
  const [title, section] = pageTitle[page] ?? ['Início', 'Menu']

  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={openMenu} aria-label="Abrir menu">
        <Icon name="menu" />
      </button>

      <p className="topbar__title">
        <strong>{title}</strong>
        <span>{section}</span>
      </p>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          className={`role-badge role-badge--${user.role}`}
          style={{
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Icon
            name={
              user.role === 'admin' ? 'shield' : user.role === 'corretor' ? 'building' : 'users'
            }
            size={12}
          />
          {roleLabels[user.role]}: {user.nome}
        </span>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <Button
          variant="secondary"
          onClick={onLogoff}
          style={{ minHeight: '34px', padding: '0 12px', fontSize: '12px', gap: '6px' }}
          title="Fazer logoff e voltar para a tela de login"
        >
          <Icon name="logout" size={13} />
          Logoff
        </Button>
      </div>
    </header>
  )
}
