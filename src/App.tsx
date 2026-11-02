import { useRef, useState } from 'react'
import type { Page } from './app/navigation'
import { GroundArt } from './components/illustrations/GroundArt'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { Toast } from './components/ui/Toast'
import { LoadingScreen } from './features/auth/LoadingScreen'
import { LoginPage } from './features/auth/LoginPage'
import { useDemoSession } from './features/auth/useDemoSession'
import { DeleteClientModal } from './features/clients/components/DeleteClientModal'
import type { Client, ClientData, Interest } from './features/clients/model/types'
import { ClientDetailsPage } from './features/clients/pages/ClientDetailsPage'
import { ClientFormPage } from './features/clients/pages/ClientFormPage'
import { ClientsPage } from './features/clients/pages/ClientsPage'
import { useClients } from './features/clients/useClients'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { useSidebarPreference } from './hooks/useSidebarPreference'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'

export default function App() {
  const { authenticated, loading, startSession, endSession } = useDemoSession()
  const { clients, selected, selectClient, createClient, updateClient, removeClient } = useClients()
  const { theme, toggleTheme } = useTheme()
  const { collapsed, toggleCollapsed } = useSidebarPreference()
  const { toast, notify } = useToast()
  const [page, setPage] = useState<Page>('dashboard')
  const [deleting, setDeleting] = useState<Client | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [interestFilter, setInterestFilter] = useState<Interest | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  // As telas compartilham a busca, mas cada navegação começa sem filtro de interesse.
  const go = (next: Page) => {
    setPage(next)
    setInterestFilter(null)
    pageRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openClients = (filter: Interest | null) => {
    go('clients')
    setInterestFilter(filter)
  }

  const view = (client: Client) => {
    selectClient(client)
    go('details')
  }

  const edit = (client: Client) => {
    selectClient(client)
    go('edit')
  }

  const saveNew = (data: ClientData) => {
    createClient(data)
    go('clients')
    notify('Cliente cadastrado com sucesso.')
  }

  const saveEdit = (data: ClientData) => {
    if (!selected) return
    updateClient(selected.id, data)
    go('details')
    notify('Dados atualizados com sucesso.')
  }

  const confirmDelete = () => {
    if (!deleting) return
    removeClient(deleting.id)
    setDeleting(null)
    go('clients')
    notify('Cliente excluído com sucesso.')
  }

  const search = (value: string) => {
    setQuery(value)
    if (value && page !== 'clients') go('clients')
  }

  const logout = () => {
    endSession()
    setMenuOpen(false)
    setQuery('')
    go('dashboard')
  }

  if (loading) return <LoadingScreen />
  if (!authenticated)
    return <LoginPage onLogin={startSession} theme={theme} onToggleTheme={toggleTheme} />

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      <GroundArt />
      <Sidebar
        page={page}
        filter={interestFilter}
        go={go}
        openClients={openClients}
        open={menuOpen}
        close={() => setMenuOpen(false)}
        logout={logout}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
        notify={notify}
      />
      <main className="main-content">
        <Topbar
          page={page}
          query={query}
          onSearch={search}
          openMenu={() => setMenuOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <div className="page" ref={pageRef}>
          {page === 'dashboard' && (
            <DashboardPage
              clients={clients}
              theme={theme}
              go={go}
              openClients={openClients}
              view={view}
              edit={edit}
              remove={setDeleting}
            />
          )}
          {page === 'clients' && (
            <ClientsPage
              clients={clients}
              query={query}
              setQuery={setQuery}
              filter={interestFilter}
              setFilter={setInterestFilter}
              go={go}
              view={view}
              edit={edit}
              remove={setDeleting}
            />
          )}
          {page === 'new' && (
            <ClientFormPage key="new" onSave={saveNew} onCancel={() => go('clients')} />
          )}
          {page === 'edit' && selected && (
            <ClientFormPage
              key={selected.id}
              client={selected}
              onSave={saveEdit}
              onCancel={() => go('details')}
            />
          )}
          {page === 'details' && selected && (
            <ClientDetailsPage
              client={selected}
              onBack={() => go('clients')}
              onEdit={() => go('edit')}
              onDelete={() => setDeleting(selected)}
            />
          )}
          <footer className="app-footer">
            Imobiliária Horizonte · Protótipo acadêmico com dados simulados no frontend
          </footer>
        </div>
      </main>
      {deleting && (
        <DeleteClientModal
          client={deleting}
          close={() => setDeleting(null)}
          confirm={confirmDelete}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  )
}
