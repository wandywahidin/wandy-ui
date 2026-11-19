import { tv } from 'tailwind-variants'

export const inputVariants = tv({
  slots: {
    root: [
      'flex h-10 w-full items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground',
      'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring',
      'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
      'has-[input[aria-invalid=true]]:border-danger',
    ],
    input:
      'h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
    prefix: 'flex shrink-0 items-center text-muted-foreground',
    suffix: 'flex shrink-0 items-center text-muted-foreground',
  },
})
