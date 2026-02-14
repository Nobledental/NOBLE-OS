/**
 * Type declarations for modules without TypeScript definitions
 */

declare module 'react-to-print' {
    import { ReactInstance } from 'react';

    export interface UseReactToPrintOptions {
        content?: () => ReactInstance | null;
        contentRef?: React.RefObject<any>;
        documentTitle?: string;
        onAfterPrint?: () => void;
        onBeforeGetContent?: () => void | Promise<void>;
        onBeforePrint?: () => void | Promise<void>;
        onPrintError?: (errorLocation: 'onBeforeGetContent' | 'onBeforePrint' | 'print', error: Error) => void;
        pageStyle?: string;
        print?: (target: HTMLIFrameElement) => Promise<void>;
        removeAfterPrint?: boolean;
        suppressErrors?: boolean;
    }

    export function useReactToPrint(options: UseReactToPrintOptions): () => void;
}
