---
"@deandre-dock/buttons": patch
---

Fix CSS token variables never loading in consumers

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
