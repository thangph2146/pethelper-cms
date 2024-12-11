import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import { Post } from '@backend/models/Post';
import { ApiError } from '@/lib/api';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role !== 'admin') {
      throw new ApiError('Unauthorized', 401);
    }

    await dbConnect();

    const [total, pending, inProgress, resolved] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: 'cần_giúp_đỡ' }),
      Post.countDocuments({ status: 'đang_hỗ_trợ' }),
      Post.countDocuments({ status: 'đã_giải_quyết' })
    ]);

    return NextResponse.json({
      data: {
        total,
        pending,
        inProgress,
        resolved,
        stats: {
          byType: await Post.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
          ]),
          byUrgency: await Post.aggregate([
            { $group: { _id: '$urgency', count: { $sum: 1 } } }
          ]),
          byMonth: await Post.aggregate([
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
          ])
        }
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Lỗi khi lấy thống kê' },
      { status: 500 }
    );
  }
} 