import { useReducer, useCallback } from 'react'
import type { DockState, DockMode, Position } from './types'

type Action =
  | { type: 'START_DRAG'; position: Position }
  | { type: 'COMMIT'; position: Position; mode: DockMode }
  | { type: 'RETURN_TO_DOCK' }
  | { type: 'RESTORE'; state: DockState }

function reducer(state: DockState, action: Action): DockState {
  switch (action.type) {
    case 'START_DRAG':
      return { mode: 'dragging', position: action.position }
    case 'COMMIT':
      return { mode: action.mode, position: action.position }
    case 'RETURN_TO_DOCK':
      return { mode: 'docked', position: null }
    case 'RESTORE':
      return action.state
    default:
      return state
  }
}

const INITIAL: DockState = { mode: 'docked', position: null }

export function useDockState() {
  const [state, dispatch] = useReducer(reducer, INITIAL)

  const startDrag = useCallback((position: Position) => {
    dispatch({ type: 'START_DRAG', position })
  }, [])

  const commit = useCallback((position: Position, mode: DockMode) => {
    dispatch({ type: 'COMMIT', position, mode })
  }, [])

  const returnToDock = useCallback(() => {
    dispatch({ type: 'RETURN_TO_DOCK' })
  }, [])

  const restore = useCallback((state: DockState) => {
    dispatch({ type: 'RESTORE', state })
  }, [])

  return { state, startDrag, commit, returnToDock, restore }
}
