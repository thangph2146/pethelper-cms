'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { validateLoginData } from '@/utils/validation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateField = (field: keyof typeof formData) => {
    try {
      switch (field) {
        case 'email':
          validateLoginData.email(formData.email);
          break;
        case 'password':
          validateLoginData.password(formData.password);
          break;
      }
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error: any) {
      setErrors(prev => ({ ...prev, [field]: error.message }));
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value) validateField(name as keyof typeof formData);
  };

  const validateForm = () => {
    const fields: (keyof typeof formData)[] = ['email', 'password'];
    const validations = fields.map(field => validateField(field));
    return validations.every(isValid => isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setLoading(true);

    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra khi đăng nhập');
      }

      if (data.success) {
        router.push('/'); // Chuyển về trang chủ sau khi đăng nhập
      }
    } catch (error: any) {
      setSubmitError(error.message || 'Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị thông báo đăng ký thành công nếu có
  const registeredMessage = searchParams.get('registered') ? (
    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
      Đăng ký thành công! Vui lòng đăng nhập.
    </div>
  ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full p-6">
        <CardHeader className="p-0">
          <h1 className="text-2xl font-bold text-center">Đăng nhập</h1>
        </CardHeader>

        <CardContent className="p-0 mt-6">
          {registeredMessage}
          
          {submitError && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-red-500' : ''}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mật khẩu</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'border-red-500' : ''}
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="p-0 mt-4 justify-center">
          <p>
            Chưa có tài khoản?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Đăng ký
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 