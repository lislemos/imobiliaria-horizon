import { interests, interestVerb } from '@/features/clients/model/interests'
import type { Client } from '@/features/clients/model/types'

export const percent = (part: number, total: number) =>
  total ? Math.round((part / total) * 100) : 0

export function summarize(clients: Client[]) {
  const parts = interests
    .map((interest) => [interest, clients.filter((c) => c.interesse === interest).length] as const)
    .filter(([, n]) => n)
    .map(([interest, n]) => `${n} ${n === 1 ? 'quer' : 'querem'} ${interestVerb[interest]}`)
  return parts.length > 1
    ? `${parts.slice(0, -1).join(', ')} e ${parts.at(-1)}.`
    : `${parts[0] ?? 'Ninguém na base ainda'}.`
}
