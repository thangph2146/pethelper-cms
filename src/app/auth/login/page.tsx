'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { useAuthContext } from '@/providers/auth-provider';
import { useRememberLogin } from '@/hooks/use-remember-login';
import type { LoginFormState, LoginFormErrors } from '@/types/form';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthContext();
  const { saveLoginInfo, getSavedEmail } = useRememberLogin();

  const [formData, setFormData] = useState<LoginFormState>({
    email: getSavedEmail(),
    password: '',
    rememberMe: !!localStorage.getItem('rememberMe')
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const registered = searchParams.get('registered');
  const verified = searchParams.get('verified');
  const reset = searchParams.get('reset');

  // Hiển thị thông báo thành công
  const successMessage = (registered || verified || reset) && (
    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
      {registered && 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'}
      {verified && 'Xác thực email thành công! Vui lòng đăng nhập để tiếp tục.'}
      {reset === 'requested' && 'Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'}
      {reset === 'success' && 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.'}
    </div>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error khi user thay đổi input
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        saveLoginInfo(formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedEmail');
      }

      router.push('/');
      router.refresh();
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
        </CardHeader>

        <CardContent>
          {successMessage}
          {errors.form && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Nhập email của bạn"
              required
              error={errors.email}
              value={formData.email}
              onChange={handleChange}
            />

            <FormField
              id="password"
              name="password"
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              required
              error={errors.password}
              value={formData.password}
              onChange={handleChange}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng ký ngay
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 