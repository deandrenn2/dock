import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { applyTheme, type Theme } from '../lib/theme'

type ThemeContextValue = { theme: Theme }

const ThemeContext = createContext<ThemeContextValue>({ theme: {} })

export function useTheme() {
  return useContext(ThemeContext)
}

type ThemeProviderProps = {
  theme?: Theme
  children: ReactNode
}

export function ThemeProvider({ theme = {}, children }: ThemeProviderProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) applyTheme(ref.current, theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div ref={ref} className="dock-theme-root" style={{ display: 'contents' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
