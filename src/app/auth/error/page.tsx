'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { AuthService } from '@/services/auth.service';
import { toast } from 'react-hot-toast';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const email = searchParams.get('email');
  const [resending, setResending] = useState(false);

  const handleResendVerification = async () => {
    if (!email) return;
    
    setResending(true);
    try {
      await AuthService.resendVerification(email);
      toast.success('Email xác thực đã được gửi lại');
    } catch (error: any) {
      toast.error(error.message || 'Không thể gửi lại email xác thực');
    } finally {
      setResending(false);
    }
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
            {error || 'Đã có lỗi xảy ra trong quá trình xác thực'}
          </div>

          {email && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleResendVerification}
                loading={resending}
                disabled={resending}
              >
                Gửi lại email xác thực
              </Button>
            </div>
          )}
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