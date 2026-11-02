import { useCallback, useEffect, useRef, useState } from 'react'

const TOAST_DURATION_MS = 3000

export function useToast() {
  const [toast, setToast] = useState('')
  const timer = useRef<number | undefined>(undefined)

  const notify = useCallback((message: string) => {
    // Um aviso novo ganha o tempo inteiro, mesmo se o anterior ainda estiver na tela.
    window.clearTimeout(timer.current)
    setToast(message)
    timer.current = window.setTimeout(() => setToast(''), TOAST_DURATION_MS)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { toast, notify }
}
