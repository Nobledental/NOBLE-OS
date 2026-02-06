"use client";

import { useState } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import {
    RefreshCw,
    FolderOpen,
    HardDrive,
    CheckCircle2,
    AlertCircle,
    Image as ImageIcon,
    Settings,
    Activity
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DETECTED_APPS = [
    { id: "aidental", name: "Ai-Dental", path: "C:\\Program Files\\Ai-Dental\\Export", status: "connected", lastSync: "2 mins ago" },
    { id: "kodak", name: "Kodak RVG", path: "C:\\Kodak\\Images", status: "connected", lastSync: "1 hour ago" },
    { id: "vatech", name: "EzDent-i (Vatech)", path: "D:\\EzDent\\Data", status: "disconnected", lastSync: "Yesterday" }
];

export function BridgeHub() {
    const [isScanning, setIsScanning] = useState(false);
    const [apps, setApps] = useState(DETECTED_APPS);

    const handleSync = (id: string) => {
        toast.info(`Syncing images from ${apps.find(a => a.id === id)?.name}...`);
        // Mock sync delay
        setTimeout(() => {
            toast.success("Sync Complete: 4 new X-Rays imported.");
        }, 2000);
    };

    const scanForApps = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            toast.success("Noble Bridge found 3 compatibile Imaging Systems.");
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        Noble Bridge™
                    </h3>
                    <p className="text-sm text-slate-500">Universal Imaging Sync for Local RVG/OPG Sensors.</p>
                </div>
                <Button
                    onClick={scanForApps}
                    disabled={isScanning}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    <RefreshCw className={cn("w-4 h-4 mr-2", isScanning && "animate-spin")} />
                    {isScanning ? "Scanning Localhost..." : "Scan for Devices"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {apps.map((app) => (
                    <PanzeCard key={app.id} className="relative overflow-hidden group">
                        {/* Status Indicator */}
                        <div className={cn(
                            "absolute top-0 left-0 w-1 h-full",
                            app.status === "connected" ? "bg-green-500" : "bg-slate-300"
                        )} />

                        <div className="pl-2">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <HardDrive className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                    app.status === "connected" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                                )}>
                                    {app.status}
                                </div>
                            </div>

                            <h4 className="font-bold text-slate-900">{app.name}</h4>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-4 font-mono truncate" title={app.path}>
                                <FolderOpen className="w-3 h-3" />
                                {app.path}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs text-slate-400">Last: {app.lastSync}</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSync(app.id)}
                                    className="h-8 text-xs hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                                >
                                    Force Sync
                                </Button>
                            </div>
                        </div>
                    </PanzeCard>
                ))}

                {/* Manual Add Card */}
                <button className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-6 text-slate-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all gap-3 h-full min-h-[160px]">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Settings className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold">Configure Custom Path</span>
                </button>
            </div>

            {/* Daemon Status Footer */}
            <div className="bg-slate-900 text-slate-400 rounded-xl p-4 flex items-center font-mono text-xs gap-4">
                <div className="flex items-center gap-2 text-green-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    BRIDGE_DAEMON: ONLINE
                </div>
                <div className="h-4 w-px bg-slate-700" />
                <div>LISTENING_PORT: 3040</div>
                <div className="ml-auto">NOBLE_AGENT v2.1.0</div>
            </div>
        </div>
    );
}
