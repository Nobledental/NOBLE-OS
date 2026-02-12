"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Armchair,
    Activity,
    Clock,
    Wand2,
    MoreVertical,
    Plus,
    Search,
    AlertCircle,
    Loader2,
    Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSchedulingStore, DentalChair } from "@/lib/scheduling-store"; // Import from Store

export function ChairManagementHub() {
    const store = useSchedulingStore(); // Use Store
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    // New Chair Form State
    const [newChairName, setNewChairName] = useState("");
    const [newChairLocation, setNewChairLocation] = useState("");
    const [newChairType, setNewChairType] = useState<DentalChair['type']>('surgical');

    // Add Chair Action
    const handleAddChair = () => {
        if (!newChairName) return;

        store.addChair({
            name: newChairName,
            location: newChairLocation,
            type: newChairType,
            efficiency: 100,
            metadata: {}
        });

        setIsAddOpen(false);
        setNewChairName("");
        setNewChairLocation("");
        setNewChairType('surgical');
    };

    // Derived Metrics
    // Ensure chairs array exists (fallback to empty if store init issue)
    const chairs = store.chairs || [];
    const totalChairs = chairs.length;
    const activeChairs = chairs.filter(c => c.status === 'ACTIVE').length;
    const utilization = totalChairs > 0 ? Math.round((activeChairs / totalChairs) * 100) : 0;

    return (
        <div className="space-y-8 p-1">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-serif italic text-slate-900">Dental Asset Registry</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                        Real-time Utilization & Maintenance Status
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Find chair or operator..."
                            className="pl-9 h-10 w-[250px] bg-slate-50 border-slate-200 rounded-xl text-xs uppercase tracking-wider font-semibold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 h-10 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20">
                                <Plus className="w-3.5 h-3.5 mr-2" /> Add Chair
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl border-slate-200 shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-serif italic text-slate-900">Add New Dental Chain</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Chair Name / Room</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Surgical Suite A"
                                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                                        value={newChairName}
                                        onChange={(e) => setNewChairName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-xs font-bold uppercase tracking-widest text-slate-500">Location / Floor</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g. 1st Floor, East Wing"
                                        className="h-11 rounded-xl border-slate-200 bg-slate-50"
                                        value={newChairLocation}
                                        onChange={(e) => setNewChairLocation(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-xs font-bold uppercase tracking-widest text-slate-500">Function Type</Label>
                                    <Select value={newChairType} onValueChange={(v: any) => setNewChairType(v)}>
                                        <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="surgical">Surgical Suite</SelectItem>
                                            <SelectItem value="hygiene">Hygiene / Cleaning</SelectItem>
                                            <SelectItem value="consultation">Consultation Room</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl">Cancel</Button>
                                <Button
                                    onClick={handleAddChair}
                                    disabled={!newChairName}
                                    className="bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Register Asset
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Asset Value", value: `₹${(totalChairs * 4.5).toFixed(1)}L`, icon: Armchair, color: "text-slate-600" }, // Mock val calc
                    { label: "Active Utilization", value: `${utilization}%`, icon: Activity, color: "text-emerald-500" },
                    { label: "Avg. Turnaround", value: "12m", icon: Clock, color: "text-blue-500" },
                    { label: "Predictive Mntc.", value: "0 Alerts", icon: AlertCircle, color: "text-amber-500" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100", stat.color)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chairs Grid */}
            <div className="grid grid-cols-1 gap-4">
                {chairs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-60 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <Armchair className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="text-slate-400 font-medium text-sm">No chairs registered yet.</p>
                        <p className="text-slate-300 text-xs">Add your first dental chair to start tracking.</p>
                    </div>
                ) : (
                    chairs.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((chair) => (
                        <motion.div
                            key={chair.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -2 }}
                            className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 flex gap-2">
                                {/* Quick Status Toggles */}
                                <Select
                                    value={chair.status}
                                    onValueChange={(v: any) => store.updateChairStatus(chair.id, v)}
                                >
                                    <SelectTrigger className="h-8 w-[130px] rounded-lg border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AVAILABLE">Available</SelectItem>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="CLEANING">Cleaning</SelectItem>
                                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => store.removeChair(chair.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                {/* Icon / Avatar */}
                                <div className={cn(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-inner",
                                    chair.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" :
                                        chair.status === "MAINTENANCE" ? "bg-amber-50 text-amber-600" :
                                            chair.status === "CLEANING" ? "bg-blue-50 text-blue-600" :
                                                "bg-slate-50 text-slate-400"
                                )}>
                                    <Armchair className="w-8 h-8" />
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-slate-900">{chair.name}</h3>
                                        <Badge variant="outline" className={cn(
                                            "text-[9px] px-2 py-0.5 font-black uppercase tracking-wider border-0",
                                            chair.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                                                chair.status === "MAINTENANCE" ? "bg-amber-100 text-amber-700" :
                                                    chair.status === "CLEANING" ? "bg-blue-100 text-blue-700" :
                                                        "bg-slate-100 text-slate-600"
                                        )}>
                                            {chair.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                        {chair.location && <span className="text-slate-400">{chair.location} • </span>}
                                        <span className="uppercase text-[9px] font-bold tracking-widest text-slate-300">{chair.type}</span>
                                    </p>
                                </div>

                                {/* Active Procedure Context - MOCK for V1 until linked to Appointments */}
                                {chair.status === "ACTIVE" && (
                                    <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-500 border border-slate-100 shadow-sm">
                                            <Wand2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Procedure</p>
                                            <p className="text-xs font-semibold text-slate-900">Patient Treatment</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ongoing</p>
                                            <p className="text-xs font-mono text-emerald-600">Active</p>
                                        </div>
                                    </div>
                                )}

                                {/* Efficiency Score */}
                                <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between gap-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Efficiency</span>
                                    <span className={cn(
                                        "text-2xl font-serif italic",
                                        (chair.efficiency || 100) > 90 ? "text-emerald-600" :
                                            (chair.efficiency || 100) > 80 ? "text-blue-600" : "text-amber-600"
                                    )}>
                                        {chair.efficiency || 100}%
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar for Active */}
                            {chair.status === "ACTIVE" && (
                                <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-[65%]" />
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
