"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type TooltipContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

function useTooltipContext() {
  const context = React.useContext(TooltipContext)
  if (!context) throw new Error("Tooltip components must be used inside <Tooltip>")
  return context
}

function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  )
}

type TooltipTriggerProps = {
  children: React.ReactElement
  asChild?: boolean
}

function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
  const { setOpen } = useTooltipContext()

  const handlers = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, handlers)
  }

  return <button {...handlers}>{children}</button>
}

type TooltipContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 8,
  ...props
}: TooltipContentProps) {
  const { open } = useTooltipContext()
  if (!open) return null

  const positions: Record<NonNullable<TooltipContentProps["side"]>, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2",
    right: "left-full top-1/2 -translate-y-1/2",
    bottom: "top-full left-1/2 -translate-x-1/2",
    left: "right-full top-1/2 -translate-y-1/2",
  }

  const marginStyle =
    side === "top"
      ? { marginBottom: sideOffset }
      : side === "right"
        ? { marginLeft: sideOffset }
        : side === "bottom"
          ? { marginTop: sideOffset }
          : { marginRight: sideOffset }

  return (
    <div
      className={cn(
        "absolute z-50 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md",
        positions[side],
        className
      )}
      style={marginStyle}
      {...props}
    />
  )
}

export { Tooltip, TooltipContent, TooltipTrigger }
