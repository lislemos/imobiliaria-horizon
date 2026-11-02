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
  const menuConfig: Record<User['role'], { title: string; items: MenuItem[] }> = {
    admin: {
      title: 'Menu Administrador',
      items: [
        { id: 'admin-cadastrar', label: 'Cadastrar usuário', icon: 'plus' },
        { id: 'admin-consultar', label: 'Consultar usuário', icon: 'search' },
        { id: 'admin-excluir', label: 'Excluir usuário', icon: 'trash' },
      ],
    },
    corretor: {
      title: 'Menu Corretor',
      items: [
        { id: 'corretor-cadastrar', label: 'Cadastrar imóvel', icon: 'plus' },
        { id: 'corretor-consultar', label: 'Consultar imóvel', icon: 'building' },
        { id: 'corretor-excluir', label: 'Excluir imóvel', icon: 'trash' },
      ],
    },
    atendente: {
      title: 'Menu Atendente',
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

  const pick = (targetPage: Page) => () => {
    go(targetPage)
    close()
  }

  return (
    <>
      {open && <button className="sidebar-scrim" onClick={close} aria-label="Fechar menu" />}

      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="side-top">
          <button
            type="button"
            className="side-mark"
            onClick={pick(currentMenu.items[0].id)}
            aria-label="Horizonte Imobiliária"
          >
            <BrandMark />
            <b>Horizonte</b>
          </button>
          <div className="side-city">
            <span aria-hidden="true" />
            <span>{roleLabels[user.role]}</span>
          </div>
          <button className="icon-button sidebar-close" onClick={close} aria-label="Fechar menu">
            <Icon name="close" />
          </button>
        </div>

        <nav className="side-nav" aria-label={currentMenu.title}>
          <div className="nav-grp">
            <span className="lab">{currentMenu.title}</span>

            {currentMenu.items.map((item) => {
              const isCurrent = page === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className="nav-i"
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={item.label}
                  onClick={pick(item.id)}
                  title={item.label}
                >
                  <Icon name={item.icon} size={16} />
                  <span className="tx">{item.label}</span>
                </button>
              )
            })}
          </div>

          <div className="nav-grp" style={{ marginTop: 'auto', paddingTop: '12px' }}>
            <button
              type="button"
              className="nav-i"
              aria-label="Logoff"
              onClick={logout}
              title="Logoff"
              style={{ color: '#ef4444' }}
            >
              <Icon name="logout" size={16} />
              <span className="tx">Logoff</span>
            </button>
          </div>
        </nav>

        <div className="side-foot">
          <div className="user-menu">
            <div className="user-i" title={`${user.nome} — ${roleLabels[user.role]}`}>
              <Avatar name={user.nome} />
              <span className="who">
                <b>{user.nome}</b>
                <span>{roleLabels[user.role]}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="side-toggle"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <Icon name="arrow" size={13} />
        </button>
      </aside>
    </>
  )
}
