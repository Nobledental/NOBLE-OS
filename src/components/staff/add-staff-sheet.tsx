"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, HeartPulse, FileBadge, Save } from "lucide-react";
import { useState } from "react";

interface AddStaffSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddStaffSheet({ open, onOpenChange }: AddStaffSheetProps) {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6 text-indigo-600" />
                        New Staff Onboarding
                    </SheetTitle>
                    <SheetDescription>
                        Complete all sections to create a verified staff account and generate an ID card.
                    </SheetDescription>
                </SheetHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="profile"><User className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="professional"><Briefcase className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="personal"><HeartPulse className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="docs"><FileBadge className="w-4 h-4" /></TabsTrigger>
                    </TabsList>

                    {/* 1. Profile & Role */}
                    <TabsContent value="profile" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input placeholder="e.g. Dr. Sarah Wilson" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email (Login ID)</Label>
                                <Input placeholder="sarah@noble.com" type="email" />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input placeholder="+91 98765 43210" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                                <option>Consultant Doctor</option>
                                <option>Duty Doctor</option>
                                <option>Nurse</option>
                                <option>Receptionist</option>
                                <option>Admin</option>
                            </select>
                        </div>
                    </TabsContent>

                    {/* 2. Professional Info */}
                    <TabsContent value="professional" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                                    <option>General Dentistry</option>
                                    <option>Orthodontics</option>
                                    <option>Endodontics</option>
                                    <option>Surgery</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Designation</Label>
                                <Input placeholder="e.g. Senior Consultant" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Qualifications</Label>
                            <Input placeholder="e.g. BDS, MDS (Ortho)" />
                        </div>
                        <div className="space-y-2">
                            <Label>Previous Employer</Label>
                            <Input placeholder="e.g. City Dental Hospital" />
                        </div>
                    </TabsContent>

                    {/* 3. Personal & Medical */}
                    <TabsContent value="personal" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date of Birth</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>Blood Group</Label>
                                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                                    <option>O+</option>
                                    <option>A+</option>
                                    <option>B+</option>
                                    <option>AB+</option>
                                    <option>O-</option>
                                </select>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-4 mt-4">
                            <h4 className="font-semibold text-sm mb-3 text-slate-900">Emergency Contact</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input placeholder="Contact Person" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Relation</Label>
                                    <Input placeholder="Spouse / Parent" />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* 4. Docs & ID */}
                    <TabsContent value="docs" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Aadhaar Number</Label>
                            <Input placeholder="XXXX XXXX XXXX" />
                        </div>
                        <div className="space-y-2">
                            <Label>PAN Card</Label>
                            <Input placeholder="ABCDE1234F" />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
                            <p className="text-sm text-slate-500 mb-2">Upload Profile Photo</p>
                            <Button variant="outline" size="sm">Choose File</Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <SheetFooter className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-slate-100 flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                        <Save className="w-4 h-4" />
                        Save Staff Profile
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
