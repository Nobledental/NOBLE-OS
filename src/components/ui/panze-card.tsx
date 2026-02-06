import { cn } from "@/lib/utils";

interface PanzeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    flat?: boolean;
}

export function PanzeCard({ children, className, flat = false, ...props }: PanzeCardProps) {
    return (
        <div
            className={cn(
                "glass-panze p-6 lg:p-8",
                !flat && "shadow-[0_4px_24px_rgba(0,0,0,0.02)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
