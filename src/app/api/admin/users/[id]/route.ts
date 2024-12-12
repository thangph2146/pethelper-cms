import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import { User } from '@backend/models/User';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();

    // Không cho phép admin tự thay đổi role của chính mình
    if (params.id === session.user.id && body.role) {
      return NextResponse.json(
        { error: 'Không thể thay đổi vai trò của chính mình' },
        { status: 403 }
      );
    }

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