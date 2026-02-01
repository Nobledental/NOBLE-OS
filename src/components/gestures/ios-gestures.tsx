'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo, HTMLMotionProps } from 'framer-motion';
import { Trash2, Check, MoreHorizontal, X } from 'lucide-react';
import { triggerHaptic } from '@/components/navigation/navigation-components';

// =============================================================================
// HAPTIC PATTERNS
// =============================================================================

export const hapticPatterns = {
    // Soft tap - appointment confirmed
    softTap: () => triggerHaptic(10),

    // Success pulse - payment recorded
    successPulse: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([10, 50, 10]);
        }
    },

    // Warning shake - slot already taken
    warningShake: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([30, 30, 30, 30, 30]);
        }
    },

    // Heavy impact - delete action
    heavyImpact: () => triggerHaptic(50),

    // Selection tick
    selectionTick: () => triggerHaptic(5)
};

// =============================================================================
// SWIPE-TO-ACTION LIST ITEM
// =============================================================================

interface SwipeableItemProps {
    children: React.ReactNode;
    onDelete?: () => void;
    onComplete?: () => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    leftAction?: { icon: React.ReactNode; color: string; label: string };
    rightAction?: { icon: React.ReactNode; color: string; label: string };
    threshold?: number;
    className?: string;
}

export function SwipeableItem({
    children,
    onDelete,
    onComplete,
    onSwipeLeft,
    onSwipeRight,
    leftAction = { icon: <Check className="w-5 h-5" />, color: 'bg-green-500', label: 'Complete' },
    rightAction = { icon: <Trash2 className="w-5 h-5" />, color: 'bg-red-500', label: 'Delete' },
    threshold = 100,
    className = ''
}: SwipeableItemProps) {
    const [isRemoving, setIsRemoving] = useState(false);
    const x = useMotionValue(0);

    // Transform for background reveal
    const leftBgOpacity = useTransform(x, [0, threshold], [0, 1]);
    const rightBgOpacity = useTransform(x, [-threshold, 0], [1, 0]);
    const leftScale = useTransform(x, [0, threshold], [0.5, 1]);
    const rightScale = useTransform(x, [-threshold, 0], [1, 0.5]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        const swipeThreshold = threshold;

        if (info.offset.x > swipeThreshold) {
            // Swiped right - complete action
            hapticPatterns.successPulse();
            if (onComplete) {
                setIsRemoving(true);
                setTimeout(() => onComplete(), 200);
            } else if (onSwipeRight) {
                onSwipeRight();
            }
        } else if (info.offset.x < -swipeThreshold) {
            // Swiped left - delete action
            hapticPatterns.heavyImpact();
            if (onDelete) {
                setIsRemoving(true);
                setTimeout(() => onDelete(), 200);
            } else if (onSwipeLeft) {
                onSwipeLeft();
            }
        }
    };

    return (
        <AnimatePresence>
            {!isRemoving && (
                <motion.div
                    className={`relative overflow-hidden ${className}`}
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Left action background (swipe right to reveal) */}
                    <motion.div
                        className={`absolute inset-y-0 left-0 ${leftAction.color} flex items-center px-4 text-white`}
                        style={{ opacity: leftBgOpacity }}
                    >
                        <motion.div style={{ scale: leftScale }} className="flex items-center gap-2">
                            {leftAction.icon}
                            <span className="text-sm font-medium">{leftAction.label}</span>
                        </motion.div>
                    </motion.div>

                    {/* Right action background (swipe left to reveal) */}
                    <motion.div
                        className={`absolute inset-y-0 right-0 ${rightAction.color} flex items-center justify-end px-4 text-white`}
                        style={{ opacity: rightBgOpacity }}
                    >
                        <motion.div style={{ scale: rightScale }} className="flex items-center gap-2">
                            <span className="text-sm font-medium">{rightAction.label}</span>
                            {rightAction.icon}
                        </motion.div>
                    </motion.div>

                    {/* Main content */}
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        style={{ x }}
                        whileTap={{ cursor: 'grabbing' }}
                        className="relative bg-background z-10"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// =============================================================================
// SPRING MODAL
// =============================================================================

interface SpringModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    originPoint?: { x: number; y: number };
    className?: string;
}

export function SpringModal({
    isOpen,
    onClose,
    children,
    originPoint,
    className = ''
}: SpringModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Calculate transform origin from touch point
    const transformOrigin = originPoint
        ? `${originPoint.x}px ${originPoint.y}px`
        : 'center center';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        ref={modalRef}
                        className={`fixed z-50 glass-card-heavy ${className}`}
                        style={{
                            transformOrigin,
                            left: '50%',
                            top: '50%',
                            x: '-50%',
                            y: '-50%'
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            transition: {
                                type: 'spring',
                                stiffness: 300,
                                damping: 30
                            }
                        }}
                        exit={{
                            scale: 0,
                            opacity: 0,
                            transition: { duration: 0.15 }
                        }}
                        onClick={() => hapticPatterns.softTap()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// =============================================================================
// RADIAL MENU (Long-Press)
// =============================================================================

interface RadialMenuItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    color: string;
    onClick: () => void;
}

interface RadialMenuProps {
    isOpen: boolean;
    onClose: () => void;
    position: { x: number; y: number };
    items: RadialMenuItem[];
    radius?: number;
}

export function RadialMenu({
    isOpen,
    onClose,
    position,
    items,
    radius = 80
}: RadialMenuProps) {
    const angleStep = (2 * Math.PI) / items.length;
    const startAngle = -Math.PI / 2; // Start from top

    const handleItemClick = (item: RadialMenuItem) => {
        hapticPatterns.successPulse();
        item.onClick();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Center indicator */}
                    <motion.div
                        className="fixed w-12 h-12 rounded-full bg-primary/20 border-2 border-primary z-50"
                        style={{
                            left: position.x - 24,
                            top: position.y - 24
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    />

                    {/* Radial items */}
                    {items.map((item, index) => {
                        const angle = startAngle + index * angleStep;
                        const x = position.x + radius * Math.cos(angle) - 28;
                        const y = position.y + radius * Math.sin(angle) - 28;

                        return (
                            <motion.button
                                key={item.id}
                                className={`fixed w-14 h-14 rounded-full ${item.color} text-white shadow-lg z-50 flex flex-col items-center justify-center gap-0.5`}
                                style={{ left: x, top: y }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    transition: {
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 25,
                                        delay: index * 0.05
                                    }
                                }}
                                exit={{
                                    scale: 0,
                                    opacity: 0,
                                    transition: { delay: (items.length - index) * 0.02 }
                                }}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleItemClick(item)}
                            >
                                {item.icon}
                                <span className="text-[8px] font-medium">{item.label}</span>
                            </motion.button>
                        );
                    })}
                </>
            )}
        </AnimatePresence>
    );
}

// =============================================================================
// LONG-PRESS HOOK
// =============================================================================

interface LongPressOptions {
    delay?: number;
    onLongPress: (e: React.TouchEvent | React.MouseEvent) => void;
    onPress?: () => void;
}

export function useLongPress({ delay = 500, onLongPress, onPress }: LongPressOptions) {
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const [isLongPressed, setIsLongPressed] = useState(false);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    const start = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        // Store initial position
        if ('touches' in e) {
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }

        timeoutRef.current = setTimeout(() => {
            setIsLongPressed(true);
            hapticPatterns.heavyImpact();
            onLongPress(e);
        }, delay);
    }, [delay, onLongPress]);

    const cancel = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // If it wasn't a long press, treat as regular tap
        if (!isLongPressed && onPress) {
            onPress();
        }

        setIsLongPressed(false);
        touchStartRef.current = null;
    }, [isLongPressed, onPress]);

    const move = useCallback((e: React.TouchEvent) => {
        if (touchStartRef.current && timeoutRef.current) {
            const moveThreshold = 10;
            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;
            const distance = Math.sqrt(
                Math.pow(x - touchStartRef.current.x, 2) +
                Math.pow(y - touchStartRef.current.y, 2)
            );

            if (distance > moveThreshold) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, []);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        onTouchStart: start,
        onTouchEnd: cancel,
        onTouchMove: move,
        onMouseDown: start,
        onMouseUp: cancel,
        onMouseLeave: cancel,
        isLongPressed
    };
}

// =============================================================================
// SPRING BUTTON
// =============================================================================

interface SpringButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'default' | 'primary' | 'success' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export function SpringButton({
    variant = 'default',
    size = 'md',
    children,
    className = '',
    onClick,
    ...props
}: SpringButtonProps) {
    const variants = {
        default: 'bg-muted hover:bg-muted/80',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        success: 'bg-green-500 text-white hover:bg-green-600',
        danger: 'bg-red-500 text-white hover:bg-red-600'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        hapticPatterns.softTap();
        onClick?.(e);
    };

    return (
        <motion.button
            className={`rounded-xl font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={handleClick}
            {...props}
        >
            {children}
        </motion.button>
    );
}
