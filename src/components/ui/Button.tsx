import type { CSSProperties, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

type ButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  icon?: IconName
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  style?: CSSProperties
  title?: string
}

export function Button({
  children,
  variant = 'primary',
  icon,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style,
  title,
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={style}
      title={title}
    >
      {icon && <Icon name={icon} size={17} />}
      <span>{children}</span>
    </button>
  )
}
