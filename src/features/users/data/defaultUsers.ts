import type { User } from '@/features/auth/types'

export const defaultUsers: User[] = [
  {
    id: 1,
    nome: 'Camila Rocha',
    email: 'admin@horizonte.com.br',
    senha: 'admin',
    role: 'admin',
    criadoEm: '01/02/2026',
  },
  {
    id: 2,
    nome: 'Marcos Vinícius',
    email: 'corretor@horizonte.com.br',
    senha: 'corretor',
    role: 'corretor',
    criadoEm: '15/02/2026',
  },
  {
    id: 3,
    nome: 'Larissa Mendes',
    email: 'atendente@horizonte.com.br',
    senha: 'atendente',
    role: 'atendente',
    criadoEm: '20/02/2026',
  },
]
