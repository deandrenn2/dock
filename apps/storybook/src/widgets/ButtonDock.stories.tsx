import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'
import { Button, ButtonDock } from '@deandre-dock/buttons'

const meta: Meta<typeof ButtonDock> = {
  title: 'Widgets/ButtonDock',
  component: ButtonDock,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div
        style={{ minHeight: '200px', padding: '2rem', background: '#f8fafc', borderRadius: '8px' }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ButtonDock>

export const Default: Story = {
  args: { showMode: true },
  render: (args) => (
    <ButtonDock {...args}>
      <Button variant="primary">Generar</Button>
      <Button variant="secondary">Guardar</Button>
      <Button variant="danger">Eliminar</Button>
    </ButtonDock>
  ),
}

export const WithIcons: Story = {
  args: { showMode: true },
  render: (args) => (
    <ButtonDock {...args}>
      <Button variant="primary">Acción 1</Button>
      <Button variant="ghost">Acción 2</Button>
    </ButtonDock>
  ),
}

function LayoutDock(props: ComponentProps<typeof ButtonDock>) {
  return (
    <ButtonDock {...props}>
      <Button variant="primary">Generar</Button>
      <Button variant="secondary">Guardar</Button>
      <Button variant="danger">Eliminar</Button>
    </ButtonDock>
  )
}

export const Inline: Story = {
  render: () => <LayoutDock layout="inline" align="start" showMode />,
}

export const BlockStart: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: '2rem' }}>
      <LayoutDock layout="block" align="start" showMode />
    </div>
  ),
}

export const BlockCenter: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: '2rem' }}>
      <LayoutDock layout="block" align="center" showMode />
    </div>
  ),
}

export const BlockEnd: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ padding: '2rem' }}>
      <LayoutDock layout="block" align="end" showMode />
    </div>
  ),
}
