import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Property } from '../model/types'

type PropertyDeletePageProps = {
  properties: Property[]
  onDeleteProperty: (id: number) => void
  onGoToConsultar: () => void
}

export function PropertyDeletePage({
  properties,
  onDeleteProperty,
  onGoToConsultar,
}: PropertyDeletePageProps) {
  const [selectedForDeletion, setSelectedForDeletion] = useState<Property | null>(null)

  const handleConfirm = () => {
    if (!selectedForDeletion) return
    onDeleteProperty(selectedForDeletion.id)
    setSelectedForDeletion(null)
  }

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

  return (
    <>
      <PageHeader
        title="Excluir imóvel"
        description="Remova imóveis desativados ou negociados do portfólio da imobiliária."
        action={
          <Button variant="secondary" onClick={onGoToConsultar}>
            Voltar para consulta
          </Button>
        }
      />

      <section className="card table-card">
        <div className="table-toolbar">
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Total de <strong>{properties.length}</strong>{' '}
            {properties.length === 1 ? 'imóvel no catálogo' : 'imóveis no catálogo'}
          </p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Imóvel</th>
                <th>Tipo / Finalidade</th>
                <th>Localização</th>
                <th>Valor</th>
                <th style={{ textAlign: 'right' }}>Ação de Exclusão</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id}>
                  <td className="id-cell">
                    <strong>{p.codigo}</strong>
                  </td>
                  <td>
                    <strong>{p.titulo}</strong>
                  </td>
                  <td>
                    {p.tipo} · {p.finalidade}
                  </td>
                  <td>
                    {p.bairro}, {p.cidade}
                  </td>
                  <td>
                    <strong>{formatCurrency(p.valor)}</strong>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="button button--danger"
                      style={{ minHeight: '32px', padding: '0 14px', fontSize: '12px', gap: '6px' }}
                      onClick={() => setSelectedForDeletion(p)}
                    >
                      <Icon name="trash" size={13} />
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedForDeletion && (
        <div className="modal-backdrop" onClick={() => setSelectedForDeletion(null)}>
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', padding: '28px' }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="trash" size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--heading)' }}>
                  Confirmar exclusão
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                  {selectedForDeletion.codigo}
                </p>
              </div>
            </div>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--text)',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              Tem certeza que deseja remover o imóvel <strong>{selectedForDeletion.titulo}</strong>{' '}
              do catálogo?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="secondary" onClick={() => setSelectedForDeletion(null)}>
                Cancelar
              </Button>
              <Button variant="danger" icon="trash" onClick={handleConfirm}>
                Sim, excluir imóvel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
