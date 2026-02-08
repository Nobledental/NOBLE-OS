import { cn } from "@/lib/utils";

interface PanzeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    flat?: boolean;
}

export function PanzeCard({ children, className, flat = false, ...props }: PanzeCardProps) {
    return (
        <div
            className={cn(
                "glass-dream p-6 lg:p-8 transition-all duration-300 hover:shadow-dream hover:-translate-y-1",
                !flat && "shadow-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
