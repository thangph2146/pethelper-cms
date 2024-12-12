'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/form-field';
import { toast } from 'react-hot-toast';
import { ChangePasswordForm } from '@/components/profile/change-password-form';

interface ProfileFormData {
  name: string;
  phone: string;
  address: string;
}

export default function ProfilePage() {
  const { profile, loading, error, updateProfile } = useProfile();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile?.name || '',
    phone: profile?.phone || '',
    address: profile?.address || ''
  });
  const [updating, setUpdating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await updateProfile(formData);
      toast.success('Cập nhật thông tin thành công');
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                id="email"
                label="Email"
                value={profile?.email || ''}
                disabled
                readOnly
              />

              <FormField
                id="name"
                label="Họ tên"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ tên của bạn"
              />

              <FormField
                id="phone"
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />

              <FormField
                id="address"
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ"
              />

              <Button
                type="submit"
                className="w-full"
                loading={updating}
                disabled={updating}
              >
                Cập nhật thông tin
              </Button>
            </form>
          </CardContent>
        </Card>

        <ChangePasswordForm />
      </div>
    </div>
  );
} 