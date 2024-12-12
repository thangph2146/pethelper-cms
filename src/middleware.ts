import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Danh sách các route không cần xác thực
const publicRoutes = [
  {
    path: '/api/posts',
    methods: ['GET']  // Chỉ cho phép GET request
  },
  {
    path: '/api/auth/login',
    methods: ['POST']  // Chỉ cho phép POST request
  },
  {
    path: '/api/auth/register',
    methods: ['POST']  // Chỉ cho phép POST request
  },
  {
    path: '/api/auth/verify',
    methods: ['POST']  // Chỉ cho phép POST request
  },
  {
    path: '/api/auth/session',
    methods: ['GET']  // Chỉ cho phép GET request
  }
];

export function middleware(request: NextRequest) {
  // Kiểm tra nếu là public route và method phù hợp thì cho phép truy cập
  const isPublicRoute = publicRoutes.some(route => {
    const matchPath = request.nextUrl.pathname.startsWith(route.path);
    const matchMethod = route.methods.includes(request.method);
    return matchPath && matchMethod;
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Kiểm tra token cho các route khác
  const token = request.cookies.get('token');
  if (!token) {
    return NextResponse.json(
      { message: 'Authentication required' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 