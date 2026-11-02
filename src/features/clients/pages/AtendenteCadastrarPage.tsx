import { PageHeader } from '@/components/ui/PageHeader'
import { ClientForm } from '../components/ClientForm'
import type { ClientData } from '../model/types'

type AtendenteCadastrarPageProps = {
  onSave: (data: ClientData) => void
  onCancel: () => void
}

export function AtendenteCadastrarPage({ onSave, onCancel }: AtendenteCadastrarPageProps) {
  return (
    <>
      <PageHeader
        title="Cadastrar cliente"
        description="Registre um novo cliente e seu respectivo interesse (compra, venda ou aluguel)."
      />
      <section className="card form-card">
        <ClientForm onSave={onSave} onCancel={onCancel} />
      </section>
    </>
  )
}
