import { useCallback, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { Position } from './use-dock-state'

type SavedStyles = { position: string; left: string; top: string; margin: string; zIndex: string }

type DragState = {
  offsetX: number; offsetY: number; startClientX: number; startClientY: number
  dockW: number; dockH: number
  savedStyles: SavedStyles
}

type UseDragOptions = {
  rootRef: RefObject<HTMLElement | null>
  placeholderRef?: RefObject<HTMLElement | null>
  onDragStart: (pos: Position) => void
  onDragEnd: (pos: Position) => void
  onReturnToDock: () => void
  onSnapChange?: (isNear: boolean) => void
}

const DRAG_THRESHOLD_PX = 6
const SNAP_PADDING_PX   = 48
const EDGE_MARGIN_PX    = 8

function clamp(x: number, y: number, w: number, h: number): Position {
  return {
    x: Math.max(EDGE_MARGIN_PX, Math.min(x, window.innerWidth  - w - EDGE_MARGIN_PX)),
    y: Math.max(EDGE_MARGIN_PX, Math.min(y, window.innerHeight - h - EDGE_MARGIN_PX)),
  }
}

function restoreStyle(el: HTMLElement, s: SavedStyles) {
  const set = (p: string, v: string) => v ? el.style.setProperty(p, v) : el.style.removeProperty(p)
  set('position', s.position); set('left', s.left); set('top', s.top)
  set('margin', s.margin); set('z-index', s.zIndex)
}

export function useDrag({ rootRef, placeholderRef, onDragStart, onDragEnd, onReturnToDock, onSnapChange }: UseDragOptions) {
  const drag        = useRef<DragState | null>(null)
  const isDragging  = useRef(false)
  const isNearSnap  = useRef(false)

  const onDragEndRef    = useRef(onDragEnd)
  const onDragStartRef  = useRef(onDragStart)
  const onReturnRef     = useRef(onReturnToDock)
  const onSnapChangeRef = useRef(onSnapChange)
  useEffect(() => { onDragEndRef.current    = onDragEnd },     [onDragEnd])
  useEffect(() => { onDragStartRef.current  = onDragStart },   [onDragStart])
  useEffect(() => { onReturnRef.current     = onReturnToDock },[onReturnToDock])
  useEffect(() => { onSnapChangeRef.current = onSnapChange },  [onSnapChange])

  const handleMove = useRef((e: PointerEvent) => {
    if (!drag.current || !rootRef.current) return
    const moved = Math.hypot(e.clientX - drag.current.startClientX, e.clientY - drag.current.startClientY)
    if (!isDragging.current && moved > DRAG_THRESHOLD_PX) {
      isDragging.current = true
      onDragStartRef.current({ x: drag.current.startClientX, y: drag.current.startClientY })
    }
    if (!isDragging.current) return
    const { x, y } = clamp(e.clientX - drag.current.offsetX, e.clientY - drag.current.offsetY, drag.current.dockW, drag.current.dockH)
    rootRef.current.style.left = `${x}px`
    rootRef.current.style.top  = `${y}px`
    if (placeholderRef?.current) {
      const pr = placeholderRef.current.getBoundingClientRect()
      const near = e.clientX >= pr.left - SNAP_PADDING_PX && e.clientX <= pr.right + SNAP_PADDING_PX &&
                   e.clientY >= pr.top  - SNAP_PADDING_PX && e.clientY <= pr.bottom + SNAP_PADDING_PX
      if (near !== isNearSnap.current) { isNearSnap.current = near; onSnapChangeRef.current?.(near) }
    }
  })

  const handleUp = useRef((e: PointerEvent) => {
    if (!drag.current) return
    const { offsetX, offsetY, dockW, dockH, savedStyles } = drag.current
    const wasDragging = isDragging.current
    drag.current = null; isDragging.current = false
    window.removeEventListener('pointermove', handleMove.current)
    window.removeEventListener('pointerup',   handleUp.current)
    if (isNearSnap.current) { isNearSnap.current = false; onSnapChangeRef.current?.(false) }

    if (!wasDragging) { if (rootRef.current) restoreStyle(rootRef.current, savedStyles); return }

    if (placeholderRef?.current) {
      const pr = placeholderRef.current.getBoundingClientRect()
      const rx = e.clientX - offsetX, ry = e.clientY - offsetY
      const overHome = rx + dockW / 2 >= pr.left - SNAP_PADDING_PX && rx + dockW / 2 <= pr.right  + SNAP_PADDING_PX &&
                       ry + dockH / 2 >= pr.top  - SNAP_PADDING_PX && ry + dockH / 2 <= pr.bottom + SNAP_PADDING_PX
      if (overHome) { onReturnRef.current(); return }
    }

    const { x: vx, y: vy } = clamp(e.clientX - offsetX, e.clientY - offsetY, dockW, dockH)
    onDragEndRef.current({ x: vx, y: vy })
  })

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || !rootRef.current) return
    e.preventDefault()
    const el = rootRef.current, rect = el.getBoundingClientRect()
    const savedStyles: SavedStyles = { position: el.style.position, left: el.style.left, top: el.style.top, margin: el.style.margin, zIndex: el.style.zIndex }
    drag.current = { offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top, startClientX: e.clientX, startClientY: e.clientY, dockW: el.offsetWidth, dockH: el.offsetHeight, savedStyles }
    isDragging.current = false
    el.style.position = 'fixed'; el.style.left = `${rect.left}px`; el.style.top = `${rect.top}px`; el.style.margin = '0'; el.style.zIndex = '9999'
    window.addEventListener('pointermove', handleMove.current)
    window.addEventListener('pointerup',   handleUp.current)
  }, [rootRef])

  useEffect(() => {
    const move = handleMove.current, up = handleUp.current
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [])

  return { onPointerDown }
}
