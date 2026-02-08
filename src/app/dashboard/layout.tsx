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
            <div className="flex h-screen overflow-hidden bg-[#020617] text-slate-100">
                {/* Global Deep Mesh Layer */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.05)_0%,_transparent_50%)] pointer-events-none" />
                <div className="absolute inset-0 bg-mesh-gradient opacity-[0.03] pointer-events-none" />
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
