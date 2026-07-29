import { describe, expect, it } from 'vitest'
import { resolveDropMode } from './resolveDropMode'

describe('resolveDropMode', () => {
  it('keeps a fixed dock fixed after dragging away from an edge', () => {
    expect(resolveDropMode('fixed')).toBe('fixed')
  })

  it('keeps a floating dock floating when dropped near an edge', () => {
    expect(resolveDropMode('floating')).toBe('floating')
  })

  it('detaches a docked dock as floating', () => {
    expect(resolveDropMode('docked')).toBe('floating')
  })
})
