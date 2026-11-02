type AvatarProps = { name: string; large?: boolean }

export function Avatar({ name, large = false }: AvatarProps) {
  const letters = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
  const tone = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4
  return (
    <span
      className={`avatar ${tone ? `avatar--tone-${tone}` : ''} ${large ? 'avatar--large' : ''}`}
    >
      {letters}
    </span>
  )
}
