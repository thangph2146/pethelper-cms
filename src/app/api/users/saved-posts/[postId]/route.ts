import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { User } from '@backend/models/User';
export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
  


    return NextResponse.json({ message: 'Đã lưu bài đăng' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Saved post error:', message);
    return NextResponse.json(
      { error: { message, code: 'SAVE_POST_ERROR' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Delete file error:', message);
    return NextResponse.json(
      { error: { message, code: 'DELETE_FILE_ERROR' } },
      { status: 500 }
    );
  }
} 