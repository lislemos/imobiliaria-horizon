import { Icon } from '@/components/ui/Icon'
import type { Theme } from '@/hooks/useTheme'

type ThemeToggleProps = { theme: Theme; onToggle: () => void }

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const label = theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo noturno'
  return (
    <button className="theme-toggle" onClick={onToggle} aria-label={label} title={label}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
    </button>
  )
}
