import { tv } from 'tailwind-variants'

export const checkboxVariants = tv({
  slots: {
    root: 'inline-flex items-center gap-2 text-sm text-foreground has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
    box: 'relative inline-flex size-4 shrink-0',
    control: [
      'peer size-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-border bg-background',
      'checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      'disabled:cursor-not-allowed aria-invalid:border-danger',
    ],
    indicator:
      'pointer-events-none absolute inset-0 hidden size-4 text-primary-foreground peer-checked:block peer-indeterminate:block',
    label: 'select-none',
  },
})
