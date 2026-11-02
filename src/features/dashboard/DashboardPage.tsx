import type { Page } from '@/app/navigation'
import panelBackdrop from '@/assets/painel-fundo.webp'
import panelNight from '@/assets/painel-noite.webp'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/features/clients/components/EmptyState'
import { interests } from '@/features/clients/model/interests'
import type { Client, Interest } from '@/features/clients/model/types'
import type { Theme } from '@/hooks/useTheme'
import { ClientSpotlight } from './components/ClientSpotlight'
import { InterestCard } from './components/InterestCard'
import { InterestDonut } from './components/InterestDonut'
import { RecentClients } from './components/RecentClients'
import { summarize } from './summary'

type DashboardPageProps = {
  clients: Client[]
  theme: Theme
  go: (p: Page) => void
  openClients: (filter: Interest | null) => void
  view: (c: Client) => void
  edit: (c: Client) => void
  remove: (c: Client) => void
}

export function DashboardPage({
  clients,
  theme,
  go,
  openClients,
  view,
  edit,
  remove,
}: DashboardPageProps) {
  return (
    <>
      <section className="dash-hero">
        <img
          className="dash-hero__photo"
          src={theme === 'dark' ? panelNight : panelBackdrop}
          alt=""
        />
        <div className="dash-hero__content">
          <h1>Olá, Camila</h1>
          <p>{summarize(clients)}</p>
          <Button icon="plus" onClick={() => go('atendente-cadastrar')}>
            Cadastrar cliente
          </Button>
        </div>
      </section>
      {clients.length ? (
        <div className="bento">
          <InterestDonut clients={clients} openClients={openClients} />
          <section className="interest-cards" aria-label="Clientes por interesse">
            {interests.map((interest) => (
              <InterestCard
                key={interest}
                interest={interest}
                group={clients.filter((c) => c.interesse === interest)}
                total={clients.length}
                onOpen={() => openClients(interest)}
              />
            ))}
          </section>
          <ClientSpotlight clients={clients} view={view} edit={edit} remove={remove} />
          <RecentClients clients={clients} view={view} go={go} />
        </div>
      ) : (
        <section className="card">
          <EmptyState search={false} onNew={() => go('atendente-cadastrar')} />
        </section>
      )}
    </>
  )
}
