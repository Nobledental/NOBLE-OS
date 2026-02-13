"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, RefreshCw, Image as ImageIcon, Wifi, Save, Trash2, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function IntraOralCamera({ patientId }: { patientId: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [activeDeviceId, setActiveDeviceId] = useState<string>("");
    const [isStreamActive, setIsStreamActive] = useState(false);
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [cameraMode, setCameraMode] = useState<"usb" | "wifi">("usb");

    // 1. List Cameras
    const getCameras = useCallback(async () => {
        if (typeof window === 'undefined' || !navigator.mediaDevices) return;
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            if (videoDevices.length > 0 && !activeDeviceId) {
                setActiveDeviceId(videoDevices[0].deviceId);
            }
        } catch (err) {
            console.error("Error listing cameras:", err);
        }
    }, [activeDeviceId]);

    useEffect(() => {
        getCameras();
    }, [getCameras]);

    // 2. Start Stream
    const startStream = async () => {
        if (cameraMode === "wifi") {
            // Mock WiFi Stream
            setIsStreamActive(true);
            return;
        }

        if (typeof window === 'undefined' || !navigator.mediaDevices) {
            toast.error("Camera API not supported in this environment.");
            return;
        }

        if (videoRef.current && activeDeviceId) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: activeDeviceId }, width: 1280, height: 720 }
                });
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(e => {
                    console.error("Video play error:", e);
                    toast.error("Camera playback failed.");
                });
                setIsStreamActive(true);
            } catch (err) {
                console.error("Error starting stream:", err);
                toast.error("Failed to start camera feed. Please check permissions.");
            }
        }
    };

    const stopStream = () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsStreamActive(false);
    };

    // 3. Capture Function
    const captureImage = () => {
        if (cameraMode === "wifi") {
            // Mock Capture for WiFi
            const mockImg = "/assets/images/treatments/intra-oral-placeholder.jpg";
            setCapturedImages(prev => [...prev, mockImg]);
            toast.success("Image captured from WiFi Node");
            return;
        }

        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, 640, 480);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setCapturedImages(prev => [...prev, dataUrl]);
                toast.success("Image Captured");
            }
        }
    };

    const saveToGallery = () => {
        toast.success(`${capturedImages.length} images saved to Patient Gallery.`);
        setCapturedImages([]);
    };

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex gap-4 h-full">
                {/* Main Feed Area */}
                <PanzeCard className="flex-1 p-0 overflow-hidden relative bg-black flex flex-col group">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <div className="bg-black/50 backdrop-blur-md p-1 rounded-lg flex gap-1 items-center px-3 text-white text-xs font-bold border border-white/10">
                            {cameraMode === 'usb' ? <Camera className="w-3 h-3 text-green-400" /> : <Wifi className="w-3 h-3 text-blue-400" />}
                            {cameraMode === 'usb' ? "USB Feed" : "WiFi Stream (192.168.1.4)"}
                        </div>
                    </div>

                    {isStreamActive ? (
                        cameraMode === 'usb' ? (
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500 flex-col">
                                <Wifi className="w-16 h-16 animate-pulse text-blue-500 mb-4" />
                                <p>Connecting to Wireless Intra-Oral Cam...</p>
                            </div>
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 flex-col gap-4">
                            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
                                <Camera className="w-8 h-8 opacity-50" />
                            </div>
                            <p>Camera is Offline</p>
                            <Button onClick={startStream} className="bg-indigo-600 hover:bg-indigo-700">
                                Start Feed
                            </Button>
                        </div>
                    )}

                    {/* Controls Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-6 items-center translate-y-20 group-hover:translate-y-0 transition-transform duration-300">
                        <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-white/20 hover:bg-white/10 text-white" onClick={() => setCameraMode(m => m === 'usb' ? 'wifi' : 'usb')}>
                            <RefreshCw className="w-5 h-5" />
                        </Button>

                        <Button
                            size="icon"
                            className="rounded-full w-16 h-16 bg-white hover:bg-slate-200 text-black border-4 border-slate-300 ring-2 ring-white ring-offset-2 ring-offset-black"
                            onClick={captureImage}
                        >
                            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                        </Button>

                        <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-white/20 hover:bg-white/10 text-white" onClick={stopStream}>
                            <Maximize2 className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Hidden Canvas for Capture */}
                    <canvas ref={canvasRef} width={640} height={480} className="hidden" />
                </PanzeCard>

                {/* Sidebar: Gallery & Settings */}
                <div className="w-80 flex flex-col gap-4">
                    <PanzeCard className="p-4 space-y-4">
                        <h4 className="font-bold text-sm text-slate-500 uppercase">Input Source</h4>
                        <Select value={activeDeviceId} onValueChange={setActiveDeviceId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Camera" />
                            </SelectTrigger>
                            <SelectContent>
                                {devices.map((device) => (
                                    <SelectItem key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${device.deviceId.slice(0, 5)}...`}
                                    </SelectItem>
                                ))}
                                <SelectItem value="wifi_mock">IntraOral WiFi Cam X5</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={getCameras}
                        >
                            <RefreshCw className="w-3 h-3 mr-2" /> Refresh List
                        </Button>
                    </PanzeCard>

                    <PanzeCard className="flex-1 flex flex-col p-0 overflow-hidden">
                        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                            <span className="font-bold text-sm">Session Gallery</span>
                            <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">{capturedImages.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-2 content-start">
                            {capturedImages.map((img, idx) => (
                                <div key={idx} className="aspect-video bg-black rounded-lg overflow-hidden relative group">
                                    <img src={img} alt="Capture" className="w-full h-full object-cover" />
                                    <button
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setCapturedImages(prev => prev.filter((_, i) => i !== idx))}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t bg-slate-50">
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                                disabled={capturedImages.length === 0}
                                onClick={saveToGallery}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save to Record
                            </Button>
                        </div>
                    </PanzeCard>
                </div>
            </div>
        </div>
    );
}
