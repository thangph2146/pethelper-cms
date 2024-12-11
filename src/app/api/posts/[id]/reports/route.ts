import { connectDB } from '@/lib/mongodb';
import { Report } from '@backend/models/Report';
import { Post } from '@backend/models/Post';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import type { IReport } from '@backend/models/Report';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { reason, description } = await req.json();
    if (!reason || !description) {
      return NextResponse.json(
        { message: 'Thiếu thông tin báo cáo' },
        { status: 400 }
      );
    }

    await connectDB();
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json(
        { message: 'Không tìm thấy bài đăng' },
        { status: 404 }
      );
    }

    const report = await Report.create({
      reporter: session.user.id,
      post: params.id,
      reason,
      description,
    });

    const populatedReport = await Report.findById(report._id)
      .populate('reporter', 'name image')
      .populate('post', 'title')
      .lean<IReport>();

    return NextResponse.json({
      data: populatedReport,
      message: 'Báo cáo đã được gửi'
    });
  } catch (error) {
    console.error('Error in POST /posts/[id]/reports:', error);
    return NextResponse.json(
      { message: 'Lỗi khi gửi báo cáo' },
      { status: 500 }
    );
  }
} 