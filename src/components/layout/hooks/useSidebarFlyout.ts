import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'

export type NavigationItem = {
  label: string
  current: boolean
  select: () => void
}
type RailFlyout = { label: string; top: number; subs?: NavigationItem[] }
const RAIL_ENTER_MS = 100
const RAIL_LEAVE_MS = 180

export function useSidebarFlyout(collapsed: boolean) {
  const sideRef = useRef<HTMLElement>(null)
  const [fly, setFly] = useState<RailFlyout | null>(null)
  const [flyShown, setFlyShown] = useState(false)
  const flyRef = useRef<HTMLDivElement>(null)
  const timers = useRef({ enter: 0, leave: 0, remove: 0 })

  // O pequeno atraso evita abrir e fechar os atalhos a cada passagem do mouse.
  const isRail = () => collapsed && window.matchMedia('(min-width: 761px)').matches
  const hideFly = useCallback(() => {
    const t = timers.current
    clearTimeout(t.enter)
    clearTimeout(t.leave)
    clearTimeout(t.remove)
    setFlyShown(false)
    t.remove = window.setTimeout(() => setFly(null), 160)
  }, [])
  const showFly = (anchor: HTMLElement, label: string, subs?: NavigationItem[]) => {
    if (!isRail()) return
    const t = timers.current
    clearTimeout(t.leave)
    clearTimeout(t.enter)
    t.enter = window.setTimeout(() => {
      clearTimeout(t.remove)
      setFlyShown(false)
      setFly({ label, subs, top: anchor.getBoundingClientRect().top })
    }, RAIL_ENTER_MS)
  }
  const dismissFly = () => {
    const t = timers.current
    clearTimeout(t.leave)
    t.leave = window.setTimeout(hideFly, RAIL_LEAVE_MS)
  }
  const railLeave = (event: ReactMouseEvent) => {
    if (!flyRef.current?.contains(event.relatedTarget as Node | null)) dismissFly()
  }
  useLayoutEffect(() => {
    const el = flyRef.current
    if (!fly || !el) return
    el.style.left = `${(sideRef.current?.getBoundingClientRect().right ?? 64) + 6}px`
    el.style.top = `${Math.max(8, Math.min(fly.top, window.innerHeight - el.offsetHeight - 8))}px`
    const frame = requestAnimationFrame(() => setFlyShown(true))
    return () => cancelAnimationFrame(frame)
  }, [fly])
  useEffect(() => {
    if (!collapsed) hideFly()
  }, [collapsed, hideFly])
  useEffect(() => {
    if (!fly) return
    const outside = (event: MouseEvent) => {
      if (!flyRef.current?.contains(event.target as Node)) hideFly()
    }
    document.addEventListener('click', outside, true)

    // A captura também pega a rolagem da área de conteúdo, que não sobe até o documento.
    document.addEventListener('scroll', hideFly, {
      capture: true,
      passive: true,
    })
    return () => {
      document.removeEventListener('click', outside, true)
      document.removeEventListener('scroll', hideFly, { capture: true })
    }
  }, [fly, hideFly])
  useEffect(
    () => () => {
      const t = timers.current
      clearTimeout(t.enter)
      clearTimeout(t.leave)
      clearTimeout(t.remove)
    },
    [],
  )
  const leaveSidebar = () => {
    clearTimeout(timers.current.enter)
    dismissFly()
  }
  const keepFlyOpen = () => clearTimeout(timers.current.leave)

  return {
    sideRef,
    flyRef,
    fly,
    flyShown,
    isRail,
    showFly,
    hideFly,
    dismissFly,
    railLeave,
    leaveSidebar,
    keepFlyOpen,
  }
}
