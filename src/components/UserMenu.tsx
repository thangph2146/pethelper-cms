'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import type { Session } from 'next-auth';

interface UserMenuProps {
  initialSession: Session | null;
}

export default function UserMenu({ initialSession }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  if (!initialSession?.user) {
    return (
      <div className="flex gap-4">
        <Link
          href="/auth/login"
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Đăng nhập
        </Link>
        <Link
          href="/auth/register"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 focus:outline-none"
      >
        <Image
          src={initialSession.user.image || '/images/default-avatar.png'}
          alt={initialSession.user.name || ''}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="font-medium">{initialSession.user.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={closeMenu}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 py-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={closeMenu}
            >
              Trang cá nhân
            </Link>

            <Link
              href="/posts/new"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={closeMenu}
            >
              Đăng bài mới
            </Link>

            {initialSession.user.role === 'admin' && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={closeMenu}
              >
                Quản lý
              </Link>
            )}

            <hr className="my-2" />

            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Đăng xuất
            </button>
          </div>
        </>
      )}
    </div>
  );
} 