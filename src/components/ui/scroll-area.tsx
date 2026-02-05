"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> { }

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "relative overflow-auto",
                    // Hide scrollbar but keep functionality
                    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
ScrollArea.displayName = "ScrollArea"

// Mock ScrollBar component compatibility layer
// This allows existing code to import ScrollBar without breaking, even though we use native scrolling
interface ScrollBarProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "vertical" | "horizontal"
}

const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(
    ({ className, orientation, ...props }, ref) => (
        <div ref={ref} className={cn("hidden", className)} {...props} />
    )
)
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
