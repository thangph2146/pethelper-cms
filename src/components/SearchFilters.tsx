'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X, MapPin, Star, Share2, Calendar, Eye, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  POST_TYPE_LABELS, 
  POST_STATUS_LABELS, 
  POST_URGENCY_LABELS,
  DISTANCE_OPTIONS,
  TIME_RANGE_OPTIONS,
  type PostFilters 
} from '@/types/post';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays, subDays } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useReadPosts } from '@/hooks/use-read-posts';
import { useStarredPosts } from '@/hooks/use-starred-posts';
import { Switch } from '@/components/ui/switch';

interface SearchFiltersProps {
  filters: PostFilters;
  onFilterChange: (filters: Partial<PostFilters>) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useLocalStorage<PostFilters[]>('saved-filters', []);
  const activeFiltersCount = Object.keys(filters).filter(key => filters[key] !== undefined).length;
  const { readPosts, clearReadPosts } = useReadPosts();
  const { starredPosts, clearStarredPosts } = useStarredPosts();

  const handleClearFilters = () => {
    onFilterChange({});
    setIsOpen(false);
  };

  const handleSaveFilters = () => {
    if (activeFiltersCount === 0) {
      toast.error('Không có bộ lọc nào để lưu');
      return;
    }

    setSavedFilters(prev => {
      const newFilters = [...prev];
      if (newFilters.length >= 3) {
        newFilters.pop();
      }
      return [filters, ...newFilters];
    });
    toast.success('Đã lưu bộ lọc');
  };

  const handleShareFilters = async () => {
    if (activeFiltersCount === 0) {
      toast.error('Không có bộ lọc nào để chia sẻ');
      return;
    }

    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`
      );
      toast.success('Đã sao chép liên kết');
    } catch (error) {
      toast.error('Không thể sao chép liên kết');
    }
  };

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    onFilterChange({ 
      dateFrom: range.from.toISOString(),
      dateTo: range.to.toISOString()
    });
  };

  const handleQuickDateSelect = (value: string) => {
    const today = new Date();
    let from: Date, to: Date;

    switch (value) {
      case 'today':
        from = new Date(today.setHours(0, 0, 0, 0));
        to = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'week':
        from = subDays(today, 7);
        to = today;
        break;
      case 'month':
        from = subDays(today, 30);
        to = today;
        break;
      default:
        return;
    }

    handleDateRangeChange({ from, to });
  };

  const handleClearAllHistory = () => {
    clearReadPosts();
    clearStarredPosts();
    onFilterChange({
      readStatus: undefined,
      starred: undefined
    });
    toast.success('Đã xóa lịch sử');
  };

  return (
    <>
      {/* Mobile View */}
      <div className="flex w-full flex-col gap-2 sm:hidden">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              value={filters.keyword || ''}
              onChange={(e) => onFilterChange({ keyword: e.target.value })}
              className="pl-9 w-full"
            />
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  Bộ lọc
                  {activeFiltersCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleClearFilters}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <MobileFilterSelect
                  label="Loại động vật"
                  value={filters.type}
                  options={POST_TYPE_LABELS}
                  onChange={(value) => onFilterChange({ type: value })}
                />
                <MobileFilterSelect
                  label="Trạng thái"
                  value={filters.status}
                  options={POST_STATUS_LABELS}
                  onChange={(value) => onFilterChange({ status: value })}
                />
                <MobileFilterSelect
                  label="Mức độ"
                  value={filters.urgency}
                  options={POST_URGENCY_LABELS}
                  onChange={(value) => onFilterChange({ urgency: value })}
                />
                <MobileFilterSelect
                  label="Khoảng cách"
                  value={filters.distance?.toString()}
                  options={DISTANCE_OPTIONS}
                  onChange={(value) => onFilterChange({ 
                    distance: value ? parseInt(value) : undefined 
                  })}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Thời gian</label>
                  <Select
                    value={filters.timeRange || 'all'}
                    onValueChange={handleQuickDateSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khoảng thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TIME_RANGE_OPTIONS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <DatePickerWithRange
                      from={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                      to={filters.dateTo ? new Date(filters.dateTo) : undefined}
                      onSelect={handleDateRangeChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái đọc</label>
                  <Select
                    value={filters.readStatus || 'all'}
                    onValueChange={(value) => onFilterChange({ 
                      readStatus: value === 'all' ? undefined : value as 'read' | 'unread'
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(READ_STATUS_OPTIONS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={filters.starred}
                    onCheckedChange={(checked) => onFilterChange({ starred: checked })}
                    className="data-[state=checked]:bg-yellow-500"
                  />
                  <label className="text-sm">
                    Đã đánh dấu
                  </label>
                </div>
                {(readPosts.length > 0 || starredPosts.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllHistory}
                    className="w-full"
                  >
                    Xóa lịch sử đọc và đánh dấu
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {savedFilters.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Đã lưu:
            </span>
            {savedFilters.map((savedFilter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onFilterChange(savedFilter)}
                className="h-8 whitespace-nowrap"
              >
                Bộ lọc {index + 1}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={filters.keyword || ''}
            onChange={(e) => onFilterChange({ keyword: e.target.value })}
            className="pl-9 w-[200px]"
          />
        </div>

        <Select
          value={filters.type || 'all'}
          onValueChange={(value) => onFilterChange({ type: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className={cn(
            "w-[140px]",
            filters.type && "border-primary"
          )}>
            <SelectValue placeholder="Loại động vật" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(POST_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => onFilterChange({ status: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className={cn(
            "w-[160px]",
            filters.status && "border-primary"
          )}>
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(POST_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.urgency || 'all'}
          onValueChange={(value) => onFilterChange({ urgency: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className={cn(
            "w-[140px]",
            filters.urgency && "border-primary"
          )}>
            <SelectValue placeholder="Mức độ" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(POST_URGENCY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.distance?.toString() || 'all'}
          onValueChange={(value) => onFilterChange({ 
            distance: value === 'all' ? undefined : parseInt(value) 
          })}
        >
          <SelectTrigger className={cn(
            "w-[140px]",
            filters.distance && "border-primary"
          )}>
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Khoảng cách" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DISTANCE_OPTIONS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.readStatus || 'all'}
          onValueChange={(value) => onFilterChange({ 
            readStatus: value === 'all' ? undefined : value as 'read' | 'unread'
          })}
        >
          <SelectTrigger className={cn(
            "w-[140px]",
            filters.readStatus && "border-primary"
          )}>
            <Eye className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Trạng thái đọc" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(READ_STATUS_OPTIONS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Switch
            checked={filters.starred}
            onCheckedChange={(checked) => onFilterChange({ starred: checked })}
            className="data-[state=checked]:bg-yellow-500"
          />
          <label className="text-sm">
            Đã đánh dấu
          </label>
        </div>

        {(readPosts.length > 0 || starredPosts.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAllHistory}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa lịch sử
          </Button>
        )}

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveFilters}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Lưu bộ lọc
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShareFilters}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Chia sẻ bộ lọc
                </TooltipContent>
              </Tooltip>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-9"
              >
                <X className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </>
          )}
        </div>

        {savedFilters.length > 0 && (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l">
            <span className="text-sm text-muted-foreground">Đã lưu:</span>
            {savedFilters.map((savedFilter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onFilterChange(savedFilter)}
                className="h-8"
              >
                Bộ lọc {index + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

interface MobileFilterSelectProps {
  label: string;
  value?: string;
  options: Record<string, string>;
  onChange: (value: string | undefined) => void;
}

function MobileFilterSelect({ label, value, options, onChange }: MobileFilterSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select
        value={value || 'all'}
        onValueChange={(value) => onChange(value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(options).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 