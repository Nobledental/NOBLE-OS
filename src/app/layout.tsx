import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Noble Dental | CORE Command",
    description: "Advanced Clinic Management System",
};

import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/shared/command-palette";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className="antialiased font-sans"
            >
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
