'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    MessageSquare, Send, Paperclip, User,
    Stethoscope, Clock, CheckCheck
} from 'lucide-react';
import { ConsultantNote } from '@/types/consultant.types';

interface ConsultantDiscussionProps {
    caseAssignmentId: string;
    currentUserId: string;
    currentUserRole: 'chief_dentist' | 'consultant';
    currentUserName: string;
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
    }
];

export default function ConsultantDiscussion({
    caseAssignmentId,
    currentUserId,
    currentUserRole,
    currentUserName
}: ConsultantDiscussionProps) {
    const [notes, setNotes] = useState<ConsultantNote[]>(mockNotes);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

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
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Case Discussion</h3>
                </div>
                <Badge variant="secondary">
                    Internal • Not visible to patient
                </Badge>
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
                                    {isChief
                                        ? <User className="w-3 h-3" />
                                        : <Stethoscope className="w-3 h-3" />
                                    }
                                    <span className={`text-xs font-medium ${isMe ? 'text-blue-100' : 'text-muted-foreground'
                                        }`}>
                                        {note.authorName}
                                    </span>
                                </div>

                                {/* Content */}
                                <p className="text-sm">{note.content}</p>

                                {/* Attachments */}
                                {note.attachments && note.attachments.length > 0 && (
                                    <div className="mt-2 flex gap-2">
                                        {note.attachments.map((att, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                                <Paperclip className="w-3 h-3 mr-1" />
                                                {att.name}
                                            </Badge>
                                        ))}
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
