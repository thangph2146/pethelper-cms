import { NextResponse } from 'next/server';

export async function POST() {
  try {
   
  

    return NextResponse.json({ message: 'Đã đánh dấu tất cả là đã đọc' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Read all notifications error:', message);
    return NextResponse.json(
      { error: { message, code: 'READ_ALL_NOTIFICATIONS_ERROR' } },
      { status: 500 }
    );
  }
} 