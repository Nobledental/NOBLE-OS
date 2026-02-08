import { cn } from "@/lib/utils";

interface PanzeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    flat?: boolean;
}

export function PanzeCard({ children, className, flat = false, ...props }: PanzeCardProps) {
    return (
        <div
            className={cn(
                "p-6 lg:p-8 transition-all duration-700 hover:-translate-y-1",
                !flat && "shadow-2xl",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
