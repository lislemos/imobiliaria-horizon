import { useEffect, useState } from 'react'
import type { Role, User } from '@/features/auth/types'
import { defaultUsers } from './data/defaultUsers'

const USERS_STORAGE_KEY = 'horizonte_users'

export type CreateUserData = {
  nome: string
  email: string
  senha: string
  role: Role
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return defaultUsers
  })

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch {
      // ignore
    }
  }, [users])

  const createUser = (data: CreateUserData): { success: boolean; error?: string; user?: User } => {
    const emailNormalized = data.email.trim().toLowerCase()
    if (users.some((u) => u.email.toLowerCase() === emailNormalized)) {
      return { success: false, error: 'Já existe um usuário cadastrado com este e-mail.' }
    }

    const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1
    const newUser: User = {
      id: nextId,
      nome: data.nome.trim(),
      email: emailNormalized,
      senha: data.senha.trim(),
      role: data.role,
      criadoEm: new Date().toLocaleDateString('pt-BR'),
    }

    setUsers((current) => [...current, newUser])
    return { success: true, user: newUser }
  }

  const deleteUser = (id: number): boolean => {
    setUsers((current) => current.filter((u) => u.id !== id))
    return true
  }

  const findUserByCredentials = (email: string, senha: string): User | undefined => {
    const normEmail = email.trim().toLowerCase()
    const normSenha = senha.trim()
    return users.find((u) => u.email.toLowerCase() === normEmail && u.senha === normSenha)
  }

  return {
    users,
    createUser,
    deleteUser,
    findUserByCredentials,
  }
}
