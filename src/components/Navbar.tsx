'use client';

import Link from 'next/link';
import { useAuthContext } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export function Navbar() {
  const { user, logout, loading } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">PetHelper</span>
            </Link>

            {user && (
              <>
                <Link 
                  href="/posts" 
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Danh sách bài đăng
                </Link>
                <Link 
                  href="/posts/create" 
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Tạo bài đăng
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="flex items-center space-x-2"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                    <span>{user.email}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      Thông tin cá nhân
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/posts/my-posts">
                      Bài đăng của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-4">
                <Link href="/auth/login">
                  <Button variant="outline">Đăng nhập</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Đăng ký</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 