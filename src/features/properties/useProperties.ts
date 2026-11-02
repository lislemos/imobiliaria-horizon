import { useEffect, useState } from 'react'
import { demoProperties } from './data/demoProperties'
import type { Property, PropertyFormData } from './model/types'

const PROPERTIES_STORAGE_KEY = 'horizonte_properties'

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(PROPERTIES_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return demoProperties
  })

  useEffect(() => {
    try {
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(properties))
    } catch {
      // ignore
    }
  }, [properties])

  const createProperty = (data: PropertyFormData) => {
    const nextId = properties.reduce((max, p) => Math.max(max, p.id), 0) + 1
    const codigo = data.codigo.trim() || `IMV-${String(nextId).padStart(3, '0')}`

    const newProperty: Property = {
      ...data,
      id: nextId,
      codigo,
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
    }

    setProperties((current) => [newProperty, ...current])
    return newProperty
  }

  const deleteProperty = (id: number) => {
    setProperties((current) => current.filter((p) => p.id !== id))
    return true
  }

  return {
    properties,
    createProperty,
    deleteProperty,
  }
}
