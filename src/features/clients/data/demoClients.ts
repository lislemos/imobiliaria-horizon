import type { Client } from '../model/types'

// Esses contatos são só exemplos. Os cadastros desta versão ficam na memória.
export const initialClients: Client[] = [
  {
    id: 1,
    nome: 'Adriano Forgado',
    telefone: '(11) 98765-4321',
    email: 'adriano@exemplo.com',
    interesse: 'compra',
  },
  {
    id: 2,
    nome: 'Marina Costa',
    telefone: '(11) 99548-2031',
    email: 'marina.costa@exemplo.com',
    interesse: 'aluguel',
  },
  {
    id: 3,
    nome: 'Rafael Oliveira',
    telefone: '(11) 98220-4418',
    email: 'rafael@exemplo.com',
    interesse: 'venda',
  },
  {
    id: 4,
    nome: 'Beatriz Martins',
    telefone: '(11) 97632-0190',
    email: 'beatriz.m@exemplo.com',
    interesse: 'compra',
  },
  {
    id: 5,
    nome: 'Lucas Santos',
    telefone: '(11) 96881-3472',
    email: 'lucas.santos@exemplo.com',
    interesse: 'aluguel',
  },
]
