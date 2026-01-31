'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    MessageCircle, ArrowRight, ArrowLeft,
    Smile, Meh, Frown, AlertTriangle, Phone
} from 'lucide-react';
import { COMPLICATION_CHAT_FLOW, ChatNode, ChatOption } from '@/lib/complication-bot';
import { AlertPriority } from '@/lib/postop-protocols';
import { hapticPatterns } from '@/components/gestures/ios-gestures';

// =============================================================================
// TYPES
// =============================================================================

interface ChatMessage {
    id: string;
    type: 'bot' | 'user';
    message: string;
    timestamp: Date;
}

interface ComplicationChatProps {
    patientName: string;
    procedureName: string;
    onComplete: (priority: AlertPriority, symptoms: string[], notes: string) => void;
    onEmergency: () => void;
}

// =============================================================================
// COMPLICATION CHAT COMPONENT
// =============================================================================

export function ComplicationChat({
    patientName,
    procedureName,
    onComplete,
    onEmergency
}: ComplicationChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentNodeId, setCurrentNodeId] = useState<string>('start');
    const [priority, setPriority] = useState<AlertPriority>('GREEN');
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    const currentNode = COMPLICATION_CHAT_FLOW.get(currentNodeId);

    const handleStart = useCallback(() => {
        setIsStarted(true);
        hapticPatterns.softTap();

        // Add welcome message
        const welcomeMsg: ChatMessage = {
            id: 'welcome',
            type: 'bot',
            message: `Hi ${patientName}! I'm here to check on your recovery after your ${procedureName}.`,
            timestamp: new Date()
        };
        setMessages([welcomeMsg]);

        // After a brief delay, show the first question
        setTimeout(() => {
            const firstNode = COMPLICATION_CHAT_FLOW.get('start');
            if (firstNode) {
                setMessages(prev => [...prev, {
                    id: 'start',
                    type: 'bot',
                    message: firstNode.message,
                    timestamp: new Date()
                }]);
            }
        }, 800);
    }, [patientName, procedureName]);

    const handleOptionSelect = useCallback((option: ChatOption) => {
        hapticPatterns.softTap();

        // Add user response
        setMessages(prev => [...prev, {
            id: `user-${Date.now()}`,
            type: 'user',
            message: option.label,
            timestamp: new Date()
        }]);

        // Update priority if specified
        if (option.setPriority) {
            setPriority(prev => {
                const priorityOrder = { GREEN: 0, YELLOW: 1, RED: 2, CRITICAL: 3 };
                // Only increase priority, never decrease
                if (priorityOrder[option.setPriority!] > priorityOrder[prev]) {
                    return option.setPriority!;
                }
                return prev;
            });
        }

        // Track symptoms
        if (option.value !== 'good') {
            setSymptoms(prev => [...prev, option.value]);
        }

        // Move to next node
        setTimeout(() => {
            const nextNode = COMPLICATION_CHAT_FLOW.get(option.next);
            if (nextNode) {
                setCurrentNodeId(option.next);

                // Handle actions
                if (nextNode.action) {
                    if (nextNode.action.type === 'create_alert' && nextNode.action.payload.emergency) {
                        hapticPatterns.warningVibration();
                    }
                }

                // Add bot message
                setMessages(prev => [...prev, {
                    id: `bot-${Date.now()}`,
                    type: 'bot',
                    message: nextNode.message,
                    timestamp: new Date()
                }]);

                // Check if end node
                if (nextNode.type === 'end') {
                    setIsComplete(true);
                    if (priority === 'CRITICAL') {
                        hapticPatterns.warningVibration();
                    } else {
                        hapticPatterns.successPulse();
                    }
                    onComplete(priority, symptoms, messages.map(m => m.message).join('\n'));
                }

                // Handle follow-up nodes
                if (nextNode.type === 'response' && nextNode.next) {
                    setTimeout(() => {
                        const followUp = COMPLICATION_CHAT_FLOW.get(nextNode.next!);
                        if (followUp) {
                            setCurrentNodeId(nextNode.next!);
                            setMessages(prev => [...prev, {
                                id: `bot-${Date.now() + 1}`,
                                type: 'bot',
                                message: followUp.message,
                                timestamp: new Date()
                            }]);

                            if (followUp.type === 'end') {
                                setIsComplete(true);
                                onComplete(priority, symptoms, messages.map(m => m.message).join('\n'));
                            }
                        }
                    }, 1500);
                }
            }
        }, 500);
    }, [priority, symptoms, messages, onComplete]);

    // Pre-start state
    if (!isStarted) {
        return (
            <Card className="p-6 max-w-md mx-auto text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Post-Op Check-in</h3>
                <p className="text-muted-foreground mb-6">
                    Let's check on your recovery after your {procedureName}.
                    This will only take a minute.
                </p>
                <Button onClick={handleStart} className="w-full">
                    Start Check-in
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">Recovery Check-in</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${priority === 'GREEN' ? 'bg-green-500' :
                            priority === 'YELLOW' ? 'bg-amber-500' :
                                priority === 'RED' ? 'bg-red-500' :
                                    'bg-red-600 animate-pulse'
                        }`}>
                        {priority}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-muted/20">
                <AnimatePresence mode="popLayout">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.type === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                                    : 'bg-white dark:bg-gray-800 shadow-sm rounded-bl-sm'
                                }`}>
                                <p className="text-sm">{msg.message}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Options */}
            {!isComplete && currentNode?.options && (
                <div className="p-4 border-t space-y-2">
                    {currentNode.options.map((option) => (
                        <Button
                            key={option.id}
                            variant="outline"
                            className="w-full justify-start text-left h-auto py-3"
                            onClick={() => handleOptionSelect(option)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            )}

            {/* Emergency button */}
            {priority === 'CRITICAL' && !isComplete && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border-t border-red-200">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                            hapticPatterns.warningVibration();
                            onEmergency();
                        }}
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Emergency Now
                    </Button>
                </div>
            )}

            {/* Complete state */}
            {isComplete && (
                <div className="p-4 border-t">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setIsStarted(false);
                            setMessages([]);
                            setCurrentNodeId('start');
                            setPriority('GREEN');
                            setSymptoms([]);
                            setIsComplete(false);
                        }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Start New Check-in
                    </Button>
                </div>
            )}
        </Card>
    );
}

// =============================================================================
// QUICK EMOJI FEEDBACK
// =============================================================================

interface EmojiCheckInProps {
    onSelect: (rating: 'good' | 'okay' | 'bad') => void;
}

export function EmojiCheckIn({ onSelect }: EmojiCheckInProps) {
    const options = [
        { value: 'good', icon: Smile, label: 'Great!', color: 'text-green-500 hover:bg-green-50' },
        { value: 'okay', icon: Meh, label: 'Okay', color: 'text-amber-500 hover:bg-amber-50' },
        { value: 'bad', icon: Frown, label: 'Not Good', color: 'text-red-500 hover:bg-red-50' }
    ] as const;

    return (
        <Card className="p-4">
            <p className="text-center text-muted-foreground mb-4">
                How are you feeling today?
            </p>
            <div className="flex justify-center gap-4">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => {
                            hapticPatterns.softTap();
                            onSelect(opt.value);
                        }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${opt.color}`}
                    >
                        <opt.icon className="w-10 h-10" />
                        <span className="text-sm font-medium">{opt.label}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
}
