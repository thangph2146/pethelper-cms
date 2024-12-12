'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { AuthService } from '@/services/auth.service';
import { toast } from 'react-hot-toast';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await AuthService.resetPassword(formData.password);
      toast.success('Đặt lại mật khẩu thành công');
      router.push('/auth/login?reset=success');
    } catch (error: any) {
      setErrors({
        form: error.message
      });
      toast.error(error.message || 'Đã có lỗi xảy ra');
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
          {errors.form && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {errors.form}
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
                if (errors.password) {
                  setErrors(prev => ({
                    ...prev,
                    password: undefined
                  }));
                }
              }}
              error={errors.password}
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
                if (errors.confirmPassword) {
                  setErrors(prev => ({
                    ...prev,
                    confirmPassword: undefined
                  }));
                }
              }}
              error={errors.confirmPassword}
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