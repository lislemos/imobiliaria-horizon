import { useEffect, useState } from 'react'
import { initialClients } from './data/demoClients'
import type { Client, ClientData } from './model/types'

const CLIENTS_STORAGE_KEY = 'horizonte_clients'

export function useClients() {
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(CLIENTS_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return initialClients
  })
  const [selected, selectClient] = useState<Client | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients))
    } catch {
      // ignore
    }
  }, [clients])

  const createClient = (data: ClientData) => {
    const nextId = clients.reduce((highest, client) => Math.max(highest, client.id), 0) + 1
    const client: Client = { ...data, id: nextId }
    setClients((current) => [...current, client])
    selectClient(client)
    return client
  }

  const updateClient = (id: number, data: ClientData) => {
    const updated: Client = { ...data, id }
    setClients((current) => current.map((client) => (client.id === id ? updated : client)))
    selectClient(updated)
    return updated
  }

  const removeClient = (id: number) => {
    setClients((current) => current.filter((client) => client.id !== id))
    if (selected?.id === id) selectClient(null)
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
