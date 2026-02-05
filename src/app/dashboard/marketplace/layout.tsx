"use client";

import { MobileNavBar } from "@/components/marketplace/mobile-nav-bar";

export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-brand-bg-subtle pb-24 relative font-sans">
            {/* Mobile Bottom Bar */}
            <MobileNavBar />

            <div className="max-w-md mx-auto md:max-w-4xl lg:max-w-6xl">
                {children}
            </div>
        </div>
    );
}
