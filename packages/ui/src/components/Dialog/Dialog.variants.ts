import { tv } from 'tailwind-variants'

export const dialogVariants = tv({
  slots: {
    overlay: 'fixed inset-0 z-50 bg-foreground/40',
    content: [
      'fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col',
      'gap-4 overflow-y-auto rounded-lg border border-border bg-surface p-6 text-foreground shadow-lg',
      'focus-visible:outline-2 focus-visible:outline-ring',
    ],
    header: 'flex items-start justify-between gap-4',
    title: 'text-lg font-semibold',
    description: 'mt-1 text-sm text-muted-foreground',
    body: 'text-sm',
    footer: 'flex justify-end gap-2',
    close: '-me-2 -mt-2 shrink-0',
  },
  variants: {
    size: {
      sm: { content: 'max-w-sm' },
      md: { content: 'max-w-lg' },
      lg: { content: 'max-w-2xl' },
    },
  },
  defaultVariants: { size: 'md' },
})
