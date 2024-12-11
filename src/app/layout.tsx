import React from 'react';
import './globals.css';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-bold">
                Pet Helper
              </Link>
              <div className="space-x-4">
                <Link href="/posts" className="hover:text-blue-500">
                  Danh sách
                </Link>
                <Link href="/posts/create" className="hover:text-blue-500">
                  Tạo bài đăng
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
