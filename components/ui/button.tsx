import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--r-md)] border-[1.5px] border-transparent bg-clip-padding text-[15px] font-bold whitespace-nowrap transition-all duration-[var(--dur)] ease-[var(--ease)] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-0 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--gold)] text-[var(--ink)] hover:bg-[var(--gold-hover)] hover:-translate-y-px hover:shadow-[var(--shadow-gold)]",
        dark:
          "bg-[var(--ink)] text-white hover:bg-black hover:-translate-y-px hover:shadow-[var(--shadow-md)]",
        outline:
          "border-[var(--gold)] bg-white text-[var(--ink)] hover:bg-[var(--gold-tint)] hover:-translate-y-px",
        "outline-ink":
          "border-[var(--ink)] bg-white text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white hover:-translate-y-px",
        secondary:
          "bg-[var(--surface-2)] text-[var(--fg-1)] hover:bg-[var(--surface-3)]",
        ghost:
          "border-transparent bg-transparent px-1.5 text-[var(--ink)] hover:text-[var(--gold-deep)]",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "border-transparent text-[var(--gold-deep)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto px-[22px] py-3.5",
        xs: "h-auto gap-1 rounded-[var(--r-sm)] px-3 py-2 text-xs",
        sm: "h-auto rounded-[var(--r-sm)] px-4 py-2.5 text-sm",
        lg: "h-auto px-7 py-[17px] text-base",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
