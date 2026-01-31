/**
 * Phase 23: Security Layer - AES-256 Encryption & Rate Limiting
 * 
 * Client-side encryption utilities for sensitive data
 * Note: For true security, use server-side encryption via NestJS
 */

// =============================================================================
// AES-256-GCM ENCRYPTION (Web Crypto API)
// =============================================================================

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const TAG_LENGTH = 128;

/**
 * Generate a random encryption key
 */
export async function generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
        {
            name: ALGORITHM,
            length: KEY_LENGTH
        },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Export key to base64 for storage
 */
export async function exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

/**
 * Import key from base64
 */
export async function importKey(base64Key: string): Promise<CryptoKey> {
    const keyData = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    return crypto.subtle.importKey(
        'raw',
        keyData,
        { name: ALGORITHM, length: KEY_LENGTH },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypt data using AES-256-GCM
 */
export async function encrypt(plaintext: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: ALGORITHM,
            iv,
            tagLength: TAG_LENGTH
        },
        key,
        data
    );

    // Combine IV + ciphertext
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt data using AES-256-GCM
 */
export async function decrypt(ciphertext: string, key: CryptoKey): Promise<string> {
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

    // Extract IV and ciphertext
    const iv = combined.slice(0, IV_LENGTH);
    const data = combined.slice(IV_LENGTH);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: ALGORITHM,
            iv,
            tagLength: TAG_LENGTH
        },
        key,
        data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

// =============================================================================
// HASHING (for integrity verification)
// =============================================================================

/**
 * SHA-256 hash
 */
export async function hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

/**
 * Generate HMAC for data integrity
 */
export async function generateHMAC(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Verify HMAC
 */
export async function verifyHMAC(data: string, signature: string, secret: string): Promise<boolean> {
    const expected = await generateHMAC(data, secret);
    return signature === expected;
}

// =============================================================================
// RATE LIMITING (Client-Side)
// =============================================================================

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

interface RateLimitState {
    requests: number[];
    blocked: boolean;
}

const rateLimitStore = new Map<string, RateLimitState>();

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
    key: string,
    config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    let state = rateLimitStore.get(key);

    if (!state) {
        state = { requests: [], blocked: false };
        rateLimitStore.set(key, state);
    }

    // Remove old requests outside window
    state.requests = state.requests.filter(t => now - t < config.windowMs);

    const remaining = Math.max(0, config.maxRequests - state.requests.length);
    const oldestRequest = state.requests[0] || now;
    const resetMs = oldestRequest + config.windowMs - now;

    if (state.requests.length >= config.maxRequests) {
        return { allowed: false, remaining: 0, resetMs };
    }

    // Add this request
    state.requests.push(now);

    return { allowed: true, remaining: remaining - 1, resetMs };
}

/**
 * Create a rate-limited fetch wrapper
 */
export function createRateLimitedFetch(
    config: RateLimitConfig = { maxRequests: 50, windowMs: 60000 }
) {
    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const key = typeof input === 'string' ? input : input.toString();
        const check = checkRateLimit(key, config);

        if (!check.allowed) {
            throw new Error(`Rate limited. Try again in ${Math.ceil(check.resetMs / 1000)}s`);
        }

        return fetch(input, init);
    };
}

// =============================================================================
// DATA MASKING UTILITIES
// =============================================================================

/**
 * Mask phone number: 9876543210 → 98******10
 */
export function maskPhone(phone: string): string {
    if (phone.length < 6) return '***';
    return phone.slice(0, 2) + '*'.repeat(phone.length - 4) + phone.slice(-2);
}

/**
 * Mask email: john.doe@email.com → j***e@e***.com
 */
export function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return '***@***.***';

    const maskedLocal = local.length > 2
        ? local[0] + '*'.repeat(local.length - 2) + local.slice(-1)
        : '***';

    const [domainName, tld] = domain.split('.');
    const maskedDomain = domainName.length > 2
        ? domainName[0] + '*'.repeat(domainName.length - 2) + domainName.slice(-1)
        : '***';

    return `${maskedLocal}@${maskedDomain}.${tld}`;
}

/**
 * Mask name: John Doe → J*** D**
 */
export function maskName(name: string): string {
    return name.split(' ').map(part =>
        part.length > 1 ? part[0] + '*'.repeat(part.length - 1) : '*'
    ).join(' ');
}

/**
 * Mask money: ₹50,000 → ₹**,***
 */
export function maskMoney(amount: string | number): string {
    const str = typeof amount === 'number' ? amount.toString() : amount;
    return str.replace(/\d/g, '*');
}

/**
 * Mask Aadhaar: 1234 5678 9012 → XXXX XXXX 9012
 */
export function maskAadhaar(aadhaar: string): string {
    const digits = aadhaar.replace(/\s/g, '');
    if (digits.length !== 12) return 'XXXX XXXX XXXX';
    return `XXXX XXXX ${digits.slice(-4)}`;
}

// =============================================================================
// SECURE SESSION HELPERS
// =============================================================================

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * CSRF token generator
 */
export function generateCSRFToken(): string {
    return generateSecureToken(32);
}

/**
 * Timing-safe string comparison (prevents timing attacks)
 */
export function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}
