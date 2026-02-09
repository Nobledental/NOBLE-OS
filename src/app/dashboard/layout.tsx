import { FloatingSidebar } from "@/components/layout/floating-sidebar";
import { CommandPalette } from "@/components/shared/command-palette";
import { AuthProvider } from "@/hooks/use-auth"; // Added
import { motion } from "framer-motion";

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="flex h-screen overflow-hidden bg-aurora relative">
                {/* Apple-inspired Motion Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <motion.div
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-neo-vibrant-blue/5 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            x: [0, -80, 0],
                            y: [0, 120, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-neo-electric-blue/5 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            x: [0, 40, 0],
                            y: [0, -60, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-neo-lavender/5 rounded-full blur-[140px]"
                    />
                </div>

                {/* Floating Sidebar (Pill Dock) */}
                <FloatingSidebar />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto relative flex flex-col p-4 md:p-6 lg:p-8 lg:pl-40 z-10">

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
