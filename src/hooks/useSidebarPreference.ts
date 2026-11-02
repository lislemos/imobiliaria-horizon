import { readPreference, writePreference } from '@/lib/preferences'
import { useState } from 'react'

const SIDEBAR_KEY = 'horizonte:sidebar-collapsed'

export function useSidebarPreference() {
  const [collapsed, setCollapsed] = useState(() => readPreference(SIDEBAR_KEY) === '1')

  const toggleCollapsed = () => {
    writePreference(SIDEBAR_KEY, collapsed ? '0' : '1')
    setCollapsed(!collapsed)
  }

  return { collapsed, toggleCollapsed }
}
