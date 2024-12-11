'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            PetHelper
          </Link>

          <div className="flex items-center space-x-4">
            <Link 
              href="/posts" 
              className="text-gray-700 hover:text-indigo-600"
            >
              Danh sách
            </Link>

            {status === 'authenticated' ? (
              <>
                <Link 
                  href="/posts/create" 
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Tạo bài đăng
                </Link>
                <Link 
                  href="/profile" 
                  className="text-gray-700 hover:text-indigo-600"
                >
                  {session.user?.name}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Đăng nhập
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 