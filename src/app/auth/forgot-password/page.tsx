'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { AuthService } from '@/services/auth.service';
import type { ApiError } from '@/types/error';

interface ForgotPasswordError extends ApiError {
  field?: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ForgotPasswordError | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError({
        message: 'Vui lòng nhập email',
        code: 'FORGOT_PASSWORD_ERROR'
      });
      return;
    }

    setLoading(true);
    try {
      await AuthService.forgotPassword(email);
      toast.success('Email khôi phục mật khẩu đã được gửi');
      router.push('/auth/login?reset=requested');
    } catch (err: unknown) {
      const error: ForgotPasswordError = {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: 'FORGOT_PASSWORD_ERROR'
      };
      setError(error);
      toast.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Quên mật khẩu</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="Nhập email của bạn"
              error={error}
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Gửi email khôi phục
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <Link
            href="/auth/login"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Quay lại trang đăng nhập
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 