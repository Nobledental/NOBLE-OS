import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authCookie = request.cookies.get('healthflo_user');

    // Protected routes: everything under /dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!authCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect /login to /dashboard if already logged in
    if (request.nextUrl.pathname === '/login') {
        if (authCookie) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
