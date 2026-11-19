import { tv } from 'tailwind-variants'

export const textareaVariants = tv({
  slots: {
    root: [
      'block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger',
    ],
  },
})
