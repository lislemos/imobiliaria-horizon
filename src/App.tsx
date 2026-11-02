import { useRef, useState } from 'react'
import type { Page } from './app/navigation'
import { GroundArt } from './components/illustrations/GroundArt'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { Toast } from './components/ui/Toast'
import { ClosedAppScreen } from './features/auth/ClosedAppScreen'
import { LoginPage } from './features/auth/LoginPage'
import type { Role, User } from './features/auth/types'
import { roleLabels } from './features/auth/types'
import { AtendenteAtualizarPage } from './features/clients/pages/AtendenteAtualizarPage'
import { AtendenteBuscarPage } from './features/clients/pages/AtendenteBuscarPage'
import { AtendenteCadastrarPage } from './features/clients/pages/AtendenteCadastrarPage'
import { AtendenteExcluirPage } from './features/clients/pages/AtendenteExcluirPage'
import { AtendenteListarPage } from './features/clients/pages/AtendenteListarPage'
import { useClients } from './features/clients/useClients'
import { PropertyDeletePage } from './features/properties/pages/PropertyDeletePage'
import { PropertyFormPage } from './features/properties/pages/PropertyFormPage'
import { PropertyListPage } from './features/properties/pages/PropertyListPage'
import { useProperties } from './features/properties/useProperties'
import { UserDeletePage } from './features/users/pages/UserDeletePage'
import { UserFormPage } from './features/users/pages/UserFormPage'
import { UserListPage } from './features/users/pages/UserListPage'
import { useUsers } from './features/users/useUsers'
import { useSidebarPreference } from './hooks/useSidebarPreference'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'

const defaultPageForRole: Record<Role, Page> = {
  admin: 'admin-consultar',
  corretor: 'corretor-consultar',
  atendente: 'atendente-listar',
}

export default function App() {
  const { users, createUser, deleteUser } = useUsers()
  const { properties, createProperty, deleteProperty } = useProperties()
  const { clients, selected, selectClient, createClient, updateClient, removeClient } = useClients()

  const { theme, toggleTheme } = useTheme()
  const { collapsed, toggleCollapsed } = useSidebarPreference()
  const { toast, notify } = useToast()

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAppClosed, setIsAppClosed] = useState(false)
  const [page, setPage] = useState<Page>('admin-consultar')
  const [menuOpen, setMenuOpen] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null)

  const go = (next: Page) => {
    setPage(next)
    pageRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    const initialPage = defaultPageForRole[user.role]
    setPage(initialPage)
    notify(`Bem-vindo, ${user.nome}! Acesso como ${roleLabels[user.role]}.`)
  }

  const handleLogoff = () => {
    setCurrentUser(null)
    setMenuOpen(false)
    selectClient(null)
    notify('Logoff realizado com sucesso.')
  }

  const handleCloseApp = () => {
    setCurrentUser(null)
    setIsAppClosed(true)
  }

  const handleRestartApp = () => {
    setIsAppClosed(false)
  }

  // 1. Programa Encerrado (Sair)
  if (isAppClosed) {
    return <ClosedAppScreen onRestart={handleRestartApp} />
  }

  // 2. Tela de Login
  if (!currentUser) {
    return (
      <LoginPage
        users={users}
        onLogin={handleLogin}
        onExit={handleCloseApp}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      <GroundArt />

      <Sidebar
        user={currentUser}
        page={page}
        go={go}
        open={menuOpen}
        close={() => setMenuOpen(false)}
        logout={handleLogoff}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />

      <main className="main-content">
        <Topbar
          user={currentUser}
          page={page}
          openMenu={() => setMenuOpen(true)}
          onLogoff={handleLogoff}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <div className="page" ref={pageRef}>
          {/* MENU ADMINISTRADOR */}
          {currentUser.role === 'admin' && (
            <>
              {page === 'admin-cadastrar' && (
                <UserFormPage
                  onSave={(data) => {
                    const res = createUser(data)
                    if (res.success) {
                      notify('Usuário cadastrado com sucesso!')
                    }
                    return res
                  }}
                  onGoToConsultar={() => go('admin-consultar')}
                />
              )}
              {page === 'admin-consultar' && (
                <UserListPage
                  users={users}
                  onGoToCadastrar={() => go('admin-cadastrar')}
                  onGoToExcluir={() => go('admin-excluir')}
                />
              )}
              {page === 'admin-excluir' && (
                <UserDeletePage
                  users={users}
                  currentUserId={currentUser.id}
                  onDeleteUser={(id) => {
                    deleteUser(id)
                    notify('Usuário excluído com sucesso.')
                  }}
                  onGoToConsultar={() => go('admin-consultar')}
                />
              )}
            </>
          )}

          {/* MENU CORRETOR */}
          {currentUser.role === 'corretor' && (
            <>
              {page === 'corretor-cadastrar' && (
                <PropertyFormPage
                  onSave={(data) => {
                    createProperty(data)
                    notify('Imóvel cadastrado no catálogo com sucesso!')
                  }}
                  onGoToConsultar={() => go('corretor-consultar')}
                />
              )}
              {page === 'corretor-consultar' && (
                <PropertyListPage
                  properties={properties}
                  onGoToCadastrar={() => go('corretor-cadastrar')}
                  onGoToExcluir={() => go('corretor-excluir')}
                />
              )}
              {page === 'corretor-excluir' && (
                <PropertyDeletePage
                  properties={properties}
                  onDeleteProperty={(id) => {
                    deleteProperty(id)
                    notify('Imóvel excluído do catálogo.')
                  }}
                  onGoToConsultar={() => go('corretor-consultar')}
                />
              )}
            </>
          )}

          {/* MENU ATENDENTE */}
          {currentUser.role === 'atendente' && (
            <>
              {page === 'atendente-cadastrar' && (
                <AtendenteCadastrarPage
                  onSave={(data) => {
                    createClient(data)
                    notify('Cliente cadastrado com sucesso!')
                    go('atendente-listar')
                  }}
                  onCancel={() => go('atendente-listar')}
                />
              )}
              {page === 'atendente-listar' && (
                <AtendenteListarPage
                  clients={clients}
                  onGoToCadastrar={() => go('atendente-cadastrar')}
                  onSelectClientForEdit={(c) => {
                    selectClient(c)
                    go('atendente-atualizar')
                  }}
                  onSelectClientForDelete={() => go('atendente-excluir')}
                />
              )}
              {page === 'atendente-buscar' && (
                <AtendenteBuscarPage
                  clients={clients}
                  onGoToCadastrar={() => go('atendente-cadastrar')}
                  onSelectClientForEdit={(c) => {
                    selectClient(c)
                    go('atendente-atualizar')
                  }}
                  onSelectClientForDelete={() => go('atendente-excluir')}
                />
              )}
              {page === 'atendente-atualizar' && (
                <AtendenteAtualizarPage
                  clients={clients}
                  selectedClient={selected}
                  onSelectClient={selectClient}
                  onUpdateClient={(id, data) => {
                    updateClient(id, data)
                    notify('Dados do cliente atualizados com sucesso!')
                  }}
                  onGoToCadastrar={() => go('atendente-cadastrar')}
                />
              )}
              {page === 'atendente-excluir' && (
                <AtendenteExcluirPage
                  clients={clients}
                  onDeleteClient={(id) => {
                    removeClient(id)
                    notify('Cliente excluído com sucesso.')
                  }}
                  onGoToListar={() => go('atendente-listar')}
                />
              )}
            </>
          )}

          <footer className="app-footer">
            Imobiliária Horizonte · Sistema de Gestão Imobiliária (Frontend)
          </footer>
        </div>
      </main>

      {toast && <Toast message={toast} />}
    </div>
  )
}
