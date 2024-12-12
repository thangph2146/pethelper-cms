import { NextResponse } from 'next/server';
import { ValidationError, AuthenticationError, AuthorizationError } from '@/types/error';
import { Prisma } from '@prisma/client';

export function errorHandler(error: any) {
  console.error('API Error:', error);

  // Xử lý ValidationError
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        field: error.field
      },
      { status: error.status }
    );
  }

  // Xử lý AuthenticationError
  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message
      },
      { status: error.status }
    );
  }

  // Xử lý AuthorizationError
  if (error instanceof AuthorizationError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message
      },
      { status: error.status }
    );
  }

  // Xử lý Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        return NextResponse.json(
          {
            success: false,
            message: 'Dữ liệu đã tồn tại',
            field: error.meta?.target?.[0]
          },
          { status: 409 }
        );

      case 'P2025': // Record not found
        return NextResponse.json(
          {
            success: false,
            message: 'Không tìm thấy dữ liệu'
          },
          { status: 404 }
        );

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Lỗi database'
          },
          { status: 500 }
        );
    }
  }

  // Xử lý các lỗi khác
  return NextResponse.json(
    {
      success: false,
      message: error.message || 'Có lỗi xảy ra'
    },
    { status: error.status || 500 }
  );
} 