import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import type { Client, ClientData, Interest } from '@/features/clients/model/types'
import { useState, type FormEvent } from 'react'
import { interestLabel, interests } from '../model/interests'

type ClientFormValues = Omit<ClientData, 'interesse'> & {
  interesse: Interest | ''
}

type FormErrors = Partial<Record<'nome' | 'telefone' | 'interesse', string>>

type ClientFormProps = {
  client?: Client
  onSave: (data: ClientData) => void
  onCancel: () => void
}

export function ClientForm({ client, onSave, onCancel }: ClientFormProps) {
  const [form, setForm] = useState<ClientFormValues>(
    client
      ? {
          nome: client.nome,
          telefone: client.telefone,
          email: client.email,
          interesse: client.interesse,
        }
      : { nome: '', telefone: '', email: '', interesse: '' },
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: FormErrors = {}
    if (!form.nome.trim()) next.nome = 'Informe o nome completo.'
    if (!form.telefone.trim()) next.telefone = 'Informe o telefone.'
    const { interesse } = form
    if (!interesse) next.interesse = 'Selecione um interesse válido.'
    setErrors(next)
    if (Object.keys(next).length || !interesse) return
    onSave({
      ...form,
      interesse,
      nome: form.nome.trim(),
      telefone: form.telefone.trim(),
      email: form.email.trim(),
    })
  }
  const set = <Field extends keyof ClientFormValues>(
    field: Field,
    value: ClientFormValues[Field],
  ) => {
    setForm((old) => ({ ...old, [field]: value }))
    setErrors((old) => ({ ...old, [field]: undefined }))
  }
  return (
    <form onSubmit={submit} noValidate>
      <div className="form-section">
        <div className="form-section__heading">
          <span>01</span>
          <div>
            <h2>Informações pessoais</h2>
            <p>Dados de identificação e contato do cliente.</p>
          </div>
        </div>
        <div className="form-grid">
          <label className={`field field--full ${errors.nome ? 'field--error' : ''}`}>
            <span>
              Nome completo <em>*</em>
            </span>
            <input
              value={form.nome}
              onChange={(e) => set('nome', e.target.value)}
              placeholder="Ex.: Maria da Silva"
              autoFocus
            />
            {errors.nome && <small>{errors.nome}</small>}
          </label>
          <label className={`field ${errors.telefone ? 'field--error' : ''}`}>
            <span>
              Telefone <em>*</em>
            </span>
            <input
              value={form.telefone}
              onChange={(e) => set('telefone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
            {errors.telefone && <small>{errors.telefone}</small>}
          </label>
          <label className="field">
            <span>
              E-mail <i>Opcional</i>
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="nome@exemplo.com"
            />
          </label>
        </div>
      </div>
      <div className="form-divider" />
      <div className="form-section">
        <div className="form-section__heading">
          <span>02</span>
          <div>
            <h2>Interesse imobiliário</h2>
            <p>Selecione o principal objetivo do cliente.</p>
          </div>
        </div>
        <fieldset className={errors.interesse ? 'interest-error' : ''}>
          <legend className="sr-only">Interesse imobiliário</legend>
          <div className="interest-options">
            {interests.map((interest) => (
              <label
                className={`interest-option ${
                  form.interesse === interest ? 'interest-option--selected' : ''
                }`}
                key={interest}
              >
                <input
                  type="radio"
                  name="interest"
                  checked={form.interesse === interest}
                  onChange={() => set('interesse', interest)}
                />
                <span className="interest-option__icon">
                  <Icon name={interest === 'venda' ? 'tag' : 'building'} />
                </span>
                <span>
                  <strong>{interestLabel[interest]}</strong>
                  <small>
                    {interest === 'compra'
                      ? 'Busca um imóvel para comprar'
                      : interest === 'venda'
                        ? 'Deseja anunciar um imóvel'
                        : 'Busca um imóvel para alugar'}
                  </small>
                </span>
                <i>
                  <Icon name="check" size={14} />
                </i>
              </label>
            ))}
          </div>
          {errors.interesse && <p className="field-error">{errors.interesse}</p>}
        </fieldset>
      </div>
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" icon="check">
          {client ? 'Salvar alterações' : 'Cadastrar cliente'}
        </Button>
      </div>
    </form>
  )
}
