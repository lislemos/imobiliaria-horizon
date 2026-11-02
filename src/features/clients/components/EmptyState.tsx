import { CloudBank } from '@/components/illustrations/CloudBank'
import { palette as hz } from '@/components/illustrations/palette'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

type EmptyStateProps = {
  search: boolean
  onNew: () => void
  onClear?: () => void
}

export function EmptyState({ search, onNew, onClear }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__art">
        <svg viewBox="0 0 150 90" aria-hidden="true">
          <CloudBank
            id="empty-cloud"
            base={hz.mistDeep}
            light={hz.mist}
            puffs={[
              [40, 58, 26],
              [75, 42, 36],
              [112, 56, 28],
              [92, 66, 22],
              [58, 68, 20],
            ]}
          />
        </svg>
        <span>
          <Icon name={search ? 'search' : 'users'} size={22} />
        </span>
      </div>
      <h3>{search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}</h3>
      <p>
        {search
          ? 'Tente ajustar o nome ou telefone pesquisado.'
          : 'Comece cadastrando seu primeiro cliente.'}
      </p>
      {search ? (
        <Button variant="secondary" icon="close" onClick={onClear}>
          Limpar busca
        </Button>
      ) : (
        <Button icon="plus" onClick={onNew}>
          Cadastrar cliente
        </Button>
      )}
    </div>
  )
}
