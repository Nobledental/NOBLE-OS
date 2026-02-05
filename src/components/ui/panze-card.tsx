import { cn } from "@/lib/utils";

interface PanzeCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    flat?: boolean;
}

export function PanzeCard({ children, className, flat = false, ...props }: PanzeCardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-[2rem] p-6 lg:p-8",
                !flat && "shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-slate-100/50",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
