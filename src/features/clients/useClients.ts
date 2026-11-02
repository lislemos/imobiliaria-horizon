import { useState } from 'react'
import { initialClients } from './data/demoClients'
import type { Client, ClientData } from './model/types'

export function useClients() {
  const [clients, setClients] = useState(initialClients)
  const [selected, selectClient] = useState<Client | null>(null)

  // Não há API nesta versão: recarregar a página restaura os contatos de exemplo.
  const createClient = (data: ClientData) => {
    const nextId = clients.reduce((highest, client) => Math.max(highest, client.id), 0) + 1
    const client = { ...data, id: nextId }
    setClients((current) => [...current, client])
    selectClient(client)
  }

  const updateClient = (id: number, data: ClientData) => {
    const updated = { ...data, id }
    setClients((current) => current.map((client) => (client.id === id ? updated : client)))
    selectClient(updated)
  }

  const removeClient = (id: number) => {
    setClients((current) => current.filter((client) => client.id !== id))
    selectClient(null)
  }

  return {
    clients,
    selected,
    selectClient,
    createClient,
    updateClient,
    removeClient,
  }
}
