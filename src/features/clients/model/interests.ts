import type { IconName } from '@/components/ui/Icon'
import type { Interest } from '@/features/clients/model/types'

export const interestLabel: Record<Interest, string> = {
  compra: 'Compra',
  venda: 'Venda',
  aluguel: 'Aluguel',
}

export const interests: Interest[] = ['compra', 'venda', 'aluguel']

export const interestGroup: Record<Interest, string> = {
  compra: 'Querem comprar',
  venda: 'Querem vender',
  aluguel: 'Querem alugar',
}

export const interestVerb: Record<Interest, string> = {
  compra: 'comprar',
  venda: 'vender',
  aluguel: 'alugar',
}

export const interestIcon: Record<Interest, IconName> = {
  compra: 'building',
  venda: 'tag',
  aluguel: 'key',
}

export const interestTone: Record<Interest, string> = {
  compra: '#2e7cf6',
  venda: '#e0913f',
  aluguel: '#2a9d8f',
}
