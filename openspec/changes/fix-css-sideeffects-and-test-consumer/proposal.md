## Why

`@deandre-dock/buttons` was published with `"sideEffects": false`, which causes consumer bundlers (Vite, Webpack, esbuild) to tree-shake the CSS injection code embedded in `dist/index.js` — so styles never reach the DOM when the package is installed via npm. There is also no way to verify the published package works correctly because the demo uses a workspace alias that bypasses npm entirely.

## What Changes

- Fix `"sideEffects"` in `packages/core/package.json` to declare that the dist entry points inject CSS (they have real side effects)
- Create `apps/test-consumer/` — a standalone Vite + React app that installs `@deandre-dock/buttons` from npm (no workspace alias), serving as the reference consumer test
- The test consumer app also includes a page for the shadcn variant (`@deandre-dock/buttons-shadcn` via the shadcn CLI)

## Capabilities

### New Capabilities

- `npm-consumer-test`: A runnable app that installs and exercises `@deandre-dock/buttons` from the published npm package, verifying that styles load correctly without any manual CSS import

### Modified Capabilities

- `css-auto-load`: The CSS injection approach requires declaring side effects on dist entry points — the requirement "no manual CSS import" now has an additional constraint on `sideEffects` configuration

## Impact

- `packages/core/package.json`: `sideEffects` value changes from `false` to `["./dist/index.js", "./dist/index.cjs"]`
- New app `apps/test-consumer/`: Vite + React, not part of the pnpm workspace build chain, installs `@deandre-dock/buttons` from npm registry
- Triggers a patch release (`1.0.3`) to fix the broken CSS for all existing consumers
- No API changes; no breaking changes
