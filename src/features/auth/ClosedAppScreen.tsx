import { BrandMark } from '@/components/brand/BrandMark'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

type ClosedAppScreenProps = {
  onRestart: () => void
}

export function ClosedAppScreen({ onRestart }: ClosedAppScreenProps) {
  return (
    <main
      className="login-page login-page--photo"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '460px',
          width: '90%',
          textAlign: 'center',
          padding: '48px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <BrandMark glass />
        </div>

        <h1 style={{ fontSize: '24px', marginBottom: '10px', color: 'var(--heading)' }}>
          Programa Encerrado
        </h1>

        <p
          style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}
        >
          A sessão foi finalizada e o sistema da Imobiliária Horizonte foi encerrado com segurança.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button icon="arrow" onClick={onRestart}>
            Reabrir programa
          </Button>
        </div>

        <p
          style={{
            marginTop: '24px',
            fontSize: '12px',
            color: 'var(--muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Icon name="shield" size={14} />
          Imobiliária Horizonte · Sistema fechado
        </p>
      </div>
    </main>
  )
}
