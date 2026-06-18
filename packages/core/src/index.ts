import { injectTokens } from './shared/tokens/index'

// Inject CSS custom property tokens on module load
injectTokens()

// Theme
export { ThemeProvider } from './shared/ui/ThemeProvider'
export type { Theme } from './shared/lib/theme'

// Primitives
export { Button } from './entities/button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './entities/button'

// Widget
export { ButtonDock } from './widgets/ButtonDock'
export type { ButtonDockProps } from './widgets/ButtonDock'
