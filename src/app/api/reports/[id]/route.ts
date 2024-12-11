import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { Report } from '@backend/models/Report';
import { connectDB } from '@/lib/mongodb';
import { ApiError, handleApiError } from '@/lib/api';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user.isAdmin) {
      throw new ApiError(403, 'Forbidden');
    }

    await connectDB();

    const { status } = await req.json();
    if (!['resolved', 'rejected'].includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const report = await Report.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )
      .populate('post')
      .populate('reporter', 'name email');

    if (!report) {
      throw new ApiError(404, 'Report not found');
    }

    return NextResponse.json({
      message: 'Cập nhật trạng thái báo cáo thành công',
      data: report,
    });
  } catch (error) {
    return handleApiError(error);
  }
} 