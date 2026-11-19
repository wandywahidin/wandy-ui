import { tv, type VariantProps } from 'tailwind-variants'

export const badgeVariants = tv({
  base: 'inline-flex items-center gap-1 rounded-sm border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap',
  variants: {
    intent: { neutral: '', primary: '', success: '', warning: '', danger: '' },
    variant: { solid: '', soft: '', outline: 'bg-transparent' },
  },
  compoundVariants: [
    { variant: 'solid', intent: 'neutral', class: 'bg-foreground text-background' },
    { variant: 'solid', intent: 'primary', class: 'bg-primary text-primary-foreground' },
    { variant: 'solid', intent: 'success', class: 'bg-success text-success-foreground' },
    { variant: 'solid', intent: 'warning', class: 'bg-warning text-warning-foreground' },
    { variant: 'solid', intent: 'danger', class: 'bg-danger text-danger-foreground' },
    // Soft: tinted background, foreground text keeps AA contrast on any tint.
    { variant: 'soft', intent: 'neutral', class: 'bg-muted text-foreground' },
    { variant: 'soft', intent: 'primary', class: 'bg-primary/15 text-foreground' },
    { variant: 'soft', intent: 'success', class: 'bg-success/15 text-foreground' },
    { variant: 'soft', intent: 'warning', class: 'bg-warning/15 text-foreground' },
    { variant: 'soft', intent: 'danger', class: 'bg-danger/15 text-foreground' },
    { variant: 'outline', intent: 'neutral', class: 'border-border text-foreground' },
    { variant: 'outline', intent: 'primary', class: 'border-primary text-foreground' },
    { variant: 'outline', intent: 'success', class: 'border-success text-foreground' },
    { variant: 'outline', intent: 'warning', class: 'border-warning text-foreground' },
    { variant: 'outline', intent: 'danger', class: 'border-danger text-foreground' },
  ],
  defaultVariants: { intent: 'neutral', variant: 'soft' },
})

export type BadgeVariants = VariantProps<typeof badgeVariants>
