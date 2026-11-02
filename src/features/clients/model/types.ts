export type Interest = 'compra' | 'venda' | 'aluguel'

export type Client = {
  id: number
  nome: string
  telefone: string
  email: string
  interesse: Interest
}

export type ClientData = Omit<Client, 'id'>
