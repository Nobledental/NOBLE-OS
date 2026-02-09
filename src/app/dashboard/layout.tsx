import { FloatingSidebar } from "@/components/layout/floating-sidebar";
import { CommandPalette } from "@/components/shared/command-palette";
import { AuthProvider } from "@/hooks/use-auth"; // Added

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="flex h-screen overflow-hidden bg-medex-obsidian">
                {/* Floating Sidebar (Pill Dock) */}
                <FloatingSidebar />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto relative flex flex-col p-4 md:p-6 lg:p-8 lg:pl-40">

                    {/* Global Key Listener */}
                    <CommandPalette />

                    <div className="flex-1 max-w-[1700px] w-full mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AuthProvider>
    );
}
