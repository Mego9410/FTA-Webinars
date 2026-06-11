import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-[52px] w-full min-w-0 rounded-input border-[1.5px] border-fta-border bg-fta-bg px-4 text-base text-fta-text transition-colors outline-none placeholder:text-fta-muted/70 focus-visible:border-fta-gold focus-visible:ring-2 focus-visible:ring-fta-gold/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
