import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Notification from '@backend/models/Notification';

export async function GET() {
  try {
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Notification error:', message);
    return NextResponse.json(
      { error: { message, code: 'NOTIFICATION_ERROR' } },
      { status: 500 }
    );
  }
} 