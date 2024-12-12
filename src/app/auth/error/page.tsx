'use client';

import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { ApiError } from '@/types/error';

interface ErrorPageProps {
  searchParams: {
    error?: string;
  };
}

export default function ErrorPage({ searchParams }: ErrorPageProps) {
  const error: ApiError = {
    message: searchParams.error || 'Đã có lỗi xảy ra',
    code: 'AUTH_ERROR'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
            Lỗi xác thực
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-gray-600 mb-6">
            {error.message}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href="/auth/login">
            <Button>
              Quay lại trang đăng nhập
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 