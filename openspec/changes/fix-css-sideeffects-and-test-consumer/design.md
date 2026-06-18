## Context

`vite-plugin-css-injected-by-js` embeds a self-executing CSS injection function at the top of `dist/index.js`. When the published package declares `"sideEffects": false`, consumers' bundlers assume that importing the package has no observable effect and may eliminate the injection code before it runs. The result: CSS custom properties (`--dock-color-*`, `--dock-space-*`, etc.) are never added to the DOM, and every component renders unstyled.

The workspace alias in `apps/demo/` points directly to source TypeScript, bypassing the dist entirely, so this failure mode is invisible during local development.

## Goals / Non-Goals

**Goals:**
- CSS injection runs reliably for all consumers, regardless of their bundler or tree-shaking settings
- A runnable app confirms the fix end-to-end using the actual published npm package
- The shadcn variant is also covered in the test consumer

**Non-Goals:**
- Changing the CSS injection strategy (plugin stays as-is)
- Adding the test consumer to CI automated tests (manual verification is sufficient for now)
- Supporting SSR or non-browser environments

## Decisions

### D1: `sideEffects: ["./dist/index.js", "./dist/index.cjs"]`

**Chosen over `"sideEffects": false`** because the dist entry points execute DOM-modifying code (CSS injection) on import. Declaring `false` is only correct when imports are guaranteed to be pure. The `["./dist/index.js", "./dist/index.cjs"]` array tells bundlers "these two files have side effects; everything else can be tree-shaken."

**Chosen over reverting to `["**/*.css"]`** because there are no CSS files in the dist — CSS is already embedded in JS. The old value no longer maps to anything real.

### D2: `apps/test-consumer/` as a standalone Vite app outside the pnpm workspace

**Chosen over a page inside `apps/demo/`** because the demo's Vite config aliases `@deandre-dock/buttons` to the workspace source — it can never test the published dist. A standalone app installs from the npm registry with no overrides.

**Structure:**
```
apps/test-consumer/
  package.json          ← dependencies: @deandre-dock/buttons (npm, not workspace:*)
  vite.config.ts        ← no alias overrides
  index.html
  src/
    main.tsx            ← ThemeProvider wrapping the app
    App.tsx             ← two sections: core + shadcn variant
    components/
      ui/               ← shadcn CLI drops files here
      button-dock.tsx   ← installed by shadcn CLI
```

The app is NOT added to the root `pnpm-workspace.yaml` to avoid the workspace protocol resolving the dependency to the local package.

### D3: Shadcn variant tested via CLI install inside test-consumer

Running `npx shadcn@latest add <registry-url>` inside `apps/test-consumer/` copies the component source. This is the exact consumer flow documented in the README, so it validates both the registry JSON and the CLI install path.

## Risks / Trade-offs

- **Test consumer can go stale**: After each publish, a developer must manually bump the version in `apps/test-consumer/package.json` and re-run `npm install`. → Mitigation: document this in the app's README; long-term add a CI job.
- **`sideEffects` array uses dist paths**: If the build output file names change, the declaration silently becomes wrong. → Mitigation: keep `fileName` in `vite.config.ts` stable; add a comment linking the two.
- **Shadcn install is manual during setup**: The CLI must be run by hand after cloning. → Mitigation: document the setup steps in `apps/test-consumer/README.md`.

## Migration Plan

1. Patch `packages/core/package.json` — `sideEffects` value only, no API change
2. Create changeset → publish `@deandre-dock/buttons@1.0.3`
3. Create `apps/test-consumer/`, install the newly published 1.0.3
4. Run shadcn CLI inside test-consumer to install button-dock
5. Run `pnpm dev` in test-consumer and confirm styles load
