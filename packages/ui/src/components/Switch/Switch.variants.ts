import { tv } from 'tailwind-variants'

export const switchVariants = tv({
  slots: {
    root: 'inline-flex items-center gap-2 text-sm text-foreground has-[button:disabled]:opacity-50',
    track: [
      'group relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-border transition-colors',
      'aria-checked:bg-primary',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      'disabled:cursor-not-allowed aria-invalid:ring-2 aria-invalid:ring-danger',
    ],
    thumb:
      'pointer-events-none block rounded-full bg-background shadow-sm transition-transform motion-reduce:transition-none',
    label: 'cursor-pointer select-none',
  },
  variants: {
    size: {
      sm: { track: 'h-5 w-9', thumb: 'size-4 group-aria-checked:translate-x-4' },
      md: { track: 'h-6 w-11', thumb: 'size-5 group-aria-checked:translate-x-5' },
    },
  },
  defaultVariants: { size: 'md' },
})
