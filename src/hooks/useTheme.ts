import { useCallback, useEffect, useState } from 'react'

const THEME_KEY = 'task-dashboard-theme'

export type ThemeMode = 'light' | 'dark'

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null
      if (stored === 'light' || stored === 'dark') return stored
    } catch {
      /* ignore */
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, toggleTheme, setTheme: setThemeState }
}
