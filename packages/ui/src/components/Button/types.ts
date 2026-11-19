import type { UiOverrides } from '../../types'

export interface ButtonProps {
  variant?: 'solid' | 'outline' | 'ghost'
  intent?: 'primary' | 'neutral' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  /** Shows a spinner, sets `aria-busy`, and swallows clicks while keeping focus. */
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  ui?: UiOverrides<'root' | 'spinner'>
}

export interface IconButtonProps extends ButtonProps {
  /** Accessible name. Required: an icon alone has no text alternative. */
  label: string
}
