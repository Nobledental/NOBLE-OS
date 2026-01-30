"use client";

import { UnifiedPatientSearch } from "@/components/shared/patient-search";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function PatientsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
                    <p className="text-muted-foreground">Search global registry (HealthFlo ID) or register new.</p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" /> Register New
                </Button>
            </div>

            {/* The Unified Search Widget */}
            <UnifiedPatientSearch />

            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Recent Views</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Mock Recents */}
                    {[1, 2].map((i) => (
                        <div key={i} className="h-24 rounded-lg border bg-card text-card-foreground shadow-sm p-4 opacity-50">
                            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                                Recent Patient {i}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
