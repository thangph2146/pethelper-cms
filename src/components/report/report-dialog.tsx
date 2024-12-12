'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Flag } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReportDialogProps {
  postId: string;
}

const REPORT_REASONS = [
  { id: 'spam', label: 'Spam' },
  { id: 'inappropriate', label: 'Nội dung không phù hợp' },
  { id: 'fake', label: 'Thông tin giả mạo' },
  { id: 'other', label: 'Khác' },
];

export function ReportDialog({ postId }: ReportDialogProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      toast.error('Vui lòng chọn lý do báo cáo');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          reason: selectedReason,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Có lỗi xảy ra');
      }

      toast.success('Báo cáo đã được gửi thành công');
      setIsOpen(false);
      setSelectedReason('');
      setDescription('');
    } catch {
      toast.error('Có lỗi xảy ra khi gửi báo cáo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
          <Flag className="w-4 h-4 mr-2" />
          Báo cáo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Báo cáo bài viết</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lý do báo cáo</label>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_REASONS.map((reason) => (
                <Button
                  key={reason.id}
                  type="button"
                  variant={selectedReason === reason.id ? 'default' : 'outline'}
                  onClick={() => setSelectedReason(reason.id)}
                >
                  {reason.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả chi tiết</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết về vấn đề..."
              rows={4}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 