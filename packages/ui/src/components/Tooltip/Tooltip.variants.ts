import { tv } from 'tailwind-variants'

export const tooltipVariants = tv({
  slots: {
    content:
      'z-50 max-w-xs rounded-sm bg-foreground px-2 py-1 text-xs font-medium text-background shadow-md',
    arrow: 'fill-foreground',
  },
})
