---
"@deandre-dock/buttons": patch
---

Fix sideEffects to prevent tree-shaking of CSS injection code

Consumer bundlers (Vite, Webpack, esbuild) were eliminating the CSS injection
function in dist/index.js when `sideEffects: false` was set, causing styles to
never reach the DOM in installed packages. Changed to declare only the dist
entry points as having side effects so bundlers preserve the injection code.
