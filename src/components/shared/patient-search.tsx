"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { maskPhone } from "@/lib/security";

interface PatientResult {
    id: string;
    name: string;
    phone: string;
    healthFloId: string;
    gender: string;
    age: number;
}

export function UnifiedPatientSearch() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
    const router = useRouter();

    // Debounce Logic (Manual for simplicity, usually use useDebounce)
    const handleSearch = (val: string) => {
        setQuery(val);
        // Simple 500ms debounce
        const handler = setTimeout(() => setDebouncedQuery(val), 500);
        return () => clearTimeout(handler);
    };

    const { data: results, isLoading } = useQuery({
        queryKey: ['patientSearch', debouncedQuery],
        queryFn: async () => {
            if (debouncedQuery.length < 2) return [];
            const res = await api.get<PatientResult[]>(`/patients/search?q=${debouncedQuery}`);
            return res.data;
        },
        enabled: debouncedQuery.length > 2,
    });

    const toggleSensitive = async (id: string, type: 'phone') => {
        if (!showSensitive[id]) {
            try {
                // In a real app, 'performerId' would come from Auth Context
                await api.post(`/patients/${id}/audit`, {
                    performerId: "dr-dhivakaran-uuid",
                    field: type
                });
                console.log(`[AUDIT] Logged PII access for ${id}`);
            } catch (err) {
                console.error("Failed to log audit", err);
            }
        }
        setShowSensitive(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by Name, HealthFlo ID, or Phone..."
                    className="pl-9 h-10"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {isLoading && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
            </div>

            <div className="space-y-2">
                {results?.map((patient) => (
                    <Card key={patient.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-10 w-10 bg-indigo-100 text-indigo-700">
                                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-sm flex items-center">
                                        {patient.name}
                                        <span className="ml-2 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border">ID: {patient.healthFloId}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center space-x-2">
                                        <span>{patient.gender}, {patient.age} yrs</span>
                                        <span>•</span>
                                        <div className="flex items-center">
                                            {showSensitive[patient.id] ? (
                                                <span className="font-mono text-indigo-600">{patient.phone}</span>
                                            ) : (
                                                <span className="font-mono select-none">{maskPhone(patient.phone)}</span>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 ml-1 hover:bg-transparent"
                                                onClick={(e) => { e.stopPropagation(); toggleSensitive(patient.id, 'phone'); }}
                                            >
                                                {showSensitive[patient.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => router.push(`/patients/${patient.id}`)}
                            >
                                View Profile
                            </Button>
                        </CardContent>
                    </Card>
                ))}
                {results?.length === 0 && debouncedQuery.length > 2 && (
                    <div className="text-center text-sm text-muted-foreground py-4">
                        No patients found.
                        <Button variant="link" className="px-1 h-auto">Register New?</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
