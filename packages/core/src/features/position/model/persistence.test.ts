import { describe, expect, it } from 'vitest'
import {
  clampFloatingPositionToBounds,
  clampPositionToBounds,
  parsePersistedDockState,
  serializeDockState,
} from './persistence'

describe('dock persistence', () => {
  it('parses persisted floating and fixed states', () => {
    expect(
      parsePersistedDockState(
        JSON.stringify({ version: 1, mode: 'floating', position: { x: 120, y: 240 } }),
      ),
    ).toEqual({ mode: 'floating', position: { x: 120, y: 240 } })

    expect(
      parsePersistedDockState(
        JSON.stringify({ version: 1, mode: 'fixed', position: { x: 24, y: 48 } }),
      ),
    ).toEqual({ mode: 'fixed', position: { x: 24, y: 48 } })
  })

  it('normalizes a persisted docked state and rejects unsafe values', () => {
    expect(
      parsePersistedDockState(
        JSON.stringify({ version: 1, mode: 'docked', position: { x: 10, y: 10 } }),
      ),
    ).toEqual({ mode: 'docked', position: null })
    expect(parsePersistedDockState('{invalid')).toBeNull()
    expect(
      parsePersistedDockState(
        JSON.stringify({ version: 1, mode: 'dragging', position: { x: 10, y: 10 } }),
      ),
    ).toBeNull()
  })

  it('does not persist the transient dragging state', () => {
    expect(serializeDockState({ mode: 'dragging', position: { x: 10, y: 20 } })).toBeNull()
  })

  it('clamps restored coordinates inside the available bounds', () => {
    expect(
      clampPositionToBounds(
        { x: 1400, y: 900 },
        { width: 300, height: 100 },
        { width: 1024, height: 768 },
      ),
    ).toEqual({ x: 716, y: 660 })

    expect(
      clampPositionToBounds(
        { x: -100, y: -200 },
        { width: 300, height: 100 },
        { width: 1024, height: 768 },
      ),
    ).toEqual({ x: 8, y: 8 })
  })

  it('uses viewport width and document height for floating coordinates', () => {
    expect(
      clampFloatingPositionToBounds(
        { x: 1400, y: 2100 },
        { width: 300, height: 100 },
        { viewportWidth: 1024, documentHeight: 2000, scrollX: 200 },
      ),
    ).toEqual({ x: 916, y: 1892 })
  })
})
