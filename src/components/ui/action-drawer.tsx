"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

interface ActionDrawerProps {
    trigger: React.ReactNode;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function ActionDrawer({
    trigger,
    title,
    description,
    children,
    className,
}: ActionDrawerProps) {
    return (
        <DrawerPrimitive.Root>
            <DrawerPrimitive.Trigger asChild>
                {trigger}
            </DrawerPrimitive.Trigger>
            <DrawerPrimitive.Portal>
                <DrawerPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                <DrawerPrimitive.Content
                    className={cn(
                        "fixed bottom-0 left-0 right-0 max-h-[96%] flex flex-col glass rounded-t-[32px] z-50 outline-none",
                        "after:absolute after:top-2 after:left-1/2 after:-translate-x-1/2 after:h-1.5 after:w-12 after:rounded-full after:bg-slate-300 dark:after:bg-slate-700",
                        className
                    )}
                >
                    <div className="p-8 pb-12 overflow-y-auto">
                        <div className="max-w-md mx-auto">
                            <DrawerPrimitive.Title className="text-2xl font-black tracking-tight mb-2">
                                {title}
                            </DrawerPrimitive.Title>
                            {description && (
                                <DrawerPrimitive.Description className="text-muted-foreground mb-8">
                                    {description}
                                </DrawerPrimitive.Description>
                            )}
                            {children}
                        </div>
                    </div>
                </DrawerPrimitive.Content>
            </DrawerPrimitive.Portal>
        </DrawerPrimitive.Root>
    );
}
