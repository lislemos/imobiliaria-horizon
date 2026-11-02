export type PropertyType = 'Apartamento' | 'Casa' | 'Terreno' | 'Comercial' | 'Cobertura'
export type PropertyGoal = 'Venda' | 'Aluguel'

export type Property = {
  id: number
  codigo: string
  titulo: string
  tipo: PropertyType
  finalidade: PropertyGoal
  valor: number
  bairro: string
  cidade: string
  areaM2: number
  quartos?: number
  vagas?: number
  descricao?: string
  dataCadastro?: string
}

export type PropertyFormData = Omit<Property, 'id' | 'dataCadastro'>

export const propertyTypes: PropertyType[] = [
  'Apartamento',
  'Casa',
  'Cobertura',
  'Comercial',
  'Terreno',
]

export const propertyGoals: PropertyGoal[] = ['Venda', 'Aluguel']
