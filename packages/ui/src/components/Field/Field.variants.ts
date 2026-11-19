import { tv } from 'tailwind-variants'

export const fieldVariants = tv({
  slots: {
    root: 'flex flex-col gap-1.5',
    label: 'text-sm font-medium text-foreground',
    required: 'ms-0.5 text-danger',
    description: 'text-sm text-muted-foreground',
    error: 'text-sm font-medium text-danger',
  },
  variants: {
    disabled: { true: { label: 'opacity-50' } },
  },
})
