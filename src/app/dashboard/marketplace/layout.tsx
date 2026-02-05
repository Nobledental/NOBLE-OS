"use client";

import { SwiggyBottomBar } from "@/components/marketplace/swiggy-bottom-bar";

export default function MarketplaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-swiggy-bg pb-24 relative font-sans">
            {/* Mobile Bottom Bar */}
            <SwiggyBottomBar />

            <div className="max-w-md mx-auto md:max-w-4xl lg:max-w-6xl">
                {children}
            </div>
        </div>
    );
}
