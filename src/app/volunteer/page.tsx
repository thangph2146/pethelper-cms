'use client';
import { useState } from 'react';

export default function Volunteer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    availability: [] as string[],
    skills: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý gửi form
    console.log(formData);
  };

  const handleCheckbox = (field: 'availability' | 'skills', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Đăng ký tình nguyện viên</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cá nhân */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Họ và tên</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Địa chỉ</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Kinh nghiệm */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Kinh nghiệm</h2>
            <textarea
              className="w-full p-2 border rounded-lg min-h-[150px] dark:bg-gray-700"
              placeholder="Chia sẻ kinh nghiệm của bạn về việc chăm sóc động vật..."
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
            />
          </div>

          {/* Thời gian có thể tham gia */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Thời gian có thể tham gia</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Sáng', 'Chiều', 'Tối', 'Cuối tuần'].map((time) => (
                <label key={time} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.availability.includes(time)}
                    onChange={() => handleCheckbox('availability', time)}
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>

          {/* Kỹ năng */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Kỹ năng</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Chăm sóc thú cưng',
                'Sơ cứu động vật',
                'Lái xe',
                'Truyền thông',
                'Gây quỹ',
                'Tổ chức sự kiện'
              ].map((skill) => (
                <label key={skill} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleCheckbox('skills', skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
} 