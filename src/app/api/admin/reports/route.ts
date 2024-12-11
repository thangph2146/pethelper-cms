import { connectDB } from '@/lib/mongodb';
import { Report } from '@backend/models/Report';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import type { IReport } from '@backend/models/Report';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    await connectDB();
    
    const [reports, total] = await Promise.all([
      Report.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('reporter', 'name image')
        .populate('post', 'title')
        .lean<IReport[]>(),
      Report.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: {
        reports,
        total,
        page,
        totalPages,
      }
    });
  } catch (error) {
    console.error('Error in GET /admin/reports:', error);
    return NextResponse.json(
      { message: 'Lỗi khi lấy danh sách báo cáo' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { status } = await req.json();
    if (!status || !['resolved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { message: 'Trạng thái không hợp lệ' },
        { status: 400 }
      );
    }

    await connectDB();
    const report = await Report.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    ).lean<IReport>();

    if (!report) {
      return NextResponse.json(
        { message: 'Không tìm thấy báo cáo' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: report,
      message: 'Cập nhật trạng thái thành công'
    });
  } catch (error) {
    console.error('Error in PATCH /admin/reports:', error);
    return NextResponse.json(
      { message: 'Lỗi khi cập nhật trạng thái' },
      { status: 500 }
    );
  }
} 