"use client"

import { cn } from "@/lib/utils"

interface FullPageLoaderProps {
  visible: boolean
  message?: string
}

export function FullPageLoader({ visible, message = "Entrando..." }: FullPageLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-500",
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="h-16 w-16 rounded-full border-4 border-border animate-spin border-t-primary" />
          {/* Inner logo */}
          <div className="absolute flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-base font-semibold text-foreground">{message}</p>
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}
