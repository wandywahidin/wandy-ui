import { tv } from 'tailwind-variants'

export const popoverVariants = tv({
  slots: {
    content: [
      'z-50 w-72 rounded-md border border-border bg-surface p-4 text-sm text-foreground shadow-md',
      'focus-visible:outline-2 focus-visible:outline-ring',
    ],
    arrow: 'fill-surface stroke-border',
  },
})
