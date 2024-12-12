'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { usePostService } from '@/hooks/use-post-service';
import { toast } from 'sonner';
import { ReportDialogProps } from '@/types/post';

export function ReportDialog({ open, onOpenChange, postId }: ReportDialogProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { reportPost } = usePostService();

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do báo cáo');
      return;
    }

    try {
      setIsSubmitting(true);
      await reportPost(postId, reason);
      toast.success('Đã gửi báo cáo');
      onOpenChange(false);
      setReason('');
    } catch (error) {
      toast.error('Không thể gửi báo cáo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Báo cáo bài viết</DialogTitle>
          <DialogDescription>
            Vui lòng cho chúng tôi biết lý do bạn báo cáo bài viết này
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Nhập lý do báo cáo..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 