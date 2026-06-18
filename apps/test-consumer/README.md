# test-consumer

A standalone Vite + React app that installs `@deandre-dock/buttons` from the npm
registry (not from the workspace source). Use this to verify that:

1. CSS injection works after installing via npm — no manual `import './style.css'` needed
2. The shadcn variant installs correctly via the shadcn CLI

## Prerequisites

- Node 18+
- npm (used standalone, **not** pnpm workspace — dependencies come from npm registry)

## Setup

```bash
# 1. Install dependencies from npm
npm install

# 2. Run dev server (port 5174)
npm run dev
```

Open `http://localhost:5174`. Check in DevTools → Elements → `:root` that custom
properties like `--dock-color-primary-500` and `--dock-space-4` are defined. If
they are, CSS injection is working correctly.

## Adding the Shadcn variant

The shadcn variant is installed via the CLI and requires Tailwind CSS.

```bash
# 1. Install Tailwind CSS
npm install -D tailwindcss @tailwindcss/vite

# 2. Initialize shadcn (follow the prompts — choose Vite, React, TypeScript)
npx shadcn@latest init

# 3. Add the ButtonDock registry
npx shadcn@latest add https://cdn.jsdelivr.net/npm/@deandre-dock/buttons-shadcn@latest/dist/registry.json
```

After running the CLI, the following files are added to `src/components/`:

- `button-dock.tsx` — the ButtonDock component using shadcn CSS variables
- `use-dock-state.ts` — state machine hook
- `use-drag.ts` — drag/pointer events hook

Then import and use the shadcn `ButtonDock` in `App.tsx`.

## Why standalone (not in pnpm workspace)

The workspace alias in `apps/demo/` points `@deandre-dock/buttons` directly to
`packages/core/src/index.ts`. That bypasses the npm package entirely, so it can
never catch packaging bugs. This app deliberately installs from npm to close that gap.

The `.npmrc` file sets `link-workspace-packages=false` so pnpm (if used from the
root) does not link the local workspace package instead of the npm one.

## After a new publish

```bash
# Bump the version in package.json, then:
npm install
npm run dev
```
