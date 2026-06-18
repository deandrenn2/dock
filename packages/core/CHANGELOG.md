# @deandre-dock/buttons

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
