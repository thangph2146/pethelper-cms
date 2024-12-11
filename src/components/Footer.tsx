import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Pet Helper</h3>
            <p className="text-gray-400">
              Hệ thống hỗ trợ cứu trợ động vật, kết nối những người yêu thương động vật.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-gray-400 hover:text-white">
                  Danh sách cứu trợ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@pethelper.com</li>
              <li>Điện thoại: (84) 123-456-789</li>
              <li>Địa chỉ: Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pet Helper. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 