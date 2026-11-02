import { Icon } from '@/components/ui/Icon'

type ToastProps = { message: string }

export function Toast({ message }: ToastProps) {
  return (
    <div className="toast" role="status">
      <span>
        <Icon name="check" size={16} />
      </span>
      {message}
    </div>
  )
}
