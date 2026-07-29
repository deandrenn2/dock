# @deandre-dock/buttons

## 1.1.0

### Minor Changes

- 889ea69: Add configurable inline and block anchors with logical start, center, and end alignment to
  ButtonDock. Hidden dock placeholders no longer reserve layout space while the dock is attached.
  Dragging a fixed dock now preserves its fixed positioning mode.
  Add opt-in session storage persistence with safe viewport and document-bound restoration.
  Dragging near a viewport edge no longer changes a floating dock to fixed automatically. Fixed
  docks remain bounded by the viewport, while floating docks use viewport-width and document-height
  boundaries.

## 1.0.4

### Patch Changes

- f8b9b03: Fix CSS token variables never loading in consumers

  The `colors.css`, `spacing.css`, and `typography.css` files defining `:root`
  CSS custom properties were being tree-shaken by Rollup during the library build
  because they were imported as side-effect-only imports with no exports. Rollup
  silently dropped the entire `tokens/index.ts` module.

  Fixed by exporting an `injectTokens()` function from the tokens module and
  calling it explicitly from the package entry point (`src/index.ts`), so Rollup
  cannot drop it. The token CSS is imported with `?inline` to ensure Rollup
  includes the CSS string as a JavaScript value rather than a CSS file emission.

  This is why `--dock-color-primary-500`, `--dock-space-*`, and all other design
  tokens were undefined in installed packages, causing every component to render
  without colors, borders, or spacing.

## 1.0.3

### Patch Changes

- 3d6f7a8: Fix sideEffects to prevent tree-shaking of CSS injection code

  Consumer bundlers (Vite, Webpack, esbuild) were eliminating the CSS injection
  function in dist/index.js when `sideEffects: false` was set, causing styles to
  never reach the DOM in installed packages. Changed to declare only the dist
  entry points as having side effects so bundlers preserve the injection code.

## 1.0.2

### Patch Changes

- 4b7579e: Add MIT license field, npm keywords, homepage, and rewrite READMEs in English for better npm discoverability

## 1.0.1

### Patch Changes

- 4c5a01d: bugfix styles buttons core

## 1.0.0

### Major Changes

- 08b093d: Initial version of buttons drag and drop in container
