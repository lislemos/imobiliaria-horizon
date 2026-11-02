import { useEffect, useState } from 'react'

const LOADING_MS = 1400

export function useDemoSession() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  // O login é demonstrativo. Esse intervalo só acompanha a animação de abertura.
  useEffect(() => {
    if (!loading) return
    const timer = window.setTimeout(() => {
      setLoading(false)
      setAuthenticated(true)
    }, LOADING_MS)
    return () => window.clearTimeout(timer)
  }, [loading])

  const startSession = () => setLoading(true)
  const endSession = () => {
    setLoading(false)
    setAuthenticated(false)
  }

  return { authenticated, loading, startSession, endSession }
}
