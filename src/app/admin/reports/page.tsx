'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReportService } from '@/services/report.service';

interface ReportResponse {
  _id: string;
  postId: {
    _id: string;
    title: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const STATUS_LABELS = {
  pending: 'Chờ xử lý',
  resolved: 'Đã xử lý',
  rejected: 'Đã từ chối'
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

export default function AdminReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await ReportService.getReports() as { reports: ReportResponse[] };
        setReports(data.reports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchReports();
    }
  }, [session]);

  const handleStatusChange = async (reportId: string, newStatus: 'resolved' | 'rejected') => {
    try {
      await ReportService.updateReportStatus(reportId, newStatus);
      setReports(prev =>
        prev.map(report =>
          report._id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  if (status === 'loading' || loading) return <div>Đang tải...</div>;

  if (!session?.user || session.user.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Quản lý báo cáo</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Bài đăng</th>
              <th className="px-6 py-3 text-left">Người báo cáo</th>
              <th className="px-6 py-3 text-left">Lý do</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Ngày báo cáo</th>
              <th className="px-6 py-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reports.map(report => (
              <tr key={report._id}>
                <td className="px-6 py-4">
                  <a
                    href={`/posts/${report.postId._id}`}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {report.postId.title}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p>{report.userId.name}</p>
                    <p className="text-sm text-gray-500">{report.userId.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p>{report.reason}</p>
                  {report.description && (
                    <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${STATUS_COLORS[report.status]}`}>
                    {STATUS_LABELS[report.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4">
                  {report.status === 'pending' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleStatusChange(report._id!, 'resolved')}
                        className="block text-green-600 hover:text-green-800"
                      >
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => handleStatusChange(report._id!, 'rejected')}
                        className="block text-red-600 hover:text-red-800"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 