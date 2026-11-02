export type AdminPage = 'admin-cadastrar' | 'admin-consultar' | 'admin-excluir'

export type CorretorPage = 'corretor-cadastrar' | 'corretor-consultar' | 'corretor-excluir'

export type AtendentePage =
  | 'atendente-cadastrar'
  | 'atendente-listar'
  | 'atendente-buscar'
  | 'atendente-atualizar'
  | 'atendente-excluir'

export type Page = AdminPage | CorretorPage | AtendentePage

export const pageTitle: Record<Page, [title: string, section: string]> = {
  // Administrador
  'admin-cadastrar': ['Cadastrar usuário', 'Administrador'],
  'admin-consultar': ['Consultar usuário', 'Administrador'],
  'admin-excluir': ['Excluir usuário', 'Administrador'],

  // Corretor
  'corretor-cadastrar': ['Cadastrar imóvel', 'Corretor'],
  'corretor-consultar': ['Consultar imóvel', 'Corretor'],
  'corretor-excluir': ['Excluir imóvel', 'Corretor'],

  // Atendente
  'atendente-cadastrar': ['Cadastrar cliente', 'Atendente'],
  'atendente-listar': ['Listar clientes', 'Atendente'],
  'atendente-buscar': ['Buscar cliente', 'Atendente'],
  'atendente-atualizar': ['Atualizar cliente', 'Atendente'],
  'atendente-excluir': ['Excluir cliente', 'Atendente'],
}
