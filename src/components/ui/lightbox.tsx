'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  initialIndex?: number;
}

export function Lightbox({ open, onOpenChange, images, initialIndex = 0 }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-7xl h-[90vh] p-0 bg-transparent border-none"
        onKeyDown={handleKeyDown}
      >
        <div className="relative h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 z-10 rounded-full bg-background/20 hover:bg-background/40"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="relative w-full h-full">
            <Image
              src={images[currentIndex]}
              alt={`Ảnh ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 z-10 rounded-full bg-background/20 hover:bg-background/40"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentIndex 
                    ? "bg-primary" 
                    : "bg-primary/20 hover:bg-primary/40"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 rounded-full bg-background/20 hover:bg-background/40"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 