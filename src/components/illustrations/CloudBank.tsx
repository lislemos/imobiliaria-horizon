export type Puff = [number, number, number]

type CloudBankProps = {
  id: string
  puffs: Puff[]
  floor?: number
  base: string
  light: string
  className?: string
}

export function CloudBank({ id, puffs, floor, base, light, className }: CloudBankProps) {
  const shape = (
    <>
      {puffs.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
      ))}
      {floor !== undefined && <rect x="-60" y={floor} width="1720" height="200" />}
    </>
  )
  return (
    <g className={className}>
      <clipPath id={id}>{shape}</clipPath>
      <g fill={base}>{shape}</g>
      <g fill={light} clipPath={`url(#${id})`}>
        {puffs.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x - r * 0.3} cy={y - r * 0.34} r={r * 0.64} />
        ))}
      </g>
    </g>
  )
}
