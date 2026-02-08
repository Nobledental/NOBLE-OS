import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    display: "swap",
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    display: "swap",
});

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
                className={`${outfit.variable} ${playfair.variable} antialiased font-sans`}
            >
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
