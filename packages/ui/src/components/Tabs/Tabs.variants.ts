import { tv } from 'tailwind-variants'

export const tabsVariants = tv({
  base: 'flex gap-4',
  variants: {
    orientation: { horizontal: 'flex-col', vertical: 'flex-row' },
  },
  defaultVariants: { orientation: 'horizontal' },
})

export const tabListVariants = tv({
  base: 'flex shrink-0 border-border',
  variants: {
    orientation: { horizontal: 'flex-row gap-1 border-b', vertical: 'flex-col gap-1 border-e' },
  },
  defaultVariants: { orientation: 'horizontal' },
})

export const tabVariants = tv({
  base: [
    'inline-flex items-center justify-center px-3 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground',
    'border-transparent transition-colors hover:text-foreground',
    'aria-selected:border-primary aria-selected:text-foreground',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  variants: {
    orientation: { horizontal: '-mb-px border-b-2', vertical: '-me-px justify-start border-e-2' },
  },
  defaultVariants: { orientation: 'horizontal' },
})

export const tabPanelVariants = tv({
  base: 'rounded-md text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
})
