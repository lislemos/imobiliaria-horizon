import { pageTitle, type Page } from '@/app/navigation'
import { Icon } from '@/components/ui/Icon'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { Theme } from '@/hooks/useTheme'
import { useEffect, useRef } from 'react'

type TopbarProps = {
  page: Page
  query: string
  onSearch: (value: string) => void
  openMenu: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function Topbar({ page, query, onSearch, openMenu, theme, onToggleTheme }: TopbarProps) {
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (
        event.key !== '/' ||
        (event.target as HTMLElement).closest('input, textarea, [contenteditable="true"]')
      )
        return
      event.preventDefault()
      input.current?.focus()
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])
  const [title, section] = pageTitle[page]
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={openMenu} aria-label="Abrir menu">
        <Icon name="menu" />
      </button>
      <p className="topbar__title">
        <strong>{title}</strong>
        <span>{section}</span>
      </p>
      <div className="topbar-search">
        <Icon name="search" size={16} />
        <input
          ref={input}
          type="text"
          enterKeyHint="search"
          aria-label="Buscar clientes"
          placeholder="Buscar cliente por nome ou telefone…"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
        />
        {query ? (
          <button onClick={() => onSearch('')} aria-label="Limpar busca">
            <Icon name="close" size={14} />
          </button>
        ) : (
          <kbd aria-hidden="true">/</kbd>
        )}
      </div>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  )
}
