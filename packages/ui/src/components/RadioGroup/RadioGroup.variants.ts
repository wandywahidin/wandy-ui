import { tv } from 'tailwind-variants'

export const radioGroupVariants = tv({
  base: 'flex gap-3',
  variants: {
    orientation: { vertical: 'flex-col', horizontal: 'flex-row flex-wrap' },
  },
  defaultVariants: { orientation: 'vertical' },
})

export const radioVariants = tv({
  slots: {
    root: [
      'group inline-flex items-center gap-2 rounded-sm text-sm text-foreground',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ],
    control: [
      'inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border bg-background',
      'group-aria-checked:border-primary',
    ],
    indicator: 'hidden size-2 rounded-full bg-primary group-aria-checked:block',
    label: 'select-none',
  },
})
