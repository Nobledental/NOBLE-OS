'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
    UserPlus, Users, Search, Check, X, Clock,
    Stethoscope, ShieldCheck, Calendar
} from 'lucide-react';
import {
    ConsultantProfile,
    CaseAssignment,
    ConsultantSpecialty
} from '@/types/consultant.types';

interface ConsultantAssignmentProps {
    patientId: string;
    patientName: string;
    existingAssignments?: CaseAssignment[];
    onAssign?: (assignment: CaseAssignment) => void;
}

// Mock consultants (would come from API)
const mockConsultants: ConsultantProfile[] = [
    {
        id: 'cons-1',
        userId: 'u1',
        name: 'Dr. Priya Sharma',
        specialty: 'orthodontics',
        registrationNumber: 'MDS-12345',
        assignedPatients: [],
        commissionPercentage: 60,
        isActive: true,
        joiningDate: '2024-01-15',
        contactEmail: 'priya@noble.dental',
        contactPhone: '+91-98765-43210'
    },
    {
        id: 'cons-2',
        userId: 'u2',
        name: 'Dr. Rajesh Kumar',
        specialty: 'oral_surgery',
        registrationNumber: 'MDS-67890',
        assignedPatients: [],
        commissionPercentage: 65,
        isActive: true,
        joiningDate: '2023-06-20',
        contactEmail: 'rajesh@noble.dental',
        contactPhone: '+91-98765-12345'
    },
    {
        id: 'cons-3',
        userId: 'u3',
        name: 'Dr. Anita Menon',
        specialty: 'periodontics',
        registrationNumber: 'MDS-11111',
        assignedPatients: [],
        commissionPercentage: 55,
        isActive: true,
        joiningDate: '2024-03-01',
        contactEmail: 'anita@noble.dental',
        contactPhone: '+91-98765-54321'
    }
];

const SPECIALTY_LABELS: Record<ConsultantSpecialty, string> = {
    orthodontics: 'Orthodontics',
    oral_surgery: 'Oral Surgery',
    endodontics: 'Endodontics',
    periodontics: 'Periodontics',
    prosthodontics: 'Prosthodontics',
    pediatric: 'Pediatric Dentistry',
    oral_medicine: 'Oral Medicine',
    implantology: 'Implantology'
};

const SPECIALTY_COLORS: Record<ConsultantSpecialty, string> = {
    orthodontics: 'bg-purple-500',
    oral_surgery: 'bg-red-500',
    endodontics: 'bg-blue-500',
    periodontics: 'bg-green-500',
    prosthodontics: 'bg-orange-500',
    pediatric: 'bg-pink-500',
    oral_medicine: 'bg-teal-500',
    implantology: 'bg-cyan-500'
};

export default function ConsultantAssignment({
    patientId,
    patientName,
    existingAssignments = [],
    onAssign
}: ConsultantAssignmentProps) {
    const [consultants, setConsultants] = useState<ConsultantProfile[]>([]);
    const [selectedConsultant, setSelectedConsultant] = useState<string>('');
    const [filterSpecialty, setFilterSpecialty] = useState<ConsultantSpecialty | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [notes, setNotes] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        // Load consultants (mock)
        setConsultants(mockConsultants);
    }, []);

    const filteredConsultants = consultants.filter(c => {
        const matchesSpecialty = filterSpecialty === 'all' || c.specialty === filterSpecialty;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSpecialty && matchesSearch && c.isActive;
    });

    const handleAssign = async () => {
        if (!selectedConsultant) {
            toast.error('Please select a consultant');
            return;
        }

        setIsAssigning(true);

        try {
            const consultant = consultants.find(c => c.id === selectedConsultant);
            if (!consultant) throw new Error('Consultant not found');

            const assignment: CaseAssignment = {
                id: `assign-${Date.now()}`,
                patientId,
                consultantId: selectedConsultant,
                assignedBy: 'current-admin-id', // Would come from auth
                assignedAt: new Date().toISOString(),
                department: consultant.specialty,
                status: 'pending',
                notes
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            onAssign?.(assignment);
            toast.success(`Patient assigned to ${consultant.name}`);

            setSelectedConsultant('');
            setNotes('');
        } catch (error) {
            toast.error('Failed to assign consultant');
        } finally {
            setIsAssigning(false);
        }
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-blue-500" />
                        Consultant Assignment
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Assign {patientName} to a visiting specialist
                    </p>
                </div>
                <Badge variant="outline">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    RLS Protected
                </Badge>
            </div>

            {/* Existing Assignments */}
            {existingAssignments.length > 0 && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Current Assignments
                    </h4>
                    <div className="space-y-2">
                        {existingAssignments.map(a => {
                            const consultant = consultants.find(c => c.id === a.consultantId);
                            return (
                                <div key={a.id} className="flex items-center justify-between p-2 bg-background rounded">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${SPECIALTY_COLORS[a.department]}`} />
                                        <span>{consultant?.name || 'Unknown'}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {SPECIALTY_LABELS[a.department]}
                                        </Badge>
                                    </div>
                                    <Badge variant={
                                        a.status === 'completed' ? 'default' :
                                            a.status === 'in_progress' ? 'secondary' : 'outline'
                                    }>
                                        {a.status}
                                    </Badge>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search consultants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select
                    value={filterSpecialty}
                    onValueChange={(v) => setFilterSpecialty(v as ConsultantSpecialty | 'all')}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Specialties</SelectItem>
                        {Object.entries(SPECIALTY_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Consultant List */}
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {filteredConsultants.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No consultants found</p>
                    </div>
                ) : (
                    filteredConsultants.map(consultant => (
                        <div
                            key={consultant.id}
                            onClick={() => setSelectedConsultant(consultant.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedConsultant === consultant.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                    : 'border-border hover:bg-muted/50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${SPECIALTY_COLORS[consultant.specialty]}`}>
                                        <Stethoscope className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{consultant.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {SPECIALTY_LABELS[consultant.specialty]} • {consultant.commissionPercentage}% split
                                        </div>
                                    </div>
                                </div>
                                {selectedConsultant === consultant.id && (
                                    <Check className="w-5 h-5 text-blue-500" />
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Notes & Assign */}
            {selectedConsultant && (
                <div className="space-y-3">
                    <Input
                        placeholder="Assignment notes (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <Button
                        onClick={handleAssign}
                        disabled={isAssigning}
                        className="w-full"
                    >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isAssigning ? 'Assigning...' : 'Assign Consultant'}
                    </Button>
                </div>
            )}
        </Card>
    );
}
