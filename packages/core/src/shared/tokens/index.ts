import colorsCSS from './colors.css?inline'
import spacingCSS from './spacing.css?inline'
import typographyCSS from './typography.css?inline'

export function injectTokens(): void {
  if (typeof document === 'undefined') return
  if (document.querySelector('[data-dock-tokens]')) return
  const style = document.createElement('style')
  style.setAttribute('data-dock-tokens', '')
  style.textContent = colorsCSS + spacingCSS + typographyCSS
  document.head.appendChild(style)
}
