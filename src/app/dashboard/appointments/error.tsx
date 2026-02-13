'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to console in development
        console.error('Appointments page error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[600px] p-8">
            <div className="max-w-md w-full space-y-6 text-center">
                {/* Error Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Something went wrong
                    </h2>
                    <p className="text-slate-500 text-sm">
                        We encountered an error while loading your appointments.
                        This might be a temporary issue.
                    </p>
                    {error.message && (
                        <p className="text-xs text-slate-400 font-mono bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {error.message}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                    <Link href="/dashboard">
                        <Button variant="outline" className="gap-2 w-full sm:w-auto">
                            <Home className="w-4 h-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <p className="text-xs text-slate-400">
                    If this issue persists, please contact your system administrator.
                </p>
            </div>
        </div>
    );
}
