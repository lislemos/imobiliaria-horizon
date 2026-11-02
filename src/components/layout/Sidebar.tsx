import type { Page } from '@/app/navigation'
import { BrandMark } from '@/components/brand/BrandMark'
import { Avatar } from '@/components/ui/Avatar'
import type { IconName } from '@/components/ui/Icon'
import { Icon } from '@/components/ui/Icon'
import type { User } from '@/features/auth/types'
import { roleLabels } from '@/features/auth/types'

type MenuItem = {
  id: Page
  label: string
  icon: IconName
}

type SidebarProps = {
  user: User
  page: Page
  go: (page: Page) => void
  open: boolean
  close: () => void
  logout: () => void
  collapsed: boolean
  toggleCollapsed: () => void
}

export function Sidebar({
  user,
  page,
  go,
  open,
  close,
  logout,
  collapsed,
  toggleCollapsed,
}: SidebarProps) {
  // Definição estrita dos itens de menu conforme a permissão solicitada
  const menuConfig: Record<User['role'], { title: string; items: MenuItem[] }> = {
    admin: {
      title: 'MENU ADMINISTRADOR',
      items: [
        { id: 'admin-cadastrar', label: 'Cadastrar usuário', icon: 'plus' },
        { id: 'admin-consultar', label: 'Consultar usuário', icon: 'search' },
        { id: 'admin-excluir', label: 'Excluir usuário', icon: 'trash' },
      ],
    },
    corretor: {
      title: 'MENU CORRETOR',
      items: [
        { id: 'corretor-cadastrar', label: 'Cadastrar imóvel', icon: 'plus' },
        { id: 'corretor-consultar', label: 'Consultar imóvel', icon: 'building' },
        { id: 'corretor-excluir', label: 'Excluir imóvel', icon: 'trash' },
      ],
    },
    atendente: {
      title: 'MENU ATENDENTE',
      items: [
        { id: 'atendente-cadastrar', label: 'Cadastrar cliente', icon: 'plus' },
        { id: 'atendente-listar', label: 'Listar clientes', icon: 'users' },
        { id: 'atendente-buscar', label: 'Buscar cliente', icon: 'search' },
        { id: 'atendente-atualizar', label: 'Atualizar cliente', icon: 'edit' },
        { id: 'atendente-excluir', label: 'Excluir cliente', icon: 'trash' },
      ],
    },
  }

  const currentMenu = menuConfig[user.role]

  const handleNavigate = (targetPage: Page) => {
    go(targetPage)
    close()
  }

  return (
    <>
      {open && <div className="side-overlay" onClick={close} />}

      <aside className={`side ${open ? 'side--open' : ''}`}>
        <div className="side-brand">
          <div className="brand-lockup">
            <BrandMark />
            <span className="brand-text">
              <strong>Horizonte</strong>
              <small>Imobiliária</small>
            </span>
          </div>
          <button
            type="button"
            className="side-toggle"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <Icon name="chevron" size={16} />
          </button>
        </div>

        <div className="side-role-badge">
          <span className={`role-badge role-badge--${user.role}`}>
            <Icon
              name={
                user.role === 'admin' ? 'shield' : user.role === 'corretor' ? 'building' : 'users'
              }
              size={13}
            />
            {roleLabels[user.role]}
          </span>
        </div>

        <nav className="side-nav">
          <div className="nav-grp">
            <span className="lab">{currentMenu.title}</span>

            {currentMenu.items.map((item) => {
              const active = page === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-leaf ${active ? 'nav-leaf--active' : ''}`}
                  onClick={() => handleNavigate(item.id)}
                  title={item.label}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          <div
            className="nav-grp"
            style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}
          >
            <button
              type="button"
              className="nav-leaf nav-leaf--logout"
              onClick={logout}
              title="Logoff"
              style={{ color: '#ef4444' }}
            >
              <Icon name="logout" size={16} />
              <span>Logoff</span>
            </button>
          </div>
        </nav>

        <div className="side-foot">
          <div className="user-menu">
            <div className="user-i" style={{ cursor: 'default' }}>
              <Avatar name={user.nome} />
              <span className="who">
                <b>{user.nome}</b>
                <span>{roleLabels[user.role]}</span>
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
