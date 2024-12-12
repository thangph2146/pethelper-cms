import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';

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
    <html lang="en">
      <body>
        <AuthProvider>
          <Providers>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </Providers>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
