'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AuthService } from '@/services/auth.service';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    if (!email) return;
    
    setResending(true);
    try {
      await AuthService.resendVerification(email);
      setMessage('Email xác thực đã được gửi lại');
    } catch (error: any) {
      setMessage(error.message || 'Có lỗi xảy ra khi gửi lại email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-6">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Xác thực email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Chúng tôi đã gửi email xác thực đến {email}.<br />
            Vui lòng kiểm tra hộp thư của bạn.
          </p>
        </div>

        {message && (
          <div className="text-center text-sm text-green-600">
            {message}
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={handleResend}
            disabled={resending}
            variant="outline"
          >
            {resending ? 'Đang gửi...' : 'Gửi lại email xác thực'}
          </Button>
        </div>

        <div className="text-sm text-center">
          <a 
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Quay lại đăng nhập
          </a>
        </div>
      </Card>
    </div>
  );
} 