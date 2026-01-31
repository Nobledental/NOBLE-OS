'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { ApplianceMilestone, WireType, MilestoneType } from '@/types/orthodontic.types';

interface ApplianceTrackerProps {
    bondingDate?: string;
    estimatedDebondingDate?: string;
    initialMilestones?: ApplianceMilestone[];
    onMilestonesChange?: (milestones: ApplianceMilestone[]) => void;
}

const MILESTONE_TYPES: { value: MilestoneType; label: string }[] = [
    { value: 'BONDING', label: 'Initial Bonding' },
    { value: 'WIRE_CHANGE', label: 'Wire Change' },
    { value: 'ELASTICS', label: 'Elastics Started' },
    { value: 'ADJUSTMENT', label: 'Routine Adjustment' },
    { value: 'DEBONDING', label: 'Debonding / Completion' }
];

const WIRE_TYPES: { value: WireType; label: string; description: string }[] = [
    { value: 'NiTi', label: 'NiTi (Nickel-Titanium)', description: 'Initial leveling, thermal activation' },
    { value: 'SS', label: 'SS (Stainless Steel)', description: 'Working phase, rectangular wires' },
    { value: 'TMA', label: 'TMA (Beta-Titanium)', description: 'Finishing, torque control' }
];

export default function ApplianceTracker({
    bondingDate: initialBonding,
    estimatedDebondingDate: initialEstimate,
    initialMilestones = [],
    onMilestonesChange
}: ApplianceTrackerProps) {
    const [bondingDate, setBondingDate] = useState(initialBonding || '');
    const [estimatedDebondingDate, setEstimatedDebondingDate] = useState(initialEstimate || '');
    const [milestones, setMilestones] = useState<ApplianceMilestone[]>(initialMilestones);
    const [showAddForm, setShowAddForm] = useState(false);

    // New milestone form state
    const [newMilestone, setNewMilestone] = useState<Partial<ApplianceMilestone>>({
        type: 'WIRE_CHANGE',
        date: new Date().toISOString().split('T')[0],
        arch: 'Both',
        notes: ''
    });

    const addMilestone = () => {
        if (!newMilestone.date || !newMilestone.notes) {
            toast.error('Please fill in date and notes');
            return;
        }

        const milestone: ApplianceMilestone = {
            id: `milestone-${Date.now()}`,
            date: newMilestone.date!,
            type: newMilestone.type as MilestoneType,
            wireType: newMilestone.wireType,
            arch: newMilestone.arch,
            elasticsConfiguration: newMilestone.elasticsConfiguration,
            notes: newMilestone.notes!,
            photoAssetIds: []
        };

        const updated = [...milestones, milestone].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setMilestones(updated);
        onMilestonesChange?.(updated);

        // Reset form
        setNewMilestone({
            type: 'WIRE_CHANGE',
            date: new Date().toISOString().split('T')[0],
            arch: 'Both',
            notes: ''
        });
        setShowAddForm(false);

        toast.success('Milestone added successfully');
    };

    const deleteMilestone = (id: string) => {
        const updated = milestones.filter(m => m.id !== id);
        setMilestones(updated);
        onMilestonesChange?.(updated);
        toast.info('Milestone removed');
    };

    const calculateProgress = () => {
        if (!bondingDate || !estimatedDebondingDate) return 0;

        const start = new Date(bondingDate).getTime();
        const end = new Date(estimatedDebondingDate).getTime();
        const now = new Date().getTime();

        if (now < start) return 0;
        if (now > end) return 100;

        return Math.round(((now - start) / (end - start)) * 100);
    };

    const getDaysInTreatment = () => {
        if (!bondingDate) return 0;
        const start = new Date(bondingDate);
        const now = new Date();
        return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    };

    const progress = calculateProgress();
    const daysInTreatment = getDaysInTreatment();

    return (
        <div className="space-y-4">
            {/* Treatment Timeline Header */}
            <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-medium block mb-2">Bonding Date</label>
                        <Input
                            type="date"
                            value={bondingDate}
                            onChange={(e) => setBondingDate(e.target.value)}
                            className="text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium block mb-2">Estimated Debonding</label>
                        <Input
                            type="date"
                            value={estimatedDebondingDate}
                            onChange={(e) => setEstimatedDebondingDate(e.target.value)}
                            className="text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium block mb-2">Treatment Duration</label>
                        <div className="text-2xl font-bold text-blue-500">
                            {bondingDate && estimatedDebondingDate ? (
                                Math.round((new Date(estimatedDebondingDate).getTime() - new Date(bondingDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
                            ) : 0} months
                        </div>
                    </div>
                </div>

                {bondingDate && estimatedDebondingDate && (
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Treatment Progress</span>
                            <Badge>{progress}% Complete</Badge>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>{daysInTreatment} days in treatment</span>
                            <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                On track
                            </span>
                        </div>
                    </div>
                )}
            </Card>

            {/* Milestone List */}
            <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Treatment Milestones</h4>
                    <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Milestone
                    </Button>
                </div>

                {/* Add Milestone Form */}
                {showAddForm && (
                    <Card className="p-4 mb-4 bg-muted/50">
                        <h5 className="text-sm font-medium mb-3">New Milestone</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-medium block mb-1">Date</label>
                                <Input
                                    type="date"
                                    value={newMilestone.date}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, date: e.target.value })}
                                    className="text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium block mb-1">Type</label>
                                <select
                                    value={newMilestone.type}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, type: e.target.value as MilestoneType })}
                                    className="w-full px-3 py-2 border rounded text-sm"
                                >
                                    {MILESTONE_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            {newMilestone.type === 'WIRE_CHANGE' && (
                                <>
                                    <div>
                                        <label className="text-xs font-medium block mb-1">Wire Type</label>
                                        <select
                                            value={newMilestone.wireType || ''}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, wireType: e.target.value as WireType })}
                                            className="w-full px-3 py-2 border rounded text-sm"
                                        >
                                            <option value="">Select wire type</option>
                                            {WIRE_TYPES.map(wire => (
                                                <option key={wire.value} value={wire.value}>{wire.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium block mb-1">Arch</label>
                                        <select
                                            value={newMilestone.arch || 'Both'}
                                            onChange={(e) => setNewMilestone({ ...newMilestone, arch: e.target.value as any })}
                                            className="w-full px-3 py-2 border rounded text-sm"
                                        >
                                            <option value="Upper">Upper</option>
                                            <option value="Lower">Lower</option>
                                            <option value="Both">Both</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {newMilestone.type === 'ELASTICS' && (
                                <div className="md:col-span-2">
                                    <label className="text-xs font-medium block mb-1">Elastics Configuration</label>
                                    <Input
                                        value={newMilestone.elasticsConfiguration || ''}
                                        onChange={(e) => setNewMilestone({ ...newMilestone, elasticsConfiguration: e.target.value })}
                                        placeholder="e.g., Class II, 3/16 inch, 4.5 oz"
                                        className="text-sm"
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="text-xs font-medium block mb-1">Clinical Notes</label>
                                <Textarea
                                    value={newMilestone.notes}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, notes: e.target.value })}
                                    placeholder="Record observations, patient response, next steps..."
                                    rows={3}
                                    className="text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Button onClick={addMilestone} size="sm">Add Milestone</Button>
                            <Button onClick={() => setShowAddForm(false)} variant="outline" size="sm">Cancel</Button>
                        </div>
                    </Card>
                )}

                {/* Timeline */}
                <div className="space-y-3">
                    {milestones.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No milestones recorded yet</p>
                            <p className="text-xs mt-1">Click "Add Milestone" to start tracking treatment progress</p>
                        </div>
                    ) : (
                        milestones.map((milestone, index) => (
                            <div key={milestone.id} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${milestone.type === 'BONDING' ? 'bg-green-500 text-white' :
                                            milestone.type === 'DEBONDING' ? 'bg-purple-500 text-white' :
                                                'bg-blue-500 text-white'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    {index < milestones.length - 1 && (
                                        <div className="w-0.5 h-full bg-border mt-2" />
                                    )}
                                </div>

                                <div className="flex-1 pb-4">
                                    <div className="flex items-start justify-between mb-1">
                                        <div>
                                            <h5 className="font-medium text-sm">
                                                {MILESTONE_TYPES.find(t => t.value === milestone.type)?.label}
                                            </h5>
                                            <p className="text-xs text-muted-foreground">{milestone.date}</p>
                                        </div>
                                        <Button
                                            onClick={() => deleteMilestone(milestone.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 text-xs"
                                        >
                                            Remove
                                        </Button>
                                    </div>

                                    {milestone.wireType && (
                                        <Badge variant="outline" className="text-xs mb-2">
                                            {milestone.wireType} - {milestone.arch}
                                        </Badge>
                                    )}

                                    {milestone.elasticsConfiguration && (
                                        <Badge variant="outline" className="text-xs mb-2">
                                            {milestone.elasticsConfiguration}
                                        </Badge>
                                    )}

                                    <p className="text-sm text-muted-foreground mt-2">{milestone.notes}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
