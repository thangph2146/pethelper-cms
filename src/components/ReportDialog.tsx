import { useState } from 'react';
import { ReportService } from '@/services/report.service';

const REPORT_REASONS = [
  { value: 'inappropriate', label: 'Nội dung không phù hợp' },
  { value: 'spam', label: 'Spam' },
  { value: 'fake', label: 'Thông tin giả mạo' },
  { value: 'other', label: 'Lý do khác' }
];

interface ReportDialogProps {
  postId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportDialog = ({ postId, onClose, onSuccess }: ReportDialogProps) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    try {
      setLoading(true);
      await ReportService.createReport(postId, {
        reason,
        description: description.trim() || undefined
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Có lỗi xảy ra khi gửi báo cáo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Báo cáo bài đăng</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Lý do báo cáo</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Chọn lý do</option>
              {REPORT_REASONS.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Mô tả chi tiết (không bắt buộc)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="Nhập mô tả chi tiết về vấn đề..."
            />
          </div>

          {error && (
            <div className="text-red-500">{error}</div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              disabled={loading || !reason}
            >
              {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 