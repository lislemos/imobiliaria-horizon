export type Page = 'dashboard' | 'clients' | 'new' | 'details' | 'edit'

export const pageTitle: Record<Page, [title: string, section: string]> = {
  dashboard: ['Visão geral', 'Principal'],
  clients: ['Clientes', 'Principal'],
  new: ['Cadastrar cliente', 'Clientes'],
  details: ['Detalhes do cliente', 'Clientes'],
  edit: ['Editar cliente', 'Clientes'],
}
