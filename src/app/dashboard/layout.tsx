import { FloatingSidebar } from "@/components/layout/floating-sidebar";
import { CommandPalette } from "@/components/shared/command-palette";
import { BackgroundParticles } from "@/components/layout/background-particles";

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-aurora relative">
            {/* Apple-inspired Motion Particles */}
            <BackgroundParticles />

            {/* Floating Sidebar (Pill Dock) */}
            <FloatingSidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative flex flex-col p-4 md:p-6 lg:p-8 lg:pb-32 z-10">

                {/* Global Key Listener */}
                <CommandPalette />

                <div className="flex-1 max-w-[1700px] w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
