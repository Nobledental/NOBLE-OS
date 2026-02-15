import { cn } from "@/lib/utils";

interface PanzeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    flat?: boolean;
}

export function PanzeCard({ children, className, flat = false, ...props }: PanzeCardProps) {
    return (
        <div
            className={cn(
                "p-6 lg:p-8 rounded-2xl transition-shadow duration-300",
                "bg-white/95 backdrop-blur-xl border border-slate-200/60",
                !flat && "shadow-sm hover:shadow-md",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
