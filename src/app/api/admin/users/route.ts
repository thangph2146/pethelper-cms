import { NextResponse } from 'next/server';
import { User } from '@backend/models/User';

export async function GET() {
  try {
    const users = await User.find()
      .select('name email role status createdAt')
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching users:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 