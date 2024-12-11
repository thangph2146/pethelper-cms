'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const files = e.target.files;
      if (!files) return;

      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      onChange([...value, ...urls]);
    } catch (error) {
      console.error('Error uploading:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const onRemove = (urlToRemove: string) => {
    onChange(value.filter(url => url !== urlToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {value.map((url) => (
          <div key={url} className="relative aspect-square">
            <Image
              src={url}
              alt="Upload"
              className="object-cover rounded-lg"
              fill
            />
            <button
              onClick={() => onRemove(url)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              type="button"
            >
              ×
            </button>
          </div>
        ))}
        <label className="relative aspect-square border-2 border-dashed rounded-lg hover:bg-gray-50 transition cursor-pointer">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Upload className="w-6 h-6" />
            <span className="text-sm">Upload ảnh</span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onUpload}
            disabled={disabled || isUploading}
            className="hidden"
          />
        </label>
      </div>
      {isUploading && (
        <div className="text-sm text-gray-600">Đang tải ảnh lên...</div>
      )}
    </div>
  );
} 