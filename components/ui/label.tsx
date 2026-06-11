import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-[13px] font-semibold text-fta-ink leading-none select-none",
        className
      )}
      {...props}
    />
  )
}

export { Label }
