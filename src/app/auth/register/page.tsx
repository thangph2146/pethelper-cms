'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AuthService } from '@/services/auth.service';
import { ValidationError } from '@/types/error';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi khi user bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await AuthService.register(formData);
      router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
    } catch (error) {
      if (error instanceof ValidationError) {
        if (error.field) {
          setErrors({
            [error.field]: error.message
          });
        } else {
          setErrors({
            form: error.message
          });
        }
      } else {
        setErrors({
          form: 'Có lỗi xảy ra khi đăng ký'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-6">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.form && (
            <div className="text-red-500 text-sm text-center">
              {errors.form}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Input
                name="name"
                type="text"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
            </div>

            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            <div>
              <Input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
            </div>

            <div>
              <Input
                name="phone"
                type="tel"
                placeholder="Số điện thoại (tùy chọn)"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? <Spinner /> : 'Đăng ký'}
            </Button>
          </div>

          <div className="text-sm text-center">
            <a 
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đã có tài khoản? Đăng nhập
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
} 