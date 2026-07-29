'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { useDockState } from '../hooks/use-dock-state'
import { useDrag } from '../hooks/use-drag'
import type { DockMode, DockState, Position } from '../hooks/use-dock-state'

const EDGE_MARGIN = 8

function resolveDropMode(originMode: DockMode): DockMode {
  return originMode === 'fixed' ? 'fixed' : 'floating'
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

function parsePersistedDockState(value: string | null): DockState | null {
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

function serializeDockState(mode: DockMode, position: Position | null) {
  if (mode === 'dragging') return null
  return JSON.stringify({
    version: 1,
    mode,
    position: mode === 'docked' ? null : position,
  })
}

function clampPositionToBounds(
  position: Position,
  item: { width: number; height: number },
  bounds: { width: number; height: number },
): Position {
  const maxX = Math.max(EDGE_MARGIN, bounds.width - item.width - EDGE_MARGIN)
  const maxY = Math.max(EDGE_MARGIN, bounds.height - item.height - EDGE_MARGIN)

  return {
    x: Math.max(EDGE_MARGIN, Math.min(position.x, maxX)),
    y: Math.max(EDGE_MARGIN, Math.min(position.y, maxY)),
  }
}

function clampToViewport(x: number, y: number, w: number, h: number): Position {
  return clampPositionToBounds(
    { x, y },
    { width: w, height: h },
    { width: window.innerWidth, height: window.innerHeight },
  )
}

function getDocumentBounds() {
  const html = document.documentElement
  const body = document.body

  return {
    width: Math.max(
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth,
      body?.clientWidth ?? 0,
      body?.scrollWidth ?? 0,
      body?.offsetWidth ?? 0,
    ),
    height: Math.max(
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
      body?.clientHeight ?? 0,
      body?.scrollHeight ?? 0,
      body?.offsetHeight ?? 0,
    ),
  }
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function DragDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="5.5" cy="4" r="1.2" fill="currentColor" />
      <circle cx="5.5" cy="8" r="1.2" fill="currentColor" />
      <circle cx="5.5" cy="12" r="1.2" fill="currentColor" />
      <circle cx="10.5" cy="4" r="1.2" fill="currentColor" />
      <circle cx="10.5" cy="8" r="1.2" fill="currentColor" />
      <circle cx="10.5" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12L12 4l9 8" />
      <path d="M9 21V12h6v9" />
      <path d="M3 21h18" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  )
}

function UnpinIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="2" y1="2" x2="22" y2="22" />
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h12" />
      <path d="M15 9.34V6h1a2 2 0 0 0 0-4H7.89" />
    </svg>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DockHandle({
  onPointerDown,
}: {
  onPointerDown: React.PointerEventHandler<HTMLDivElement>
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center size-7 rounded-sm shrink-0',
        'text-muted-foreground cursor-grab touch-none',
        'hover:bg-accent hover:text-accent-foreground active:cursor-grabbing transition-colors',
      )}
      onPointerDown={onPointerDown}
      role="button"
      tabIndex={0}
      aria-label="Arrastrar barra"
    >
      <DragDotsIcon />
    </div>
  )
}

const iconBtnBase = cn(
  'flex items-center justify-center size-7 rounded-sm shrink-0',
  'border-none bg-transparent p-0 cursor-pointer touch-none transition-colors',
)

// ── ButtonDock ────────────────────────────────────────────────────────────────

export interface ButtonDockProps {
  children: React.ReactNode
  showMode?: boolean
  zIndex?: number
  layout?: 'inline' | 'block'
  align?: 'start' | 'center' | 'end'
  className?: string
  style?: React.CSSProperties
  anchorClassName?: string
  anchorStyle?: React.CSSProperties
  sessionStorageKey?: string
}

export function ButtonDock({
  children,
  showMode = false,
  zIndex,
  layout = 'inline',
  align = 'start',
  className,
  style,
  anchorClassName,
  anchorStyle,
  sessionStorageKey,
}: ButtonDockProps) {
  const { state, startDrag, commit, returnToDock, restore } = useDockState()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const placeholderRef = React.useRef<HTMLDivElement>(null)
  const currentModeRef = React.useRef<DockMode>(state.mode)
  const dragOriginModeRef = React.useRef<DockMode>('docked')
  const restoredDocumentBoundsRef = React.useRef<ReturnType<typeof getDocumentBounds> | null>(null)
  const [placeholderSize, setPlaceholderSize] = React.useState<{ w: number; h: number } | null>(
    null,
  )
  const [isNearSnap, setIsNearSnap] = React.useState(false)
  const [persistenceReadyKey, setPersistenceReadyKey] = React.useState<string | null>(null)
  const measuredRef = React.useRef(false)

  const isDocked = state.mode === 'docked'
  const isDragging = state.mode === 'dragging'
  const isFloating = state.mode === 'floating'
  const isFixed = state.mode === 'fixed'
  const isDetached = !isDocked
  currentModeRef.current = state.mode

  React.useLayoutEffect(() => {
    if (!isDocked) {
      measuredRef.current = false
      return
    }
    if (measuredRef.current || !rootRef.current) return
    measuredRef.current = true
    setPlaceholderSize({ w: rootRef.current.offsetWidth, h: rootRef.current.offsetHeight })
  }, [isDocked])

  React.useLayoutEffect(() => {
    if (!sessionStorageKey) {
      restoredDocumentBoundsRef.current = null
      setPersistenceReadyKey(null)
      return
    }

    try {
      const restoredState = parsePersistedDockState(sessionStorage.getItem(sessionStorageKey))
      if (restoredState) {
        restoredDocumentBoundsRef.current =
          restoredState.mode === 'floating' ? getDocumentBounds() : null
        restore(restoredState)
      }
    } catch {
      restoredDocumentBoundsRef.current = null
    }

    setPersistenceReadyKey(sessionStorageKey)
  }, [restore, sessionStorageKey])

  React.useEffect(() => {
    if (!sessionStorageKey || persistenceReadyKey !== sessionStorageKey) return
    const serialized = serializeDockState(state.mode, state.position)
    if (!serialized) return

    try {
      sessionStorage.setItem(sessionStorageKey, serialized)
    } catch {
      // Storage can be disabled or full; the dock remains fully functional.
    }
  }, [persistenceReadyKey, sessionStorageKey, state])

  // Post-commit boundary clamp — correct position using actual rendered size
  // before the browser paints (runs synchronously after commit re-render).
  React.useLayoutEffect(() => {
    if (isDragging || isDocked || !state.position || !rootRef.current) return
    const { width: w, height: h } = rootRef.current.getBoundingClientRect()
    if (w === 0) return
    const documentBounds = restoredDocumentBoundsRef.current ?? getDocumentBounds()
    const bounds = isFixed
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: window.innerWidth, height: documentBounds.height }
    const positionForClamp = isFixed
      ? state.position
      : { x: state.position.x - window.scrollX, y: state.position.y }
    const boundedPosition = clampPositionToBounds(
      positionForClamp,
      { width: w, height: h },
      bounds,
    )
    const clamped = isFixed
      ? boundedPosition
      : { x: boundedPosition.x + window.scrollX, y: boundedPosition.y }

    if (
      Math.round(clamped.x) !== Math.round(state.position.x) ||
      Math.round(clamped.y) !== Math.round(state.position.y)
    ) {
      commit(clamped, isFixed ? 'fixed' : 'floating')
      return
    }

    restoredDocumentBoundsRef.current = null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.position, state.mode])

  const handleDragStart = React.useCallback(
    (pos: Position) => {
      dragOriginModeRef.current = currentModeRef.current
      startDrag(pos)
    },
    [startDrag],
  )

  const handleDragEnd = React.useCallback(
    (viewportPos: Position) => {
      const mode = resolveDropMode(dragOriginModeRef.current)
      commit(
        mode === 'fixed'
          ? viewportPos
          : { x: viewportPos.x + window.scrollX, y: viewportPos.y + window.scrollY },
        mode,
      )
    },
    [commit],
  )

  const { onPointerDown } = useDrag({
    rootRef,
    placeholderRef,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onReturnToDock: returnToDock,
    onSnapChange: setIsNearSnap,
  })

  // Toggle floating ↔ fixed with proper coordinate conversion so the dock
  // stays at the same visual position on screen.
  const handleToggleMode = React.useCallback(() => {
    if (!state.position || !rootRef.current) return
    const w = rootRef.current.offsetWidth,
      h = rootRef.current.offsetHeight
    if (isFloating) {
      const clamped = clampToViewport(
        state.position.x - window.scrollX,
        state.position.y - window.scrollY,
        w,
        h,
      )
      commit(clamped, 'fixed')
    } else if (isFixed) {
      commit(
        { x: state.position.x + window.scrollX, y: state.position.y + window.scrollY },
        'floating',
      )
    }
  }, [state, isFloating, isFixed, commit])

  function getPositionStyle(): React.CSSProperties {
    if (isDocked) return {}
    if (!state.position) return {}
    const z = zIndex ?? (isDragging ? 9999 : 50)
    if (isDragging)
      return {
        position: 'fixed',
        left: state.position.x,
        top: state.position.y,
        margin: 0,
        zIndex: z,
      }
    return {
      position: isFixed ? 'fixed' : 'absolute',
      left: state.position.x,
      top: state.position.y,
      margin: 0,
      zIndex: z,
    }
  }

  const sep = <div className="w-px h-5 bg-border shrink-0" aria-hidden />

  const dockEl = (
    <div
      ref={rootRef}
      data-dock-root
      data-mode={state.mode}
      style={{ ...style, ...getPositionStyle() }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 w-max',
        'bg-background border border-border rounded-lg',
        'shadow-md select-none font-sans transition-[box-shadow,border-color]',
        isDetached && 'shadow-xl',
        isDragging && 'shadow-2xl cursor-grabbing',
        isNearSnap && 'ring-2 ring-primary border-primary',
        className,
      )}
    >
      <DockHandle onPointerDown={onPointerDown} />
      {sep}
      {children}
      {isDetached && !isDragging && (
        <>
          {sep}
          <button
            className={cn(
              iconBtnBase,
              isFixed
                ? 'text-primary hover:bg-primary/10'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
            onClick={handleToggleMode}
            aria-label={isFixed ? 'Desfijar — desplazar con el scroll' : 'Fijar en pantalla'}
            title={isFixed ? 'Desfijar — desplazar con el scroll' : 'Fijar en pantalla'}
          >
            {isFixed ? <UnpinIcon /> : <PinIcon />}
          </button>
          <button
            className={cn(
              iconBtnBase,
              'text-muted-foreground hover:bg-primary/10 hover:text-primary',
            )}
            onClick={returnToDock}
            aria-label="Volver al lugar de origen"
            title="Volver al lugar de origen"
          >
            <HomeIcon />
          </button>
        </>
      )}
      {showMode && (
        <span className="text-xs text-muted-foreground font-mono min-w-[4.5rem]">{state.mode}</span>
      )}
    </div>
  )

  const anchorEl = (
    <div
      data-dock-anchor
      data-layout={layout}
      data-align={align}
      className={cn(
        layout === 'block' ? 'flex w-full' : 'inline-flex',
        align === 'start' && 'justify-start',
        align === 'center' && 'justify-center',
        align === 'end' && 'justify-end',
        anchorClassName,
      )}
      style={anchorStyle}
    >
      <div
        ref={placeholderRef}
        data-dock-placeholder
        hidden={isDocked}
        aria-hidden={isDocked}
        className={cn(
          'items-center justify-center border-2 border-dashed rounded-lg',
          'transition-all duration-150',
          isDetached
            ? 'inline-flex opacity-100 pointer-events-auto'
            : 'hidden opacity-0 pointer-events-none',
          isNearSnap
            ? 'border-primary bg-primary/8 shadow-[0_0_0_4px_hsl(var(--primary)/0.15)] animate-pulse'
            : 'border-border bg-muted/30',
        )}
        style={
          placeholderSize ? { width: placeholderSize.w, height: placeholderSize.h } : undefined
        }
      >
        {isDetached && (
          <button
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
              'text-muted-foreground bg-transparent border-none cursor-pointer',
              'hover:text-primary hover:bg-primary/10 transition-colors',
            )}
            onClick={returnToDock}
          >
            <HomeIcon />
            <span>Restaurar aquí</span>
          </button>
        )}
      </div>
      {isDocked && dockEl}
    </div>
  )

  return (
    <>
      {anchorEl}
      {isDetached && createPortal(dockEl, document.body)}
    </>
  )
}
