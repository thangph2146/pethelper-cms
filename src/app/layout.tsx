import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'PetHelper - Hỗ trợ cứu trợ động vật',
  description: 'Nền tảng kết nối và hỗ trợ cứu trợ động vật',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </Providers>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
