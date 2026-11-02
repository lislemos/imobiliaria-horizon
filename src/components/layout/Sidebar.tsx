import type { Page } from '@/app/navigation'
import { BrandMark } from '@/components/brand/BrandMark'
import { Avatar } from '@/components/ui/Avatar'
import type { IconName } from '@/components/ui/Icon'
import { Icon } from '@/components/ui/Icon'
import { interestGroup, interests } from '@/features/clients/model/interests'
import type { Interest } from '@/features/clients/model/types'
import { useEffect, useRef, useState } from 'react'
import { useNavigationIndicator } from './hooks/useNavigationIndicator'
import { useSidebarFlyout, type NavigationItem } from './hooks/useSidebarFlyout'

const clientPages: Page[] = ['clients', 'details', 'edit']

type SidebarProps = {
  page: Page
  filter: Interest | null
  go: (page: Page) => void
  openClients: (filter: Interest | null) => void
  open: boolean
  close: () => void
  logout: () => void
  collapsed: boolean
  toggleCollapsed: () => void
  notify: (message: string) => void
}

export function Sidebar({
  page,
  filter,
  go,
  openClients,
  open,
  close,
  logout,
  collapsed,
  toggleCollapsed,
  notify,
}: SidebarProps) {
  const [drawer, setDrawer] = useState<string | null>(clientPages.includes(page) ? 'clients' : null)
  const [userOpen, setUserOpen] = useState(false)
  const userRef = useRef<HTMLDivElement>(null)
  const userButton = useRef<HTMLButtonElement>(null)

  const { navRef, pillRef, pillFollow, pillRest } = useNavigationIndicator({
    page,
    filter,
    drawer,
    collapsed,
  })
  const {
    sideRef,
    flyRef,
    fly,
    flyShown,
    isRail,
    showFly,
    hideFly,
    dismissFly,
    railLeave,
    leaveSidebar,
    keepFlyOpen,
  } = useSidebarFlyout(collapsed)

  useEffect(() => {
    if (!userOpen) return
    const outside = (event: MouseEvent) => {
      if (!userRef.current?.contains(event.target as Node)) setUserOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserOpen(false)
        userButton.current?.focus()
      }
    }
    document.addEventListener('click', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('click', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [userOpen])

  const toggleDrawer = (key: string) => {
    setUserOpen(false)
    setDrawer((old) => (old === key ? null : key))
  }
  const pick = (select: () => void) => () => {
    select()
    close()
  }
  const soon = (label: string) => () => notify(`${label} chega em breve.`)
  const leaf = (label: string, icon: IconName, current: boolean, select: () => void) => (
    <button
      className="nav-i"
      aria-current={current ? 'page' : undefined}
      aria-label={label}
      onClick={select}
      onMouseEnter={(e) => showFly(e.currentTarget, label)}
      onMouseLeave={railLeave}
    >
      <Icon name={icon} size={16} />
      <span className="tx">{label}</span>
    </button>
  )
  const clientSubs: NavigationItem[] = [
    {
      label: 'Todos os clientes',
      current: page === 'clients' && !filter,
      select: () => openClients(null),
    },
    ...interests.map((interest) => ({
      label: interestGroup[interest],
      current: page === 'clients' && filter === interest,
      select: () => openClients(interest),
    })),
  ]
  const clientsOpen = drawer === 'clients'

  return (
    <>
      {open && <button className="sidebar-scrim" onClick={close} aria-label="Fechar menu" />}
      <aside
        ref={sideRef}
        className={`sidebar ${open ? 'sidebar--open' : ''}`}
        onMouseLeave={leaveSidebar}
      >
        <div className="side-top">
          <button
            className="side-mark"
            onClick={pick(() => go('dashboard'))}
            aria-label="Horizonte — ir para a visão geral"
            title="Ir para a visão geral"
          >
            <BrandMark />
            <b>Horizonte</b>
          </button>
          <div className="side-city">
            <span aria-hidden="true" />
            <span>Ambiente de demonstração</span>
          </div>
          <button className="icon-button sidebar-close" onClick={close} aria-label="Fechar menu">
            <Icon name="close" />
          </button>
        </div>

        <nav
          ref={navRef}
          className="side-nav"
          aria-label="Principal"
          onMouseOver={pillFollow}
          onMouseLeave={pillRest}
        >
          <div ref={pillRef} className="nav-pill" aria-hidden="true" />
          <div className="nav-grp">
            <span className="lab">Principal</span>
            {leaf(
              'Visão geral',
              'grid',
              page === 'dashboard',
              pick(() => go('dashboard')),
            )}
            <div className="nav-drawer" data-open={clientsOpen}>
              <button
                className="nav-drawer-toggle"
                aria-expanded={clientsOpen}
                aria-current={clientPages.includes(page) ? 'page' : undefined}
                aria-label="Clientes"
                onClick={() => {
                  openClients(null)
                  if (!isRail()) toggleDrawer('clients')
                }}
                onMouseEnter={(e) => showFly(e.currentTarget, 'Clientes', clientSubs)}
                onMouseLeave={railLeave}
              >
                <Icon name="users" size={16} />
                <span className="tx">Clientes</span>
                <span className="chev">
                  <Icon name="chevron" size={14} />
                </span>
              </button>
              <div className="nav-drawer-body">
                <div className="nav-drawer-inner">
                  {clientSubs.map((sub) => (
                    <button
                      key={sub.label}
                      className="nav-sub-i"
                      aria-current={sub.current ? 'page' : undefined}
                      onClick={pick(sub.select)}
                    >
                      <span className="dot" />
                      <span className="tx">{sub.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {leaf(
              'Cadastrar cliente',
              'plus',
              page === 'new',
              pick(() => go('new')),
            )}
          </div>
          <div className="nav-grp">
            <span className="lab">Em breve</span>
            {leaf('Imóveis', 'building', false, soon('Imóveis'))}
            {leaf('Usuários', 'shield', false, soon('Usuários'))}
            {leaf('Relatórios', 'chart', false, soon('Relatórios'))}
            {leaf('Configurações', 'settings', false, soon('Configurações'))}
          </div>
        </nav>

        <div className="side-foot">
          <div className="user-menu" ref={userRef}>
            <button
              ref={userButton}
              className="user-i"
              aria-haspopup="menu"
              aria-expanded={userOpen}
              title="Camila Rocha — Administradora"
              onClick={() => {
                if (!userOpen) setDrawer(null)
                setUserOpen(!userOpen)
              }}
            >
              <Avatar name="Camila Rocha" />
              <span className="who">
                <b>Camila Rocha</b>
                <span>Administradora</span>
              </span>
            </button>
            {userOpen && (
              <div className="user-pop" role="menu">
                <button className="user-pop-i" role="menuitem" onClick={logout}>
                  <Icon name="logout" size={16} />
                  Sair
                </button>
                <button
                  className="user-pop-i"
                  role="menuitem"
                  onClick={() => {
                    setUserOpen(false)
                    notify('Meu perfil chega em breve.')
                  }}
                >
                  <Icon name="user" size={16} />
                  Meu perfil
                </button>
                <button
                  className="user-pop-i"
                  role="menuitem"
                  onClick={() => {
                    setUserOpen(false)
                    notify('Preferências chegam em breve.')
                  }}
                >
                  <Icon name="settings" size={16} />
                  Preferências
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="side-toggle"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <Icon name="arrow" size={13} />
        </button>

        {fly && (
          <div
            ref={flyRef}
            className={`${fly.subs ? 'rail-flyout' : 'rail-tooltip'} ${
              flyShown ? 'rf-visible' : ''
            }`}
            role={fly.subs ? 'menu' : 'tooltip'}
            onMouseEnter={keepFlyOpen}
            onMouseLeave={dismissFly}
          >
            {fly.subs ? (
              <>
                <div className="rf-hdr">{fly.label}</div>
                {fly.subs.map((sub) => (
                  <button
                    key={sub.label}
                    className="rf-item"
                    role="menuitem"
                    aria-current={sub.current ? 'page' : undefined}
                    onClick={() => {
                      sub.select()
                      hideFly()
                    }}
                  >
                    <span className="rf-dot" />
                    <span>{sub.label}</span>
                  </button>
                ))}
              </>
            ) : (
              fly.label
            )}
          </div>
        )}
      </aside>
    </>
  )
}
