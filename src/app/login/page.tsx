"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, Role } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Phone,
    ShieldCheck,
    ArrowRight,
    Building2,
    MapPin,
    CheckCircle2,
    Loader2,
    Chrome,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type LoginStep = "IDENTITY" | "OTP" | "BRANCH";

const MOCK_BRANCHES = [
    { id: "b1", name: "Noble Dental - Whitefield", location: "ECC Road, Whitefield" },
    { id: "b2", name: "Noble Dental - Indiranagar", location: "100ft Road, Indiranagar" },
    { id: "b3", name: "Noble Dental - Koramangala", location: "4th Block, Koramangala" },
];

export default function LoginPage() {
    const [step, setStep] = useState<LoginStep>("IDENTITY");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState<typeof MOCK_BRANCHES[0] | null>(null);
    const { login, selectClinic } = useAuth();
    const router = useRouter();

    const handleSendOTP = () => {
        if (phone.length < 10) {
            toast.error("Please enter a valid mobile number");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep("OTP");
            toast.success("OTP sent to your mobile number");
        }, 1000);
    };

    const handleVerifyOTP = () => {
        if (otp.length < 6) {
            toast.error("Please enter the 6-digit OTP");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // Simulate multi-branch user for specific numbers or just everyone for demo
            setStep("BRANCH");
        }, 1000);
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            login({
                id: "u1",
                email: "google.user@example.com",
                full_name: "Google User",
                role: "OWNER",
                modulePermissions: ["all"],
                featurePermissions: {
                    can_view_revenue: true,
                    can_edit_inventory: true,
                    can_view_clinical: true,
                    can_manage_staff: true,
                    solo_mode: true
                }
            });
            router.push("/dashboard");
        }, 1500);
    };

    const finishLogin = () => {
        if (!selectedBranch) return;
        setIsLoading(true);

        login({
            id: "u1",
            email: "dhivakaran@healthflo.ai",
            full_name: "Dr. Dhivakaran",
            role: "OWNER",
            modulePermissions: ["all"],
            featurePermissions: {
                can_view_revenue: true,
                can_edit_inventory: true,
                can_view_clinical: true,
                can_manage_staff: true,
                solo_mode: true
            },
            availableClinics: MOCK_BRANCHES,
            selectedClinic: selectedBranch
        });

        setTimeout(() => {
            router.push("/dashboard");
        }, 800);
    };

    return (
        <div className="min-h-screen w-full bg-[#fafafa] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Abstract Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] z-10"
            >
                <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white p-10 shadow-2xl shadow-slate-200/50 relative">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                            <ShieldCheck className="w-3 h-3 text-indigo-500" />
                            Secure Gateway
                        </div>
                        <h1 className="text-4xl font-serif italic tracking-tighter text-slate-900 mb-2">Noble OS</h1>
                        <p className="text-sm text-slate-500 font-medium tracking-tight">Enterprise Clinic Management System</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === "IDENTITY" && (
                            <motion.div
                                key="identity"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile Identity</Label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center transition-colors group-focus-within:bg-indigo-50">
                                            <Phone className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
                                        </div>
                                        <Input
                                            placeholder="Enter 10-digit mobile"
                                            className="h-14 pl-14 rounded-2xl bg-white border-slate-100 hover:border-slate-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-lg font-medium tracking-wide"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            maxLength={10}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleSendOTP}
                                    disabled={isLoading}
                                    className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Secure OTP"}
                                </Button>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-100"></span>
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                                        <span className="bg-white px-4 text-slate-300">or maintain session with</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={handleGoogleLogin}
                                    className="w-full h-14 rounded-2xl border-slate-100 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all relative overflow-hidden group"
                                >
                                    <span className="flex items-center gap-3">
                                        <Chrome className="w-4 h-4 text-blue-500" />
                                        Continue with Google Workspace
                                    </span>
                                    <div className="absolute inset-0 bg-indigo-50/0 group-hover:bg-indigo-50/50 transition-colors pointer-events-none" />
                                </Button>
                            </motion.div>
                        )}

                        {step === "OTP" && (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Verification Code</Label>
                                    <Input
                                        placeholder="0 0 0 0 0 0"
                                        className="h-16 text-center text-3xl font-mono tracking-[0.5em] rounded-2xl border-slate-100 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                    />
                                    <p className="text-[10px] text-center text-slate-400 font-medium">
                                        Sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
                                    </p>
                                </div>

                                <Button
                                    onClick={handleVerifyOTP}
                                    disabled={isLoading}
                                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Identity"}
                                </Button>

                                <button
                                    onClick={() => setStep("IDENTITY")}
                                    className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors"
                                >
                                    Revoke & Change Number
                                </button>
                            </motion.div>
                        )}

                        {step === "BRANCH" && (
                            <motion.div
                                key="branch"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Clinic Environment</Label>
                                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                        {MOCK_BRANCHES.map((branch) => (
                                            <div
                                                key={branch.id}
                                                onClick={() => setSelectedBranch(branch)}
                                                className={cn(
                                                    "group p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden",
                                                    selectedBranch?.id === branch.id
                                                        ? "bg-slate-900 border-slate-900 shadow-xl shadow-slate-200"
                                                        : "bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30"
                                                )}
                                            >
                                                <div className="flex items-center justify-between relative z-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-colors",
                                                            selectedBranch?.id === branch.id ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400"
                                                        )}>
                                                            <Building2 className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className={cn("text-sm font-bold", selectedBranch?.id === branch.id ? "text-white" : "text-slate-900")}>{branch.name}</p>
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <MapPin className={cn("w-3 h-3", selectedBranch?.id === branch.id ? "text-slate-400" : "text-slate-400")} />
                                                                <p className={cn("text-[10px] font-medium", selectedBranch?.id === branch.id ? "text-slate-400" : "text-slate-500")}>{branch.location}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {selectedBranch?.id === branch.id && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="text-indigo-400"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5 fill-indigo-400 text-white" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={finishLogin}
                                    disabled={!selectedBranch || isLoading}
                                    className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initialize Environment"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Info */}
                    <div className="mt-10 flex items-center justify-center gap-4 opacity-30 grayscale hover:opacity-80 hover:grayscale-0 transition-all cursor-default group">
                        <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500 group-hover:animate-spin" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Advanced AI Orchestration Active</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center px-8">
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-[0.2em]">
                        Restricted Access. Built with CORE Architectural Integrity.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
