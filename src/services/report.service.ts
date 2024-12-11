import axiosInstance from '@/lib/axios';
import type { IReport } from '@backend/models/Report';

export interface ReportResponse {
  data: IReport;
  message?: string;
}

export interface ReportsResponse {
  data: {
    reports: IReport[];
    total: number;
    page: number;
    totalPages: number;
  };
  message?: string;
}

export const ReportService = {
  async createReport(postId: string, data: { reason: string; description: string }): Promise<ReportResponse> {
    const response = await axiosInstance.post<ReportResponse>(`/posts/${postId}/reports`, data);
    return response.data;
  },

  async getReports(page = 1, filters?: Record<string, string>): Promise<ReportsResponse> {
    const params = new URLSearchParams({ page: String(page) });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await axiosInstance.get<ReportsResponse>(`/admin/reports?${params.toString()}`);
    return response.data;
  },

  async updateReportStatus(reportId: string, status: 'resolved' | 'rejected'): Promise<ReportResponse> {
    const response = await axiosInstance.patch<ReportResponse>(`/admin/reports/${reportId}`, { status });
    return response.data;
  }
}; 