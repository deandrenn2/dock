# @deandre-dock/buttons-shadcn

## 1.1.0

### Minor Changes

- 889ea69: Add configurable inline and block anchors with logical start, center, and end alignment to
  ButtonDock. Hidden dock placeholders no longer reserve layout space while the dock is attached.
  Dragging a fixed dock now preserves its fixed positioning mode.
  Add opt-in session storage persistence with safe viewport and document-bound restoration.
  Dragging near a viewport edge no longer changes a floating dock to fixed automatically. Fixed
  docks remain bounded by the viewport, while floating docks use viewport-width and document-height
  boundaries.

## 1.0.2

### Patch Changes

- 4b7579e: Add MIT license field, npm keywords, homepage, and rewrite READMEs in English for better npm discoverability

## 1.0.1

### Patch Changes

- 4c5a01d: bugfix styles buttons core

## 1.0.0

### Major Changes

- 08b093d: Initial version of buttons drag and drop in container
