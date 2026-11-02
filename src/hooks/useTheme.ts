import { readPreference, writePreference } from '@/lib/preferences'
import { useEffect, useLayoutEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'horizonte:theme'

function storedTheme(): Theme | null {
  const value = readPreference(THEME_KEY)
  return value === 'light' || value === 'dark' ? value : null
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () =>
      storedTheme() ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  )

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // A preferência do sistema só manda enquanto a pessoa não escolher um tema.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystem = () => {
      if (!storedTheme()) setTheme(media.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', followSystem)
    return () => media.removeEventListener('change', followSystem)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    writePreference(THEME_KEY, next)
    setTheme(next)
  }

  return { theme, toggleTheme }
}
