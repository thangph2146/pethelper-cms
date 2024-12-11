import { NextRequest, NextResponse } from 'next/server';
import { Post } from '@backend/models/Post';
import connectDB from '@/lib/mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const posts = await Post.find({ author: params.id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: posts
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error },
      { status: 500 }
    );
  }
} 