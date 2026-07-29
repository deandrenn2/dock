import type { DockMode } from './types'

export function resolveDropMode(originMode: DockMode): DockMode {
  return originMode === 'fixed' ? 'fixed' : 'floating'
}
