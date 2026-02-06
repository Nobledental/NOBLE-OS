"use client";

import { useState, useEffect } from "react";
import { PanzeCard } from "@/components/ui/panze-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { UserPlus, Trash2, Key, Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type Role = "ADMIN" | "DOCTOR" | "CONSULTANT" | "RECEPTIONIST" | "ASSISTANT";

interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: "ACTIVE" | "INACTIVE";
}

const DEFAULT_STAFF: StaffMember[] = [
    { id: "1", name: "Dr. Dhivakaran", email: "admin@nobledental.com", role: "ADMIN", status: "ACTIVE" },
    { id: "2", name: "Sarah Receptionist", email: "frontdesk@nobledental.com", role: "RECEPTIONIST", status: "ACTIVE" },
];

export function StaffSettings() {
    const [staff, setStaff] = useState<StaffMember[]>(DEFAULT_STAFF);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form State
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newRole, setNewRole] = useState<Role>("RECEPTIONIST");

    useEffect(() => {
        const savedStaff = localStorage.getItem("clinic_staff_list");
        if (savedStaff) {
            setStaff(JSON.parse(savedStaff));
        }
    }, []);

    const saveStaff = (updatedList: StaffMember[]) => {
        setStaff(updatedList);
        localStorage.setItem("clinic_staff_list", JSON.stringify(updatedList));
    };

    const handleAddStaff = () => {
        if (!newName || !newEmail) {
            toast.error("Please fill in all details");
            return;
        }

        const newStaff: StaffMember = {
            id: crypto.randomUUID(),
            name: newName,
            email: newEmail,
            role: newRole,
            status: "ACTIVE"
        };

        const updated = [...staff, newStaff];
        saveStaff(updated);
        toast.success(`Allocated access to ${newRole}: ${newName}`);
        setIsAddOpen(false);
        setNewName("");
        setNewEmail("");
    };

    const handleRemoveStaff = (id: string) => {
        if (id === "1") {
            toast.error("Cannot remove the Primary Admin");
            return;
        }
        const updated = staff.filter(s => s.id !== id);
        saveStaff(updated);
        toast.success("Staff access revoked");
    };

    const handleResetPassword = (id: string) => {
        toast.info("Password reset link sent to registered email.");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Staff Access Management</h3>
                    <p className="text-slate-500 text-sm">Control who can access the NOBLE OS.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-slate-900 text-white hover:bg-slate-800">
                            <UserPlus className="w-4 h-4 mr-2" /> Add New Staff
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Grant Access</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Dr. Emily" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address (Login ID)</Label>
                                <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="e.g. emily@clinic.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Role & Permissions</Label>
                                <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RECEPTIONIST">Receptionist (Front Desk)</SelectItem>
                                        <SelectItem value="DOCTOR">Doctor (Clinical Access)</SelectItem>
                                        <SelectItem value="CONSULTANT">Consultant (Limited Clinical)</SelectItem>
                                        <SelectItem value="ASSISTANT">Dental Assistant</SelectItem>
                                        <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleAddStaff} className="w-full bg-slate-900 mt-2">Grant Access</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <PanzeCard className="overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead>Staff Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staff.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{member.name}</div>
                                            <div className="text-xs text-slate-500">{member.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-mono text-xs">
                                        {member.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-medium text-green-700">Active</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-slate-600"
                                            onClick={() => handleResetPassword(member.id)}
                                            title="Reset Password"
                                        >
                                            <Key className="w-4 h-4" />
                                        </Button>
                                        {member.role !== 'ADMIN' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-300 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => handleRemoveStaff(member.id)}
                                                title="Revoke Access"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </PanzeCard>
        </div>
    );
}
