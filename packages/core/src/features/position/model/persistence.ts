import type { DockState, Position } from './types'

type Bounds = {
  width: number
  height: number
}

type Size = {
  width: number
  height: number
}

type PersistedDockState = {
  version: 1
  mode: 'docked' | 'floating' | 'fixed'
  position: Position | null
}

function isPosition(value: unknown): value is Position {
  if (!value || typeof value !== 'object') return false
  const position = value as Record<string, unknown>
  return (
    typeof position['x'] === 'number' &&
    Number.isFinite(position['x']) &&
    typeof position['y'] === 'number' &&
    Number.isFinite(position['y'])
  )
}

export function parsePersistedDockState(value: string | null): DockState | null {
  if (!value) return null

  try {
    const parsed = JSON.parse(value) as unknown
    if (!parsed || typeof parsed !== 'object') return null

    const candidate = parsed as Record<string, unknown>
    if (candidate['version'] !== 1) return null

    if (candidate['mode'] === 'docked') {
      return { mode: 'docked', position: null }
    }

    if (
      (candidate['mode'] === 'floating' || candidate['mode'] === 'fixed') &&
      isPosition(candidate['position'])
    ) {
      return { mode: candidate['mode'], position: candidate['position'] }
    }
  } catch {
    return null
  }

  return null
}

export function serializeDockState(state: DockState): string | null {
  if (state.mode === 'dragging') return null

  const persisted: PersistedDockState = {
    version: 1,
    mode: state.mode,
    position: state.mode === 'docked' ? null : state.position,
  }

  return JSON.stringify(persisted)
}

export function clampPositionToBounds(
  position: Position,
  item: Size,
  bounds: Bounds,
  margin = 8,
): Position {
  const maxX = Math.max(margin, bounds.width - item.width - margin)
  const maxY = Math.max(margin, bounds.height - item.height - margin)

  return {
    x: Math.max(margin, Math.min(position.x, maxX)),
    y: Math.max(margin, Math.min(position.y, maxY)),
  }
}

export function clampFloatingPositionToBounds(
  position: Position,
  item: Size,
  bounds: { viewportWidth: number; documentHeight: number; scrollX: number },
  margin = 8,
): Position {
  const clamped = clampPositionToBounds(
    { x: position.x - bounds.scrollX, y: position.y },
    item,
    { width: bounds.viewportWidth, height: bounds.documentHeight },
    margin,
  )

  return {
    x: clamped.x + bounds.scrollX,
    y: clamped.y,
  }
}
