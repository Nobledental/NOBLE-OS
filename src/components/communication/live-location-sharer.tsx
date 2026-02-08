"use client";

import { useState, useEffect } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Share2, Copy, Radio, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LiveLocationSharer() {
    const [isLive, setIsLive] = useState(false);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [watchId, setWatchId] = useState<number | null>(null);

    // Mock Clinic Location (Anna Nagar)
    const CLINIC_COORDS = { lat: 13.0827, lng: 80.2117 };

    const toggleLiveTracking = () => {
        if (isLive) {
            // Stop Tracking
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            setIsLive(false);
            setWatchId(null);
            toast.info("Live tracking stopped.");
        } else {
            // Start Tracking
            if (!navigator.geolocation) {
                toast.error("Geolocation is not supported by this browser.");
                return;
            }

            toast.info("Starting live location beacon...");
            const id = navigator.geolocation.watchPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    if (!isLive) {
                        setIsLive(true);
                        toast.success("Live Location Active! You can now share it.");
                    }
                },
                (error) => {
                    console.error(error);
                    toast.error("Unable to retrieve location.");
                    setIsLive(false);
                },
                { enableHighAccuracy: true }
            );
            setWatchId(id);
        }
    };

    const shareLocation = (mode: 'clinic' | 'live') => {
        const text = mode === 'clinic'
            ? `🏥 *Noble Dental Clinic Location* \nHere is our clinic location: https://maps.google.com/?q=${CLINIC_COORDS.lat},${CLINIC_COORDS.lng} \nSee you soon!`
            : `📍 *Live Staff Location* \nI am sharing my live location to help you find me: https://maps.google.com/?q=${location?.lat},${location?.lng} \n(Valid for 1 hour)`;

        // "Work for Real": Open WhatsApp directly
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');

        // Also copy to clipboard as backup
        navigator.clipboard.writeText(text);
        toast.success("Opening WhatsApp... (Link also copied)");
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        };
    }, [watchId]);

    return (
        <PanzeCard className="border-white/5 bg-white/[0.01] overflow-hidden relative glass-neo p-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-rose-500" />

            <div className="p-6 pb-2">
                <div className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-between text-white/40">
                    <span className="flex items-center gap-2">
                        <Navigation className="w-3 h-3 text-orange-500" />
                        Location Command
                    </span>
                    {isLive && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                    )}
                </div>
            </div>
            <div className="p-6 pt-2 space-y-4">
                {/* Visual Map Placeholder (Swiggy Style) */}
                <div className="h-32 bg-white/5 rounded-2xl relative overflow-hidden group border border-white/5">
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/80.2117,13.0827,15,0/400x200?access_token=pk.mock')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all" />

                    {/* Radar Effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-16 h-16 border-2 rounded-full flex items-center justify-center ${isLive ? 'border-rose-500 animate-[ping_2s_infinite]' : 'border-orange-500'}`}>
                            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-rose-600' : 'bg-orange-600'}`} />
                        </div>
                    </div>

                    {/* Floating Label */}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/80 border border-white/10 shadow-xl">
                        {isLive ? "📍 Staff Active Beacon" : "🏥 Anna Nagar Branch"}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-9 border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => shareLocation('clinic')}
                    >
                        <MapPin className="w-3 h-3 mr-1.5" />
                        Share Clinic
                    </Button>

                    <Button
                        variant={isLive ? "default" : "outline"}
                        size="sm"
                        className={`text-xs h-9 ${isLive ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'border-slate-200'}`}
                        onClick={toggleLiveTracking}
                    >
                        {isLive ? (
                            <>
                                <Radio className="w-3 h-3 mr-1.5 animate-pulse" />
                                Stop Sharing
                            </>
                        ) : (
                            <>
                                <Navigation className="w-3 h-3 mr-1.5" />
                                Go Live
                            </>
                        )}
                    </Button>
                </div>

                {isLive && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <Button
                            className="w-full bg-slate-900 text-white hover:bg-slate-800 h-8 text-xs"
                            onClick={() => shareLocation('live')}
                        >
                            <Copy className="w-3 h-3 mr-2" />
                            Copy Live Link
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground mt-2">
                            *Updates every 10s. Battery usage high.
                        </p>
                    </div>
                )}
            </div>
        </PanzeCard>
    );
}
