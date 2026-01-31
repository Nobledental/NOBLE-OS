'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft, ChevronRight, Plus, X,
    User, Clock, Coffee, Lock
} from 'lucide-react';
import { hapticPatterns } from '@/components/gestures/ios-gestures';

// =============================================================================
// TYPES
// =============================================================================

export interface CalendarSlot {
    id: string;
    time: Date;
    type: 'available' | 'booked' | 'blocked' | 'break';
    patientId?: string;
    patientName?: string;
    procedureName?: string;
    duration: number; // minutes
}

export interface DaySchedule {
    date: Date;
    slots: CalendarSlot[];
}

// =============================================================================
// DOCTOR CALENDAR (Tap-and-Drag)
// =============================================================================

interface DoctorCalendarProps {
    schedule: DaySchedule;
    onSlotSelect: (slot: CalendarSlot) => void;
    onBlockSlot: (startTime: Date, endTime: Date, reason: string) => void;
    onQuickBook: (time: Date) => void;
    slotDuration?: number;
}

export function DoctorCalendar({
    schedule,
    onSlotSelect,
    onBlockSlot,
    onQuickBook,
    slotDuration = 30
}: DoctorCalendarProps) {
    const [dragStart, setDragStart] = useState<Date | null>(null);
    const [dragEnd, setDragEnd] = useState<Date | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate time slots from 9 AM to 9 PM
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = 9 + Math.floor(i / 2);
        const minute = (i % 2) * 30;
        const time = new Date(schedule.date);
        time.setHours(hour, minute, 0, 0);
        return time;
    }).filter(t => t.getHours() < 21);

    const getSlotForTime = (time: Date): CalendarSlot | undefined => {
        return schedule.slots.find(s => {
            const slotTime = new Date(s.time);
            return slotTime.getHours() === time.getHours() &&
                slotTime.getMinutes() === time.getMinutes();
        });
    };

    const handleDragStart = (time: Date) => {
        setIsDragging(true);
        setDragStart(time);
        setDragEnd(time);
        hapticPatterns.selectionTick();
    };

    const handleDragMove = (time: Date) => {
        if (isDragging) {
            setDragEnd(time);
        }
    };

    const handleDragEnd = () => {
        if (dragStart && dragEnd && isDragging) {
            const start = dragStart < dragEnd ? dragStart : dragEnd;
            const end = dragStart < dragEnd ? dragEnd : dragStart;

            // Add 30 minutes to end time to include the last slot
            const endWithDuration = new Date(end.getTime() + slotDuration * 60 * 1000);

            onBlockSlot(start, endWithDuration, 'Personal time');
            hapticPatterns.successPulse();
        }

        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
    };

    const isInDragRange = (time: Date): boolean => {
        if (!dragStart || !dragEnd) return false;
        const start = dragStart < dragEnd ? dragStart : dragEnd;
        const end = dragStart < dragEnd ? dragEnd : dragStart;
        return time >= start && time <= end;
    };

    const getSlotColor = (slot: CalendarSlot | undefined, time: Date): string => {
        if (isDragging && isInDragRange(time)) {
            return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300';
        }
        if (!slot) return 'bg-green-50 dark:bg-green-950/20 border-green-200 hover:bg-green-100';

        switch (slot.type) {
            case 'booked':
                return 'bg-purple-100 dark:bg-purple-900/30 border-purple-300';
            case 'blocked':
                return 'bg-gray-100 dark:bg-gray-800 border-gray-300';
            case 'break':
                return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300';
            default:
                return 'bg-green-50 dark:bg-green-950/20 border-green-200';
        }
    };

    return (
        <Card className="glass-card p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="font-semibold">
                    {schedule.date.toLocaleDateString('en-IN', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                    })}
                </h3>
                <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Instructions */}
            <p className="text-xs text-muted-foreground mb-3">
                Tap-and-drag to block personal time • Tap empty slot for quick book
            </p>

            {/* Time Grid */}
            <div
                ref={containerRef}
                className="space-y-1 select-none"
                onMouseUp={handleDragEnd}
                onTouchEnd={handleDragEnd}
            >
                {timeSlots.map((time) => {
                    const slot = getSlotForTime(time);
                    const colorClass = getSlotColor(slot, time);

                    return (
                        <motion.div
                            key={time.toISOString()}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${colorClass}`}
                            onMouseDown={() => handleDragStart(time)}
                            onMouseEnter={() => handleDragMove(time)}
                            onTouchStart={() => handleDragStart(time)}
                            onClick={() => {
                                if (!isDragging && !slot) {
                                    hapticPatterns.softTap();
                                    onQuickBook(time);
                                } else if (slot) {
                                    onSlotSelect(slot);
                                }
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Time */}
                            <span className="w-16 text-sm font-medium text-muted-foreground">
                                {time.toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </span>

                            {/* Slot Content */}
                            <div className="flex-1">
                                {slot ? (
                                    <div className="flex items-center gap-2">
                                        {slot.type === 'booked' && (
                                            <>
                                                <User className="w-3 h-3" />
                                                <span className="text-sm font-medium truncate">
                                                    {slot.patientName}
                                                </span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {slot.procedureName}
                                                </Badge>
                                            </>
                                        )}
                                        {slot.type === 'blocked' && (
                                            <>
                                                <Lock className="w-3 h-3" />
                                                <span className="text-sm text-muted-foreground">
                                                    Blocked
                                                </span>
                                            </>
                                        )}
                                        {slot.type === 'break' && (
                                            <>
                                                <Coffee className="w-3 h-3" />
                                                <span className="text-sm text-muted-foreground">
                                                    Break
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-sm text-green-600">Available</span>
                                )}
                            </div>

                            {/* Quick Actions */}
                            {!slot && !isDragging && (
                                <Plus className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100" />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </Card>
    );
}

// =============================================================================
// WEEK VIEW (Swipeable)
// =============================================================================

interface WeekViewProps {
    currentDate: Date;
    schedules: DaySchedule[];
    onDateChange: (date: Date) => void;
    onSlotClick: (slot: CalendarSlot) => void;
}

export function WeekView({
    currentDate,
    schedules,
    onDateChange,
    onSlotClick
}: WeekViewProps) {
    const [offset, setOffset] = useState(0);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 100) {
            const direction = info.offset.x > 0 ? -1 : 1;
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + direction * 7);
            onDateChange(newDate);
            hapticPatterns.softTap();
        }
    };

    // Get week days
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        return day;
    });

    return (
        <Card className="glass-card p-4 overflow-hidden">
            {/* Week Header */}
            <div className="flex items-center justify-between mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setDate(newDate.getDate() - 7);
                        onDateChange(newDate);
                    }}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="font-semibold">
                    {weekStart.toLocaleDateString('en-IN', { month: 'short' })} {weekStart.getDate()} - {weekDays[6].getDate()}
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setDate(newDate.getDate() + 7);
                        onDateChange(newDate);
                    }}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Swipeable Week Grid */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing"
            >
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day, index) => {
                        const daySchedule = schedules.find(s =>
                            s.date.toDateString() === day.toDateString()
                        );
                        const isToday = day.toDateString() === new Date().toDateString();
                        const isSelected = day.toDateString() === currentDate.toDateString();
                        const bookedCount = daySchedule?.slots.filter(s => s.type === 'booked').length || 0;

                        return (
                            <motion.button
                                key={day.toISOString()}
                                onClick={() => {
                                    hapticPatterns.softTap();
                                    onDateChange(day);
                                }}
                                className={`p-2 rounded-lg text-center transition-all ${isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : isToday
                                            ? 'bg-primary/10 border border-primary'
                                            : 'hover:bg-muted'
                                    }`}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="text-xs font-medium opacity-60">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}
                                </div>
                                <div className="text-lg font-bold">
                                    {day.getDate()}
                                </div>
                                {bookedCount > 0 && (
                                    <div className="flex justify-center mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.div>
        </Card>
    );
}

// =============================================================================
// QUICK BOOK MODAL
// =============================================================================

interface QuickBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedTime: Date;
    onConfirm: (patientId: string, procedureId: string) => void;
}

export function QuickBookModal({
    isOpen,
    onClose,
    selectedTime,
    onConfirm
}: QuickBookModalProps) {
    const [patientSearch, setPatientSearch] = useState('');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-card-heavy p-4 z-50"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            transition: { type: 'spring', stiffness: 300, damping: 30 }
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Quick Book</h3>
                            <button onClick={onClose} className="p-1 hover:bg-muted rounded">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-lg">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>
                                {selectedTime.toLocaleDateString('en-IN', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })} at {selectedTime.toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </span>
                        </div>

                        <input
                            type="text"
                            placeholder="Search patient..."
                            value={patientSearch}
                            onChange={(e) => setPatientSearch(e.target.value)}
                            className="w-full p-3 border rounded-lg mb-4"
                            autoFocus
                        />

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                onClick={() => onConfirm('patient-id', 'procedure-id')}
                                className="flex-1"
                            >
                                Book Slot
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
