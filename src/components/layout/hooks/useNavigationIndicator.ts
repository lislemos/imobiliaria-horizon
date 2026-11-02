import type { Page } from '@/app/navigation'
import type { Interest } from '@/features/clients/model/types'
import { useCallback, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react'

type IndicatorOptions = {
  page: Page
  filter: Interest | null
  drawer: string | null
  collapsed: boolean
}

export function useNavigationIndicator({ page, filter, drawer, collapsed }: IndicatorOptions) {
  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const hovered = useRef<HTMLElement | null>(null)

  // O destaque acompanha o mouse e volta ao item atual quando ele sai do menu.
  const movePill = useCallback((target: HTMLElement | null, instant = false) => {
    const nav = navRef.current,
      pill = pillRef.current
    if (!nav || !pill) return
    let el = target
    if (el && getComputedStyle(el).visibility === 'hidden')
      el = el.closest('.nav-drawer')?.querySelector<HTMLElement>('.nav-drawer-toggle') ?? null
    if (el && !el.getClientRects().length) el = null
    if (!el) {
      pill.style.opacity = '0'
      return
    }
    const top = el.getBoundingClientRect().top - nav.getBoundingClientRect().top + nav.scrollTop
    if (instant) pill.style.transition = 'none'
    pill.style.opacity = '1'
    pill.style.height = `${el.offsetHeight}px`
    pill.style.transform = `translateY(${top}px)`
    if (instant) {
      // Confirma a posição antes de devolver a transição, para não animar o redimensionamento.
      void pill.offsetHeight
      pill.style.transition = ''
    }
  }, [])
  const pillToActive = useCallback(
    () => movePill(navRef.current?.querySelector<HTMLElement>('[aria-current="page"]') ?? null),
    [movePill],
  )
  useEffect(() => {
    if (hovered.current && getComputedStyle(hovered.current).visibility === 'hidden')
      hovered.current = null
    if (!hovered.current) {
      const frame = requestAnimationFrame(pillToActive)
      return () => cancelAnimationFrame(frame)
    }
  }, [page, filter, drawer, collapsed, pillToActive])
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const observer = new ResizeObserver(() =>
      hovered.current ? movePill(hovered.current, true) : pillToActive(),
    )
    observer.observe(nav)
    nav.querySelectorAll('.nav-drawer-body').forEach((body) => observer.observe(body))
    return () => observer.disconnect()
  }, [movePill, pillToActive])
  const pillFollow = (event: ReactMouseEvent) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(
      '.nav-i, .nav-drawer-toggle, .nav-sub-i',
    )
    if (!target || getComputedStyle(target).visibility === 'hidden') {
      hovered.current = null
      pillToActive()
      return
    }
    if (target !== hovered.current) {
      hovered.current = target
      movePill(target)
    }
  }
  const pillRest = () => {
    hovered.current = null
    pillToActive()
  }

  return { navRef, pillRef, pillFollow, pillRest }
}
