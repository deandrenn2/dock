# Spec: demo-base-path

## Requirement: Demo carga en GitHub Pages

La demo SHALL cargar correctamente cuando se sirve desde el sub-path `/dock-buttons/` en `deandrenn2.github.io`.

#### Scenario: Assets cargan sin 404

- **WHEN** el usuario abre `https://deandrenn2.github.io/dock-buttons/`
- **THEN** el JS, CSS e imágenes se cargan sin errores 404 en consola

#### Scenario: Dev server no se ve afectado

- **WHEN** el desarrollador corre `pnpm dev:demo`
- **THEN** la demo es accesible en `http://localhost:5173/` sin sub-path

## Requirement: Storybook se publica junto a la demo

El sitio SHALL incluir la documentación interactiva de Storybook bajo el sub-path
`/dock-buttons/storybook/`.

#### Scenario: Storybook carga desde la navegación

- **WHEN** el usuario abre el enlace Storybook de la demo
- **THEN** se abre `https://deandrenn2.github.io/dock-buttons/storybook/` en una pestaña nueva

#### Scenario: Repositorio accesible desde la demo

- **WHEN** el usuario activa el icono de GitHub en la barra de navegación
- **THEN** se abre `https://github.com/deandrenn2/dock-buttons` en una pestaña nueva

## Requirement: README no rompe Jekyll

El README.md SHALL renderizarse sin errores en un entorno Jekyll/Liquid.

#### Scenario: Bloques de código con llaves dobles

- **WHEN** Jekyll procesa README.md
- **THEN** los bloques de código que contienen `{{` no producen errores de sintaxis Liquid

#### Scenario: README raíz no contiene tags Liquid en la versión monorepo

- **WHEN** el nuevo README raíz (monorepo-focused) es procesado por Jekyll
- **THEN** no contiene bloques de código con `{{` que requieran escape Liquid, porque el contenido consumer (con ThemeProvider) se mueve a `packages/core/README.md`
