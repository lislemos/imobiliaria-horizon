export type Role = 'admin' | 'corretor' | 'atendente'

export type User = {
  id: number
  nome: string
  email: string
  senha: string
  role: Role
  criadoEm?: string
}

export const roleLabels: Record<Role, string> = {
  admin: 'Administrador',
  corretor: 'Corretor',
  atendente: 'Atendente',
}

export const roleDescriptions: Record<Role, string> = {
  admin: 'Gestão de usuários e permissões do sistema',
  corretor: 'Gestão e consulta do catálogo de imóveis',
  atendente: 'Atendimento, busca e cadastro de clientes',
}
