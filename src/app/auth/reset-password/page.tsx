'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { AuthService } from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import type { ApiError } from '@/types/error';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordError extends ApiError {
  field?: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ResetPasswordError | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.resetPassword(formData.password);
      toast.success('Đặt lại mật khẩu thành công');
      router.push('/auth/login?reset=success');
    } catch (err: unknown) {
      const error: ResetPasswordError = {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: 'RESET_PASSWORD_ERROR'
      };
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Đặt lại mật khẩu</CardTitle>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="password"
              label="Mật khẩu mới"
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  password: e.target.value
                }));
                if (error?.field === 'password') {
                  setError(prev => ({
                    ...prev,
                    field: undefined
                  }));
                }
              }}
              error={error?.field === 'password' ? error.message : undefined}
            />

            <FormField
              id="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }));
                if (error?.field === 'confirmPassword') {
                  setError(prev => ({
                    ...prev,
                    field: undefined
                  }));
                }
              }}
              error={error?.field === 'confirmPassword' ? error.message : undefined}
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Đặt lại mật khẩu
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 