# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev:demo          # Demo app at http://localhost:5173
pnpm dev:storybook     # Storybook at http://localhost:6006

# Build
pnpm build:core        # Build the @deandre-dock/buttons library
pnpm build:demo        # Build the demo application

# Quality
pnpm test              # Run Vitest (core package)
pnpm test:watch        # Watch mode (run from packages/core)
pnpm lint              # ESLint across all packages
pnpm format            # Prettier formatting

# Release
pnpm changeset         # Create a changeset entry (patch/minor/major)
pnpm release           # Build + publish to npm
```

## Monorepo Layout

```
packages/
  core/        @deandre-dock/buttons — the publishable library
  shadcn/      @deandre-dock/buttons-shadcn — Shadcn registry variant
apps/
  demo/        Vite + React + Tailwind demo (gradebook UI)
  storybook/   Storybook 8.6 component docs
```

All packages use `pnpm` (v11.1.2). The root `tsconfig.base.json` sets path alias `@deandre-dock/buttons` → `packages/core/src` for local development.

## Architecture: Feature-Sliced Design (FSD)

`packages/core/src/` follows strict FSD. Imports only flow **downward**:

```
shared ← entities ← features ← widgets
```

| Layer | Content |
|-------|---------|
| `shared/` | CSS tokens, `ThemeProvider`, `cn()` utility, `applyTheme()` |
| `entities/` | `Button` — dumb presentational component only |
| `features/` | `useDrag` (pointer events, snapping), `useDockState` (state machine) |
| `widgets/` | `ButtonDock` — composes the above into the final deliverable |

Never import from a higher layer into a lower one (e.g., no `features` import inside `entities`).

## Key Components

**`ButtonDock`** (`widgets/ButtonDock`) — the main export. A draggable, dockable floating button tray. States: `docked → dragging → floating → fixed`. Renders via a portal when detached. Near-edge detection (48 px) auto-switches to `fixed` mode.

**`Button`** (`entities/button`) — primitive button with `variant` (primary | secondary | ghost | danger), `size` (xs | sm | md | lg), loading spinner, and icon support.

**`useDrag`** (`features/drag`) — handles all pointer events, 6 px drag threshold, 8 px viewport edge clamping, snap-back detection.

**`useDockState`** (`features/position`) — Redux-style reducer managing dock state and position.

## Design Tokens

All visual values live in `shared/tokens/` as CSS custom properties. Never hardcode colors, spacing, or radii — always reference the tokens. The `Theme` type (`shared/lib/theme.ts`) exposes `colors`, `radius`, and `fontFamily` for consumers.

## Library Build

The core package builds dual-format (`dist/index.js` ESM + `dist/index.cjs` CJS) via `vite-plugin-dts` with `rollupTypes: true`. React and React-DOM are externalized. The single public entry point is `packages/core/src/index.ts`.

## Versioning & Publishing

This project uses [Changesets](https://github.com/changesets/changesets). Before merging a feature or fix:
1. `pnpm changeset` — select bump type and describe the change
2. Commit the generated `.changeset/*.md` file with the code
3. CI creates a "Version Packages" PR; merging it triggers npm publish

## Code Style

- **No semicolons**, single quotes, 2-space indent, trailing commas, 100-char line width (see `.prettierrc`)
- TypeScript strict mode — all strict flags enabled, no `any`
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
- Branch prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`
- Every new component needs: implementation + Storybook story + Vitest test
