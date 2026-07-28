import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ButtonDock } from './ButtonDock'

describe('ButtonDock layout', () => {
  it('removes the hidden placeholder from the docked layout', () => {
    const html = renderToStaticMarkup(
      <ButtonDock>
        <button>Guardar</button>
      </ButtonDock>,
    )

    expect(html).toContain('data-dock-placeholder="true"')
    expect(html).toContain('hidden=""')
    expect(html).toContain('aria-hidden="true"')
  })

  it.each([
    ['inline', 'start'],
    ['block', 'start'],
    ['block', 'center'],
    ['block', 'end'],
  ] as const)('renders layout="%s" with align="%s"', (layout, align) => {
    const html = renderToStaticMarkup(
      <ButtonDock layout={layout} align={align}>
        <button>Guardar</button>
      </ButtonDock>,
    )

    expect(html).toContain(`data-layout="${layout}"`)
    expect(html).toContain(`data-align="${align}"`)
  })

  it('forwards customization to the anchor and dock separately', () => {
    const html = renderToStaticMarkup(
      <ButtonDock
        anchorClassName="consumer-anchor"
        anchorStyle={{ marginTop: 12 }}
        className="consumer-dock"
        style={{ color: 'red' }}
      >
        <button>Guardar</button>
      </ButtonDock>,
    )

    expect(html).toContain('consumer-anchor')
    expect(html).toContain('margin-top:12px')
    expect(html).toContain('consumer-dock')
    expect(html).toContain('color:red')
  })
})
