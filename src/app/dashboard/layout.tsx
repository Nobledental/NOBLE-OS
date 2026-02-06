import { FloatingSidebar } from "@/components/layout/floating-sidebar";
import { CommandPalette } from "@/components/shared/command-palette";

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-mesh-gradient">
            {/* Floating Sidebar (Pill Dock) */}
            <FloatingSidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative flex flex-col p-4 md:p-6 lg:p-8 pl-28 md:pl-40 lg:pl-48">

                {/* Global Key Listener */}
                <CommandPalette />

                <div className="flex-1 max-w-[1600px] w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
