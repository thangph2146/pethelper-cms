'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { AuthService } from '@/services/auth.service';
import type { RegisterFormData, RegisterError } from '@/types/form';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<RegisterError | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error khi user thay đổi input
    if (error && error.field === name) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.register(formData);
      toast.success('Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.');
      router.push('/auth/login?verify=pending');
    } catch (err: unknown) {
      const error: RegisterError = {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: 'REGISTER_ERROR'
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
          <CardTitle>Đăng ký tài khoản</CardTitle>
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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={error && error.field === 'email' ? error.message : undefined}
            />

            <FormField
              id="name"
              label="Họ tên"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={error && error.field === 'name' ? error.message : undefined}
            />

            <FormField
              id="password"
              label="Mật khẩu"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={error && error.field === 'password' ? error.message : undefined}
            />

            <FormField
              id="confirmPassword"
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={error && error.field === 'confirmPassword' ? error.message : undefined}
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Đăng ký
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 