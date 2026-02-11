import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Mock success response
        // In a real app, this would insert into the database
        console.log("Mock Saving Clinical Note:", body);

        return NextResponse.json({
            success: true,
            data: {
                id: Math.random().toString(36).substring(7),
                ...body,
                created_at: new Date().toISOString()
            }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Invalid request' },
            { status: 400 }
        );
    }
}
