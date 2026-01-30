"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Lock, Unlock, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function StaffManagementPage() {
    const { user, updatePermissions } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (key: string, value: boolean) => {
        updatePermissions({ [key]: value });
        toast.success(`Permission updated locally.`, {
            description: "Changes will sync with the database on the next heartbeat."
        });
    };

    const handleSoloMode = (checked: boolean) => {
        updatePermissions({ solo_mode: checked });
        if (checked) {
            toast.info("Solo Mode Enabled", {
                description: "All clinical and financial modules are now unlocked for your session."
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Staff & Permissions</h2>
                    <p className="text-muted-foreground">Manage clinic access and role-based security.</p>
                </div>
                <div className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-indigo-500" /> Solo Mode
                        </span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400">Unlock all widgets</span>
                    </div>
                    <Switch
                        checked={user?.permissions?.solo_mode || false}
                        onCheckedChange={handleSoloMode}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Clinical Team</CardTitle>
                        <CardDescription>Grant clinical access to doctors and nurses.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Staff Member</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Clinical</TableHead>
                                    <TableHead>Finance</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">Dr. Dhivakaran</div>
                                            <div className="text-xs text-muted-foreground">Chief Dentist</div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant="secondary">OWNER</Badge></TableCell>
                                    <TableCell><Switch checked={true} disabled /></TableCell>
                                    <TableCell><Switch checked={true} disabled /></TableCell>
                                    <TableCell><Button variant="ghost" size="sm">Edit</Button></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">Sarah Miller</div>
                                            <div className="text-xs text-muted-foreground">Receptionist</div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant="outline">STAFF</Badge></TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={user?.permissions?.can_view_clinical}
                                            onCheckedChange={(val) => handleToggle('can_view_clinical', val)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={user?.permissions?.can_view_revenue}
                                            onCheckedChange={(val) => handleToggle('can_view_revenue', val)}
                                        />
                                    </TableCell>
                                    <TableCell><Button variant="ghost" size="sm">Edit</Button></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-500" /> Security Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Admin Overridden</span>
                                <Badge variant={user?.permissions?.solo_mode ? "default" : "secondary"}>
                                    {user?.permissions?.solo_mode ? "ACTIVE" : "INACTIVE"}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Database Sync</span>
                                <span className="text-emerald-500 font-medium">Healthy</span>
                            </div>
                        </div>

                        <Button className="w-full" onClick={() => setIsSaving(true)} disabled={isSaving}>
                            {isSaving ? "Syncing..." : "Sync with Backend"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
