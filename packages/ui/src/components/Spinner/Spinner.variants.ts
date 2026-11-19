import { tv, type VariantProps } from 'tailwind-variants'

export const spinnerVariants = tv({
  slots: {
    root: 'inline-flex shrink-0 items-center justify-center',
    indicator: 'animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]',
  },
  variants: {
    size: {
      sm: { indicator: 'size-4' },
      md: { indicator: 'size-5' },
      lg: { indicator: 'size-6' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type SpinnerVariants = VariantProps<typeof spinnerVariants>
