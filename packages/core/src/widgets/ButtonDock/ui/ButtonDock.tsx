import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../shared/lib/cn'
import {
  clampFloatingPositionToBounds,
  clampPositionToBounds,
  parsePersistedDockState,
  serializeDockState,
} from '../../../features/position/model/persistence'
import { resolveDropMode } from '../../../features/position/model/resolveDropMode'
import { useDockState } from '../../../features/position/model/useDockState'
import { useDrag } from '../../../features/drag/model/useDrag'
import { DockHandle } from './DockHandle'
import styles from './ButtonDock.module.css'
import type { DockMode, Position } from '../../../features/position/model/types'

export type ButtonDockProps = {
  children: ReactNode
  showMode?: boolean
  zIndex?: number
  layout?: 'inline' | 'block'
  align?: 'start' | 'center' | 'end'
  className?: string
  style?: CSSProperties
  anchorClassName?: string
  anchorStyle?: CSSProperties
  sessionStorageKey?: string
}

const EDGE_MARGIN = 8

function clampViewport(vx: number, vy: number, w: number, h: number): Position {
  return clampPositionToBounds(
    { x: vx, y: vy },
    { width: w, height: h },
    { width: window.innerWidth, height: window.innerHeight },
    EDGE_MARGIN,
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
  const rootRef = useRef<HTMLDivElement>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)
  const currentModeRef = useRef<DockMode>(state.mode)
  const dragOriginModeRef = useRef<DockMode>('docked')
  const restoredDocumentBoundsRef = useRef<ReturnType<typeof getDocumentBounds> | null>(null)
  const [placeholderSize, setPlaceholderSize] = useState<{ w: number; h: number } | null>(null)
  const [isNearSnap, setIsNearSnap] = useState(false)
  const [persistenceReadyKey, setPersistenceReadyKey] = useState<string | null>(null)
  const measuredRef = useRef(false)

  const isDocked = state.mode === 'docked'
  const isDragging = state.mode === 'dragging'
  const isFloating = state.mode === 'floating'
  const isFixed = state.mode === 'fixed'
  const isDetached = !isDocked
  currentModeRef.current = state.mode

  // ── Measure placeholder once while docked ──────────────────────────────────
  useLayoutEffect(() => {
    if (!isDocked) {
      measuredRef.current = false
      return
    }
    if (measuredRef.current || !rootRef.current) return
    measuredRef.current = true
    setPlaceholderSize({ w: rootRef.current.offsetWidth, h: rootRef.current.offsetHeight })
  }, [isDocked])

  useLayoutEffect(() => {
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

  useEffect(() => {
    if (!sessionStorageKey || persistenceReadyKey !== sessionStorageKey) return
    const serialized = serializeDockState(state)
    if (!serialized) return

    try {
      sessionStorage.setItem(sessionStorageKey, serialized)
    } catch {
      // Storage can be disabled or full; the dock remains fully functional.
    }
  }, [persistenceReadyKey, sessionStorageKey, state])

  // ── Post-commit boundary clamp (runs before browser paint) ────────────────
  // useDrag captures dockW at pointerdown (before extra buttons render), so it
  // may undercount. Here we re-check with the real rendered size and fix it.
  useLayoutEffect(() => {
    if (isDragging || isDocked || !state.position || !rootRef.current) return
    const { width: w, height: h } = rootRef.current.getBoundingClientRect()
    if (w === 0) return

    const documentBounds = restoredDocumentBoundsRef.current ?? getDocumentBounds()
    const clamped = isFixed
      ? clampPositionToBounds(
          state.position,
          { width: w, height: h },
          { width: window.innerWidth, height: window.innerHeight },
        )
      : clampFloatingPositionToBounds(
          state.position,
          { width: w, height: h },
          {
            viewportWidth: window.innerWidth,
            documentHeight: documentBounds.height,
            scrollX: window.scrollX,
          },
        )

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

  const handleDragStart = useCallback(
    (pos: Position) => {
      dragOriginModeRef.current = currentModeRef.current
      startDrag(pos)
    },
    [startDrag],
  )

  const handleDragEnd = useCallback(
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

  const handleToggleMode = useCallback(() => {
    if (!state.position || !rootRef.current) return
    const { width: w, height: h } = rootRef.current.getBoundingClientRect()
    if (isFloating) {
      const { x, y } = clampViewport(
        state.position.x - window.scrollX,
        state.position.y - window.scrollY,
        w,
        h,
      )
      commit({ x, y }, 'fixed')
    } else if (isFixed) {
      commit(
        { x: state.position.x + window.scrollX, y: state.position.y + window.scrollY },
        'floating',
      )
    }
  }, [state, isFloating, isFixed, commit])

  function getPositionStyle(): CSSProperties {
    if (isDocked) return {}
    if (!state.position) return {}
    const z = zIndex ?? (isDragging ? 9999 : 1000)
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

  const dockEl = (
    <div
      ref={rootRef}
      data-dock-root
      data-mode={state.mode}
      style={{ ...style, ...getPositionStyle() }}
      className={cn(
        styles.root,
        isDetached && styles.detached,
        isDragging && styles.dragging,
        isNearSnap && styles.snapping,
        className,
      )}
    >
      <DockHandle onPointerDown={onPointerDown} />
      <div className={styles.divider} aria-hidden />
      {children}
      {isDetached && !isDragging && (
        <>
          <div className={styles.divider} aria-hidden />
          <button
            className={cn(styles.iconBtn, isFixed && styles.pinBtn)}
            onClick={handleToggleMode}
            aria-label={isFixed ? 'Desfijar — desplazar con el scroll' : 'Fijar en pantalla'}
            title={isFixed ? 'Desfijar — desplazar con el scroll' : 'Fijar en pantalla'}
          >
            {isFixed ? <UnpinIcon /> : <PinIcon />}
          </button>
          <button
            className={cn(styles.iconBtn, styles.homeBtn)}
            onClick={returnToDock}
            aria-label="Volver al lugar de origen"
            title="Volver al lugar de origen"
          >
            <HomeIcon />
          </button>
        </>
      )}
      {showMode && <span className={styles.modeBadge}>{state.mode}</span>}
    </div>
  )

  const anchorEl = (
    <div
      data-dock-anchor
      data-layout={layout}
      data-align={align}
      className={cn(
        styles.anchor,
        layout === 'block' && styles.anchorBlock,
        align === 'start' && styles.alignStart,
        align === 'center' && styles.alignCenter,
        align === 'end' && styles.alignEnd,
        anchorClassName,
      )}
      style={anchorStyle}
    >
      <div
        ref={placeholderRef}
        data-dock-placeholder
        hidden={isDocked}
        className={cn(
          styles.placeholder,
          isDetached && styles.visible,
          isNearSnap && styles.snapActive,
        )}
        aria-hidden={isDocked}
        style={
          placeholderSize ? { width: placeholderSize.w, height: placeholderSize.h } : undefined
        }
      >
        {isDetached && (
          <button
            className={styles.placeholderBtn}
            onClick={returnToDock}
            aria-label="Restaurar panel aquí"
            title="Restaurar panel aquí"
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
