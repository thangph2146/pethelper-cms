'use client';

import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PostFiltersProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

export function PostFilters({ onFilterChange }: PostFiltersProps) {
  const [status, setStatus] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: Record<string, string> = {};
    if (status) filters.status = status;
    if (animalType) filters.animalType = animalType;
    if (searchTerm) filters.search = searchTerm;
    onFilterChange(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="need_help">Cần giúp đỡ</SelectItem>
            <SelectItem value="helping">Đang giúp đỡ</SelectItem>
            <SelectItem value="helped">Đã được giúp</SelectItem>
          </SelectContent>
        </Select>

        <Select value={animalType} onValueChange={setAnimalType}>
          <SelectTrigger>
            <SelectValue placeholder="Loại động vật" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dog">Chó</SelectItem>
            <SelectItem value="cat">Mèo</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm..."
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Áp dụng bộ lọc
        </Button>
      </div>
    </form>
  );
} 