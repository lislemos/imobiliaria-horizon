import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Property, PropertyGoal, PropertyType } from '../model/types'
import { propertyGoals, propertyTypes } from '../model/types'

type PropertyListPageProps = {
  properties: Property[]
  onGoToCadastrar: () => void
  onGoToExcluir: () => void
}

export function PropertyListPage({
  properties,
  onGoToCadastrar,
  onGoToExcluir,
}: PropertyListPageProps) {
  const [query, setQuery] = useState('')
  const [goalFilter, setGoalFilter] = useState<PropertyGoal | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return properties.filter((p) => {
      const matchQuery =
        !q ||
        p.titulo.toLowerCase().includes(q) ||
        p.codigo.toLowerCase().includes(q) ||
        p.bairro.toLowerCase().includes(q) ||
        p.cidade.toLowerCase().includes(q)
      const matchGoal = goalFilter === 'all' || p.finalidade === goalFilter
      const matchType = typeFilter === 'all' || p.tipo === typeFilter
      return matchQuery && matchGoal && matchType
    })
  }, [properties, query, goalFilter, typeFilter])

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

  return (
    <>
      <PageHeader
        title="Consultar imóvel"
        description="Pesquise e consulte o catálogo de imóveis disponíveis para venda e locação."
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={onGoToExcluir}>
              Excluir imóveis
            </Button>
            <Button icon="plus" onClick={onGoToCadastrar}>
              Novo imóvel
            </Button>
          </div>
        }
      />

      <section className="card table-card">
        <div className="table-toolbar" style={{ flexWrap: 'wrap', gap: '14px' }}>
          <div className="search-box" style={{ maxWidth: '340px', width: '100%' }}>
            <div
              className="login-input"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                padding: '0 14px',
                height: '40px',
              }}
            >
              <Icon name="search" size={16} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por código, bairro ou título..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '13px',
                  color: 'var(--heading)',
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    display: 'flex',
                  }}
                >
                  <Icon name="close" size={14} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value as PropertyGoal | 'all')}
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                color: 'var(--heading)',
              }}
            >
              <option value="all">Todas finalidades</option>
              {propertyGoals.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as PropertyType | 'all')}
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                color: 'var(--heading)',
              }}
            >
              <option value="all">Todos os tipos</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <p style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--muted)' }}>
            <strong>{filtered.length}</strong>{' '}
            {filtered.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Imóvel</th>
                  <th>Tipo</th>
                  <th>Finalidade</th>
                  <th>Localização</th>
                  <th>Área</th>
                  <th>Valor</th>
                  <th style={{ textAlign: 'right' }}>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="id-cell">
                      <strong>{p.codigo}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{p.titulo}</strong>
                        {p.descricao && (
                          <small
                            style={{
                              display: 'block',
                              color: 'var(--muted)',
                              fontSize: '12px',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              maxWidth: '280px',
                            }}
                          >
                            {p.descricao}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>{p.tipo}</td>
                    <td>
                      <span
                        className={`interest-badge interest-badge--${p.finalidade === 'Venda' ? 'venda' : 'aluguel'}`}
                        style={{
                          fontSize: '11px',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          fontWeight: 700,
                        }}
                      >
                        {p.finalidade}
                      </span>
                    </td>
                    <td>
                      {p.bairro}, {p.cidade}
                    </td>
                    <td>{p.areaM2} m²</td>
                    <td>
                      <strong style={{ color: 'var(--primary)', fontSize: '14px' }}>
                        {formatCurrency(p.valor)}
                      </strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant="secondary"
                        style={{ minHeight: '30px', padding: '0 12px', fontSize: '12px' }}
                        onClick={() => setSelectedProperty(p)}
                      >
                        Visualizar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--muted)' }}>
            <Icon name="building" size={32} />
            <h3 style={{ marginTop: '12px', color: 'var(--heading)' }}>Nenhum imóvel encontrado</h3>
            <p style={{ fontSize: '13px' }}>Tente ajustar a busca ou cadastre um novo imóvel.</p>
          </div>
        )}
      </section>

      {selectedProperty && (
        <div className="modal-backdrop" onClick={() => setSelectedProperty(null)}>
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', padding: '28px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {selectedProperty.codigo} · {selectedProperty.tipo}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '20px', color: 'var(--heading)' }}>
                  {selectedProperty.titulo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProperty(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  padding: '4px',
                }}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  background: 'var(--panel)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <small
                  style={{
                    color: 'var(--muted)',
                    display: 'block',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                  }}
                >
                  Valor de {selectedProperty.finalidade}
                </small>
                <strong style={{ fontSize: '18px', color: 'var(--primary)' }}>
                  {formatCurrency(selectedProperty.valor)}
                </strong>
              </div>
              <div
                style={{
                  background: 'var(--panel)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <small
                  style={{
                    color: 'var(--muted)',
                    display: 'block',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                  }}
                >
                  Área útil
                </small>
                <strong style={{ fontSize: '18px', color: 'var(--heading)' }}>
                  {selectedProperty.areaM2} m²
                </strong>
              </div>
              <div
                style={{
                  background: 'var(--panel)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <small
                  style={{
                    color: 'var(--muted)',
                    display: 'block',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                  }}
                >
                  Quartos / Vagas
                </small>
                <span style={{ fontSize: '14px', color: 'var(--heading)', fontWeight: 600 }}>
                  {selectedProperty.quartos ? `${selectedProperty.quartos} quartos` : '—'} ·{' '}
                  {selectedProperty.vagas ? `${selectedProperty.vagas} vagas` : '—'}
                </span>
              </div>
              <div
                style={{
                  background: 'var(--panel)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <small
                  style={{
                    color: 'var(--muted)',
                    display: 'block',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                  }}
                >
                  Localização
                </small>
                <span style={{ fontSize: '14px', color: 'var(--heading)', fontWeight: 600 }}>
                  {selectedProperty.bairro}, {selectedProperty.cidade}
                </span>
              </div>
            </div>

            {selectedProperty.descricao && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--heading)' }}>
                  Descrição
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text)', lineHeight: 1.5 }}>
                  {selectedProperty.descricao}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setSelectedProperty(null)}>Fechar detalhes</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
