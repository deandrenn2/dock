import { Button, ButtonDock } from '@deandre-dock/buttons'

export default function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>@deandre-dock/buttons — test consumer</h1>
      <p>
        This app installs <code>@deandre-dock/buttons</code> from npm (not from the
        workspace source). If the ButtonDock below renders with correct colors and
        spacing, CSS injection is working correctly.
      </p>

      <section style={{ marginTop: '2rem' }}>
        <h2>Core package</h2>
        <p>Open DevTools → Elements → :root and look for <code>--dock-color-primary-500</code>.</p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" loading>Loading</Button>
        </div>

        <ButtonDock showMode>
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </ButtonDock>
      </section>
    </div>
  )
}
