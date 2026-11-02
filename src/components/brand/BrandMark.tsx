import logoSymbol from '@/assets/horizonte-simbolo.svg'

// O contorno arredondado é calculado uma vez e usado nas três camadas do vidro.
const PEDRA_SIZE = 44
const pedraPath = (() => {
  const half = PEDRA_SIZE / 2
  const exponent = 3.6
  const points = Array.from({ length: 120 }, (_, i) => {
    const t = (i / 120) * Math.PI * 2
    const x = half + half * Math.sign(Math.cos(t)) * Math.abs(Math.cos(t)) ** (2 / exponent)
    const y = half + half * Math.sign(Math.sin(t)) * Math.abs(Math.sin(t)) ** (2 / exponent)
    return `${x.toFixed(2)} ${y.toFixed(2)}`
  })
  return `M${points.join('L')}Z`
})()

function GlassTile() {
  return (
    <>
      <svg className="glass-tile__shadow" viewBox="-14 -10 72 72" aria-hidden="true">
        <defs>
          <filter id="glass-shadow-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <path
          d={pedraPath}
          transform="translate(0 7)"
          fill="rgba(16,58,140,.2)"
          filter="url(#glass-shadow-blur)"
        />
      </svg>
      <span className="glass-tile" style={{ clipPath: `path('${pedraPath}')` }} />
      <svg
        className="glass-tile__rim"
        viewBox={`0 0 ${PEDRA_SIZE} ${PEDRA_SIZE}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="glass-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="white" stopOpacity=".95" />
            <stop offset=".38" stopColor="white" stopOpacity=".22" />
            <stop offset=".68" stopColor="white" stopOpacity=".08" />
            <stop offset="1" stopColor="white" stopOpacity=".7" />
          </linearGradient>
          <clipPath id="glass-rim-clip">
            <path d={pedraPath} />
          </clipPath>
        </defs>
        <path
          d={pedraPath}
          fill="none"
          stroke="url(#glass-rim)"
          strokeWidth="2.6"
          clipPath="url(#glass-rim-clip)"
        />
      </svg>
    </>
  )
}

// O nome da marca já aparece ao lado; a imagem aqui é só decorativa.
type BrandMarkProps = { glass?: boolean }

export function BrandMark({ glass = false }: BrandMarkProps) {
  return (
    <span className={`brand__mark ${glass ? 'brand__mark--glass' : ''}`}>
      {glass && <GlassTile />}
      <img src={logoSymbol} alt="" />
    </span>
  )
}
