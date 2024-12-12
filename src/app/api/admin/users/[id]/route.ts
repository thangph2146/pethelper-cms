import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { User } from '@backend/models/User';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
   
    const body = await req.json();

    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    ).select('name email role status');

    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error updating user:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 