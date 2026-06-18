## MODIFIED Requirements

### Requirement: Estilos cargan sin importación manual
`@deandre-dock/buttons` SHALL aplicar sus estilos al DOM automáticamente cuando cualquier componente del paquete es importado en una aplicación React, sin que el consumidor deba importar archivos CSS adicionales. The package's `sideEffects` field SHALL declare the dist entry points as having side effects so that consumer bundlers do not tree-shake the CSS injection code.

#### Scenario: Importación mínima renderiza componentes con estilos
- **WHEN** un consumidor importa `import { Button } from '@deandre-dock/buttons'` sin ninguna otra importación de CSS
- **THEN** el componente `Button` se renderiza con colores, spacing y tipografía correctos definidos por los tokens del paquete

#### Scenario: Variables CSS disponibles en el DOM
- **WHEN** cualquier componente de `@deandre-dock/buttons` está montado en el DOM
- **THEN** las custom properties `--dock-color-*`, `--dock-space-*`, `--dock-font-*` están definidas en `:root` o en el scope del componente

#### Scenario: No se requiere importación separada de CSS
- **WHEN** se consulta la documentación de instalación del paquete
- **THEN** el README NO lista un paso de `import '.../style.css'` como requisito para que los estilos funcionen

#### Scenario: CSS injection survives consumer tree-shaking
- **WHEN** a consumer's bundler has tree-shaking enabled and imports only `Button` from `@deandre-dock/buttons`
- **THEN** the CSS injection code in `dist/index.js` is NOT eliminated and the styles reach the DOM
