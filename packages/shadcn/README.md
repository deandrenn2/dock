# @deandre-dock/buttons-shadcn

**Shadcn/ui registry for `ButtonDock`** — the draggable floating action bar that keeps buttons within reach on long pages.

[![npm version](https://img.shields.io/npm/v/@deandre-dock/buttons-shadcn)](https://www.npmjs.com/package/@deandre-dock/buttons-shadcn)
[![license](https://img.shields.io/npm/l/@deandre-dock/buttons-shadcn)](https://github.com/deandrenn2/dock/blob/main/LICENSE)

This is a [shadcn/ui registry](https://ui.shadcn.com/docs/registry) package. Installing it **copies the component source directly into your project** — no runtime npm dependency, full ownership of the code.

---

## Install

```bash
npx shadcn@latest add https://cdn.jsdelivr.net/npm/@deandre-dock/buttons-shadcn@latest/dist/registry.json
```

This copies into your project:

| File                            | Description                               |
| ------------------------------- | ----------------------------------------- |
| `components/ui/button-dock.tsx` | Main component                            |
| `hooks/use-dock-state.ts`       | State machine (docked / floating / fixed) |
| `hooks/use-drag.ts`             | Pointer event drag logic                  |

Uses your existing Shadcn CSS variables (`--background`, `--border`, `--muted`, etc.). No `ThemeProvider` needed.

---

## Usage

```tsx
import { Button } from '@/components/ui/button'
import { ButtonDock } from '@/components/ui/button-dock'

export function MyPage() {
  return (
    <div>
      <ButtonDock layout="block" align="end" sessionStorageKey="my-page-actions">
        <Button onClick={save}>Save</Button>
        <Button variant="outline">Export</Button>
        <Button variant="destructive" size="icon" aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </Button>
      </ButtonDock>

      {/* Your long content */}
    </div>
  )
}
```

---

## Props

### `ButtonDock`

| Prop                | Type                           | Default    | Description                                        |
| ------------------- | ------------------------------ | ---------- | -------------------------------------------------- |
| `children`          | `ReactNode`                    | —          | Buttons to render                                  |
| `showMode`          | `boolean`                      | `false`    | Dev badge showing the current dock mode            |
| `zIndex`            | `number`                       | —          | Stacking level while the dock is detached          |
| `layout`            | `"inline" \| "block"`          | `"inline"` | Inline origin or full-width layout anchor          |
| `align`             | `"start" \| "center" \| "end"` | `"start"`  | Logical alignment inside the anchor                |
| `className`         | `string`                       | —          | Layout classes applied to the visual dock          |
| `style`             | `CSSProperties`                | —          | Inline styles applied to the visual dock           |
| `anchorClassName`   | `string`                       | —          | Layout classes applied to the origin anchor        |
| `anchorStyle`       | `CSSProperties`                | —          | Inline styles applied to the origin anchor         |
| `sessionStorageKey` | `string`                       | —          | Persist mode and position for this browser session |

When `sessionStorageKey` is present, restored fixed positions are constrained to the
viewport on every side. Floating positions use the viewport width and the full document
height.

---

## Behavior

| Action                             | Result                                    |
| ---------------------------------- | ----------------------------------------- |
| Drag a docked or floating dock | **floating** — remains inside its bounds     |
| Use the pin control            | Toggles explicitly between floating/fixed   |
| Drag an already fixed dock     | **fixed** — changes position, not mode       |
| Double-tap handle              | **docked** — returns to original position   |

---

## Not Using Shadcn?

Use [`@deandre-dock/buttons`](https://www.npmjs.com/package/@deandre-dock/buttons) — the standalone version with its own `ThemeProvider`.

## Live Demo

[deandrenn2.github.io/dock](https://deandrenn2.github.io/dock/)

## License

MIT © [dock-buttons contributors](https://github.com/deandrenn2/dock/graphs/contributors)
