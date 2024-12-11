import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { ApiError, handleApiError } from '@/lib/api';
import mongoose from 'mongoose';
import { IReport } from '@backend/models/Report';
import { IPost } from '@backend/models/Post';

const Report = mongoose.model<IReport>('Report');
const Post = mongoose.model<IPost>('Post');

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    await connectDB();

    const { postId, reason, description } = await req.json();

    if (!postId || !reason) {
      throw new ApiError(400, 'Missing required fields');
    }

    // Kiểm tra bài viết tồn tại
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, 'Post not found');
    }

    // Kiểm tra đã báo cáo chưa
    const existingReport = await Report.findOne({
      post: postId,
      reporter: session.user.id,
    });

    if (existingReport) {
      throw new ApiError(400, 'Bạn đã báo cáo bài viết này rồi');
    }

    const report = await Report.create({
      post: postId,
      reporter: session.user.id,
      reason,
      description,
      status: 'pending',
    });

    const populatedReport = await Report.findById(report._id)
      .populate('post', 'title')
      .populate('reporter', 'name email');

    return NextResponse.json({
      message: 'Báo cáo đã được gửi thành công',
      data: populatedReport,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.isAdmin) {
      throw new ApiError(403, 'Forbidden');
    }

    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;

    const reports = await Report.find({ status })
      .populate('post', 'title')
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Report.countDocuments({ status });

    return NextResponse.json({
      data: {
        reports,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
} 