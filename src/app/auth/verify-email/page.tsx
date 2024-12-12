'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/services/auth.service';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResendEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await AuthService.resendVerification(email);
      setSuccess('Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (error: any) {
      setError(error.message || 'Đã có lỗi xảy ra khi gửi lại email xác thực');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Xác thực Email</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Chúng tôi đã gửi email xác thực đến <strong>{email}</strong>.
            Vui lòng kiểm tra hộp thư của bạn và click vào link xác thực.
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded">
              {success}
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <Button
              onClick={handleResendEmail}
              loading={loading}
              disabled={loading || !email}
            >
              Gửi lại email xác thực
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/auth/login')}
            >
              Quay lại đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 