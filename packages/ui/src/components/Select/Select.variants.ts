import { tv } from 'tailwind-variants'

export const selectVariants = tv({
  slots: {
    trigger: [
      'inline-flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger',
    ],
    value: 'truncate data-placeholder:text-muted-foreground',
    icon: 'size-4 shrink-0 text-muted-foreground',
    content:
      'z-50 max-h-(--reka-select-content-available-height) min-w-(--reka-select-trigger-width) overflow-hidden rounded-md border border-border bg-surface text-foreground shadow-md',
    viewport: 'p-1',
    item: [
      'relative flex cursor-default items-center rounded-sm py-1.5 ps-8 pe-2 text-sm outline-none select-none',
      'data-highlighted:bg-muted data-disabled:pointer-events-none data-disabled:opacity-50',
    ],
    itemIndicator: 'absolute start-2 inline-flex size-4 items-center justify-center',
  },
})
