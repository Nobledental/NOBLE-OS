import { AppSidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/shared/command-palette";
// UserNav removed for now

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative flex flex-col">
                {/* Top Header (Mobile Trigger / User Profile) */}
                <header className="h-16 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <h1 className="text-lg font-semibold md:hidden">HealthFlo</h1>
                    <div className="ml-auto flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground hidden sm:inline-block">
                            Dr. Dhivakaran (Noble Dental)
                        </span>
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                    </div>
                </header>

                {/* Global Key Listener */}
                <CommandPalette />

                <div className="flex-1 p-6 md:p-8 pt-6 space-y-4">
                    {children}
                </div>
            </main>
        </div>
    );
}
