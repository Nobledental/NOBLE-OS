'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    MessageSquare, Send, Paperclip, User,
    Stethoscope, Clock, CheckCheck, Brain, BookOpen
} from 'lucide-react';
import { ConsultantNote } from '@/types/consultant.types';

interface ConsultantDiscussionProps {
    caseAssignmentId?: string;
    currentUserId: string;
    currentUserRole: 'chief_dentist' | 'consultant' | 'student';
    currentUserName: string;
    isGlobal?: boolean;
}

// Mock notes
const mockNotes: ConsultantNote[] = [
    {
        id: 'note-1',
        caseAssignmentId: 'assign-1',
        authorId: 'chief-1',
        authorName: 'Dr. Noble',
        authorRole: 'chief_dentist',
        content: 'Patient presented with recurrent pericoronitis on 48. OPG shows mesioangular impaction with proximity to IAN. Please advise on surgical approach.',
        createdAt: '2026-01-28T10:30:00Z',
        isInternal: true
    },
    {
        id: 'note-2',
        caseAssignmentId: 'assign-1',
        authorId: 'cons-2',
        authorName: 'Dr. Rajesh Kumar',
        authorRole: 'consultant',
        content: 'Reviewed OPG. WAR Score = 8. Recommend surgical extraction under LA with bone removal. CBCT advised to assess IAN proximity more accurately before surgery.',
        createdAt: '2026-01-28T14:15:00Z',
        isInternal: true
    },
    {
        id: 'note-3',
        caseAssignmentId: 'assign-1',
        authorId: 'chief-1',
        authorName: 'Dr. Noble',
        authorRole: 'chief_dentist',
        content: 'CBCT ordered. Will share results once available. Please let me know your available slot for the surgery.',
        createdAt: '2026-01-29T09:00:00Z',
        isInternal: true
    },
    {
        id: 'note-4',
        caseAssignmentId: 'global',
        authorId: 'neo-ai',
        authorName: 'Neo AI',
        authorRole: 'consultant',
        content: 'Verified Insight: Mesioangular impactions with high WAR scores often require distal guttering. Grossman (Ch. 14) recommends ensuring direct visualization of the distal follicle to avoid lingual plate fracture.',
        createdAt: '2026-01-29T10:00:00Z',
        isInternal: false,
        metadata: { citation: "Grossman's Endodontics, 13th Ed, Ch 14" }
    }
];

export default function ConsultantDiscussion({
    caseAssignmentId = 'global',
    currentUserId,
    currentUserRole,
    currentUserName,
    isGlobal = false
}: ConsultantDiscussionProps) {
    const [notes, setNotes] = useState<ConsultantNote[]>(mockNotes);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isStealth, setIsStealth] = useState(false);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        setIsSending(true);

        try {
            const note: ConsultantNote = {
                id: `note-${Date.now()}`,
                caseAssignmentId,
                authorId: currentUserId,
                authorName: currentUserName,
                authorRole: currentUserRole,
                content: newMessage,
                createdAt: new Date().toISOString(),
                isInternal: true
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            setNotes([...notes, note]);
            setNewMessage('');
            toast.success('Message sent');
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card className="flex flex-col h-[500px]">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold italic uppercase tracking-widest text-[10px]">
                        {isGlobal ? 'Global Peer Forum' : 'Case Discussion'}
                    </h3>
                </div>
                <div className="flex items-center gap-3">
                    {isGlobal && (
                        <button
                            onClick={() => setIsStealth(!isStealth)}
                            className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${isStealth ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-white/5 text-slate-400 border-slate-200'}`}
                        >
                            {isStealth ? 'Stealth Rank Active' : 'Go Stealth'}
                        </button>
                    )}
                    <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter">
                        {isGlobal ? 'Public Peer Network' : 'Internal • Case Only'}
                    </Badge>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {notes.map(note => {
                    const isMe = note.authorId === currentUserId;
                    const isChief = note.authorRole === 'chief_dentist';

                    return (
                        <div
                            key={note.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] ${isMe
                                ? 'bg-blue-500 text-white rounded-l-lg rounded-br-lg'
                                : 'bg-muted rounded-r-lg rounded-bl-lg'
                                } p-3`}>
                                {/* Author */}
                                <div className="flex items-center gap-2 mb-1">
                                    {note.authorId === 'neo-ai'
                                        ? <Brain className="w-3 h-3 text-rose-500" />
                                        : isChief ? <User className="w-3 h-3" /> : <Stethoscope className="w-3 h-3" />
                                    }
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isMe ? 'text-blue-100' : 'text-slate-500'}`}>
                                        {note.authorId === 'neo-ai'
                                            ? 'Neo AI (GraphRAG)'
                                            : (isGlobal && isStealth && isMe) ? 'Top 5% Student (You)' : note.authorName
                                        }
                                    </span>
                                    {isGlobal && !isMe && note.authorRole === 'student' && (
                                        <button className="text-[7px] font-black text-rose-500 uppercase ml-auto hover:underline">
                                            Hiring Unlock
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <p className="text-sm italic leading-relaxed">{note.content}</p>

                                {/* Citations */}
                                {note.metadata?.citation && (
                                    <div className="mt-2 p-2 bg-black/10 rounded-lg border border-black/5 flex items-center gap-2">
                                        <BookOpen size={10} className="text-rose-500" />
                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-80">{note.metadata.citation}</span>
                                    </div>
                                )}

                                {/* Time */}
                                <div className={`flex items-center gap-1 mt-1 text-xs ${isMe ? 'text-blue-200 justify-end' : 'text-muted-foreground'
                                    }`}>
                                    <Clock className="w-3 h-3" />
                                    {formatTime(note.createdAt)}
                                    {isMe && <CheckCheck className="w-3 h-3 ml-1" />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <Paperclip className="w-4 h-4" />
                    </Button>
                    <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[40px] max-h-[120px]"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <Button onClick={handleSend} disabled={isSending || !newMessage.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
