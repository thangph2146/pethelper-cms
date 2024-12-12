import { memo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PostImagesProps {
  images: string[];
  onImageClick?: (image: string) => void;
}

export const PostImages = memo(({ images, onImageClick }: PostImagesProps) => {
  return (
    <div className={cn(
      "grid gap-2 mt-4",
      images.length === 1 ? "grid-cols-1" : 
      images.length === 2 ? "grid-cols-2" :
      images.length === 3 ? "grid-cols-2" : "grid-cols-2",
      images.length === 3 && "md:grid-cols-3"
    )}>
      {images.slice(0, 4).map((image, index) => (
        <div 
          key={index}
          className={cn(
            "relative rounded-md overflow-hidden cursor-zoom-in group/image",
            images.length === 1 ? "aspect-video" : "aspect-square",
            index === 0 && images.length === 3 && "col-span-2 md:col-span-1"
          )}
          onClick={() => onImageClick?.(image)}
        >
          <Image
            src={image}
            alt={`Ảnh ${index + 1}`}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover/image:scale-105"
          />
        </div>
      ))}
    </div>
  );
}); 