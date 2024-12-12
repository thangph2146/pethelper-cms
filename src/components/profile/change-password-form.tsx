'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { toast } from 'react-hot-toast';
import { useProfile } from '@/hooks/use-profile';

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ChangePasswordForm() {
  const { changePassword, loading } = useProfile();
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<ChangePasswordFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error khi user thay đổi input
    if (errors[name as keyof ChangePasswordFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ChangePasswordFormData> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      toast.success('Đổi mật khẩu thành công');
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra khi đổi mật khẩu';
      toast.error(message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đổi mật khẩu</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="currentPassword"
            name="currentPassword"
            type="password"
            label="Mật khẩu hiện tại"
            value={formData.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
          />

          <FormField
            id="newPassword"
            name="newPassword"
            type="password"
            label="Mật khẩu mới"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />

          <FormField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Xác nhận mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Đổi mật khẩu
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 