import { cn } from "@/lib/utils";
import React from "react";

interface PanzeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    flat?: boolean;
}

export function PanzeCard({ children, className, flat = false, ...props }: PanzeCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-md",
                !flat && "shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
