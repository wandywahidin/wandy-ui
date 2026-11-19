import { tv, type VariantProps } from 'tailwind-variants'

export const buttonVariants = tv({
  slots: {
    root: [
      'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none',
      'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      'disabled:cursor-not-allowed disabled:opacity-50 aria-busy:cursor-progress',
    ],
    spinner: '',
  },
  variants: {
    variant: {
      solid: {},
      outline: { root: 'border bg-transparent' },
      ghost: { root: 'bg-transparent' },
    },
    intent: { primary: {}, neutral: {}, danger: {} },
    size: {
      sm: { root: 'h-8 px-3 text-sm' },
      md: { root: 'h-10 px-4 text-sm' },
      lg: { root: 'h-12 px-6 text-base' },
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      intent: 'primary',
      class: { root: 'bg-primary text-primary-foreground hover:bg-primary/90' },
    },
    {
      variant: 'solid',
      intent: 'neutral',
      class: { root: 'bg-foreground text-background hover:bg-foreground/90' },
    },
    {
      variant: 'solid',
      intent: 'danger',
      class: { root: 'bg-danger text-danger-foreground hover:bg-danger/90' },
    },
    {
      variant: 'outline',
      intent: 'primary',
      class: { root: 'border-primary text-primary hover:bg-primary/10' },
    },
    {
      variant: 'outline',
      intent: 'neutral',
      class: { root: 'border-border text-foreground hover:bg-muted' },
    },
    {
      variant: 'outline',
      intent: 'danger',
      class: { root: 'border-danger text-danger hover:bg-danger/10' },
    },
    { variant: 'ghost', intent: 'primary', class: { root: 'text-primary hover:bg-primary/10' } },
    { variant: 'ghost', intent: 'neutral', class: { root: 'text-foreground hover:bg-muted' } },
    { variant: 'ghost', intent: 'danger', class: { root: 'text-danger hover:bg-danger/10' } },
  ],
  defaultVariants: { variant: 'solid', intent: 'primary', size: 'md' },
})

/** Square sizing for icon-only buttons; layered over `buttonVariants`. */
export const iconButtonVariants = tv({
  base: 'px-0',
  variants: {
    size: { sm: 'w-8', md: 'w-10', lg: 'w-12' },
  },
  defaultVariants: { size: 'md' },
})

export type ButtonVariants = VariantProps<typeof buttonVariants>
