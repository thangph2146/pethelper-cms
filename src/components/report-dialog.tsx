import React, { memo, useCallback } from 'react';
import { Dialog } from '@/components/ui/dialog';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  onClose?: () => void;
}

export const ReportDialog = memo(({
  open,
  onOpenChange,
  postId,
  onClose
}: ReportDialogProps) => {
  const handleClose = useCallback(() => {
    onOpenChange(false);
    onClose?.();
  }, [onOpenChange, onClose]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* ... */}
    </Dialog>
  );
}); 