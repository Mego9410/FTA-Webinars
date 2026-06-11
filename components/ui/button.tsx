import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2.5 rounded-pill border-[1.5px] border-transparent bg-clip-padding px-7 py-3.5 text-[15px] font-semibold whitespace-nowrap no-underline transition-[background-color,color,box-shadow,transform] duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-fta-gold/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-fta-gold text-fta-ink hover:bg-fta-ink hover:text-white [&_.btn-arrow]:text-fta-ink hover:[&_.btn-arrow]:text-fta-gold",
        dark:
          "bg-fta-ink text-white hover:bg-fta-gold hover:text-fta-ink [&_.btn-arrow]:text-white hover:[&_.btn-arrow]:text-fta-ink",
        outline:
          "border-fta-ink bg-transparent text-fta-ink hover:bg-fta-ink hover:text-white [&_.btn-arrow]:text-fta-ink hover:[&_.btn-arrow]:text-fta-gold",
        "outline-gold":
          "border-fta-gold bg-transparent text-fta-ink hover:bg-fta-gold hover:text-fta-ink",
        "outline-ink":
          "border-fta-ink bg-fta-bg text-fta-ink hover:bg-fta-ink hover:text-white [&_.btn-arrow]:text-fta-ink hover:[&_.btn-arrow]:text-fta-gold",
        secondary:
          "bg-fta-warm text-fta-text hover:bg-fta-gold-soft",
        ghost:
          "border-transparent bg-transparent px-2 text-fta-ink hover:text-fta-gold-hover",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "border-transparent px-0 text-fta-ink underline-offset-4 hover:text-fta-gold-hover hover:underline",
      },
      size: {
        default: "px-7 py-3.5",
        sm: "px-5 py-2.5 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "size-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function shouldShowArrow(
  variant: ButtonProps["variant"],
  showArrow?: boolean,
) {
  if (variant === "link" || variant === "destructive") return false;
  if (showArrow) return true;
  return (
    variant === "default" ||
    variant === "dark" ||
    variant === "outline" ||
    variant === "outline-ink"
  );
}

function ButtonArrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={cn(
        "btn-arrow size-4 transition-[transform,color] duration-200 group-hover/button:translate-x-0.5",
        className,
      )}
      aria-hidden
    />
  )
}

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    showArrow?: boolean;
  }

function Button({
  className,
  variant = "default",
  size = "default",
  showArrow = false,
  children,
  ...props
}: ButtonProps) {
  const withArrow = shouldShowArrow(variant, showArrow);

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {withArrow && variant !== "link" && variant !== "ghost" ? (
        <ButtonArrow />
      ) : null}
    </ButtonPrimitive>
  )
}

type ButtonLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & {
    showArrow?: boolean;
  }

function ButtonLink({
  className,
  variant = "default",
  size = "default",
  showArrow = false,
  children,
  ...props
}: ButtonLinkProps) {
  const withArrow = shouldShowArrow(variant, showArrow);

  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {withArrow && variant !== "link" && variant !== "ghost" ? (
        <ButtonArrow />
      ) : null}
    </Link>
  )
}

export { Button, ButtonArrow, ButtonLink, buttonVariants }
