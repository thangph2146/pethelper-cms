import { useQuery } from '@tanstack/react-query';
import type { IReport } from '@backend/models/Report';

interface ReportsResponse {
  reports: IReport[];
  totalPages: number;
  currentPage: number;
}

export function useReports(status: string = 'pending', page: number = 1) {
  return useQuery<ReportsResponse>({
    queryKey: ['reports', status, page],
    queryFn: async () => {
      const response = await fetch(
        `/api/reports?status=${status}&page=${page}`
      );
      const data = await response.json();
      return {
        reports: data.data.reports,
        totalPages: data.data.totalPages,
        currentPage: data.data.currentPage,
      };
    },
  });
} 