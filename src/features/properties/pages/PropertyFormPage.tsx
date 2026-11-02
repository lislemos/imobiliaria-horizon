import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import type { PropertyFormData, PropertyGoal, PropertyType } from '../model/types'
import { propertyGoals, propertyTypes } from '../model/types'

type PropertyFormPageProps = {
  onSave: (data: PropertyFormData) => void
  onGoToConsultar: () => void
}

export function PropertyFormPage({ onSave, onGoToConsultar }: PropertyFormPageProps) {
  const [codigo, setCodigo] = useState('')
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState<PropertyType>('Apartamento')
  const [finalidade, setFinalidade] = useState<PropertyGoal>('Venda')
  const [valor, setValor] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('São Paulo')
  const [areaM2, setAreaM2] = useState('')
  const [quartos, setQuartos] = useState('2')
  const [vagas, setVagas] = useState('1')
  const [descricao, setDescricao] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!titulo.trim()) nextErrors.titulo = 'Informe o título do imóvel.'
    const numValor = Number.parseFloat(valor.replace(/\D/g, ''))
    if (!valor.trim() || Number.isNaN(numValor) || numValor <= 0) {
      nextErrors.valor = 'Informe um valor válido.'
    }
    if (!bairro.trim()) nextErrors.bairro = 'Informe o bairro.'
    const numArea = Number.parseFloat(areaM2)
    if (!areaM2.trim() || Number.isNaN(numArea) || numArea <= 0) {
      nextErrors.areaM2 = 'Informe a área em m².'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSave({
      codigo: codigo.trim(),
      titulo: titulo.trim(),
      tipo,
      finalidade,
      valor: numValor,
      bairro: bairro.trim(),
      cidade: cidade.trim() || 'São Paulo',
      areaM2: numArea,
      quartos: quartos ? Number.parseInt(quartos, 10) : undefined,
      vagas: vagas ? Number.parseInt(vagas, 10) : undefined,
      descricao: descricao.trim(),
    })

    onGoToConsultar()
  }

  return (
    <>
      <PageHeader
        title="Cadastrar imóvel"
        description="Preencha as especificações do imóvel para inclusão no catálogo da imobiliária."
        action={
          <Button variant="secondary" onClick={onGoToConsultar}>
            Ver imóveis cadastrados
          </Button>
        }
      />

      <section className="card form-card">
        <form onSubmit={submit} noValidate>
          <div className="form-section">
            <div className="form-section__heading">
              <span>01</span>
              <div>
                <h2>Dados principais</h2>
                <p>Identificação, modalidade e valores do imóvel.</p>
              </div>
            </div>

            <div className="form-grid">
              <label className={`field field--full ${errors.titulo ? 'field--error' : ''}`}>
                <span>
                  Título do anúncio <em>*</em>
                </span>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => {
                    setTitulo(e.target.value)
                    setErrors((p) => ({ ...p, titulo: '' }))
                  }}
                  placeholder="Ex.: Apartamento com varanda gourmet e vista para o parque"
                  autoFocus
                />
                {errors.titulo && <small>{errors.titulo}</small>}
              </label>

              <label className="field">
                <span>
                  Código de referência <i>Opcional</i>
                </span>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ex.: IMV-102 (automático se vazio)"
                />
              </label>

              <label className="field">
                <span>
                  Tipo de imóvel <em>*</em>
                </span>
                <select value={tipo} onChange={(e) => setTipo(e.target.value as PropertyType)}>
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>
                  Finalidade <em>*</em>
                </span>
                <select
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value as PropertyGoal)}
                >
                  {propertyGoals.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>

              <label className={`field ${errors.valor ? 'field--error' : ''}`}>
                <span>
                  Valor (R$) <em>*</em>
                </span>
                <input
                  type="text"
                  value={valor}
                  onChange={(e) => {
                    setValor(e.target.value)
                    setErrors((p) => ({ ...p, valor: '' }))
                  }}
                  placeholder="Ex.: 850.000 ou 3.500"
                />
                {errors.valor && <small>{errors.valor}</small>}
              </label>
            </div>
          </div>

          <div className="form-divider" />

          <div className="form-section">
            <div className="form-section__heading">
              <span>02</span>
              <div>
                <h2>Localização e características</h2>
                <p>Detalhes físicos e endereço do imóvel.</p>
              </div>
            </div>

            <div className="form-grid">
              <label className={`field ${errors.bairro ? 'field--error' : ''}`}>
                <span>
                  Bairro <em>*</em>
                </span>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => {
                    setBairro(e.target.value)
                    setErrors((p) => ({ ...p, bairro: '' }))
                  }}
                  placeholder="Ex.: Jardins, Moema, Vila Madalena"
                />
                {errors.bairro && <small>{errors.bairro}</small>}
              </label>

              <label className="field">
                <span>
                  Cidade <em>*</em>
                </span>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex.: São Paulo"
                />
              </label>

              <label className={`field ${errors.areaM2 ? 'field--error' : ''}`}>
                <span>
                  Área útil (m²) <em>*</em>
                </span>
                <input
                  type="number"
                  value={areaM2}
                  onChange={(e) => {
                    setAreaM2(e.target.value)
                    setErrors((p) => ({ ...p, areaM2: '' }))
                  }}
                  placeholder="Ex.: 95"
                />
                {errors.areaM2 && <small>{errors.areaM2}</small>}
              </label>

              <label className="field">
                <span>Quartos</span>
                <input
                  type="number"
                  min="0"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value)}
                  placeholder="0"
                />
              </label>

              <label className="field">
                <span>Vagas de garagem</span>
                <input
                  type="number"
                  min="0"
                  value={vagas}
                  onChange={(e) => setVagas(e.target.value)}
                  placeholder="0"
                />
              </label>

              <label className="field field--full">
                <span>
                  Descrição detalhada <i>Opcional</i>
                </span>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Destaques, diferenciais, condomínio e infraestrutura..."
                />
              </label>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setTitulo('')
                setCodigo('')
                setValor('')
                setBairro('')
                setAreaM2('')
                setDescricao('')
                setErrors({})
              }}
            >
              Limpar
            </Button>
            <Button type="submit" icon="check">
              Cadastrar imóvel
            </Button>
          </div>
        </form>
      </section>
    </>
  )
}
