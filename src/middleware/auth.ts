import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthenticationError, AuthorizationError } from '@/types/error';
import type { SupabaseUser, SupabaseSession } from '@/types/supabase';

interface ValidateResponse {
  session: SupabaseSession;
  user: SupabaseUser;
  response: NextResponse;
}

export async function validateSession(request: NextRequest): Promise<ValidateResponse> {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      throw new AuthenticationError('Phiên đăng nhập không hợp lệ');
    }

    if (!session) {
      throw new AuthenticationError('Vui lòng đăng nhập để tiếp tục');
    }

    // Kiểm tra xác thực email nếu cần
    if (!session.user.email_confirmed_at) {
      throw new AuthorizationError('Vui lòng xác thực email để tiếp tục');
    }

    // Thêm các trường bắt buộc cho SupabaseUser
    const enhancedUser = {
      ...session.user,
      email_verified: session.user.email_confirmed_at ? true : false,
    };

    // Tạo SupabaseSession với user đã được enhance
    const enhancedSession = {
      ...session,
      user: enhancedUser,
    };

    return {
      session: enhancedSession as SupabaseSession,
      user: enhancedUser as SupabaseUser,
      response: res
    };

  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      throw error;
    }
    throw new AuthenticationError('Có lỗi xảy ra khi xác thực');
  }
}

export async function validateAdmin(request: NextRequest): Promise<ValidateResponse> {
  const { session, user, response } = await validateSession(request);

  // Kiểm tra role admin từ metadata
  const isAdmin = user.app_metadata?.role === 'admin';

  if (!isAdmin) {
    throw new AuthorizationError('Bạn không có quyền truy cập trang này');
  }

  return { session, user, response };
}

export async function validateOwnership(
  request: NextRequest, 
  resourceId: string
): Promise<ValidateResponse> {
  const { session, user, response } = await validateSession(request);

  // Kiểm tra quyền sở hữu resource
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  const { data, error } = await supabase
    .from('resources')
    .select('user_id')
    .eq('id', resourceId)
    .single();

  if (error || !data) {
    throw new AuthorizationError('Không tìm thấy tài nguyên');
  }

  if (data.user_id !== user.id) {
    throw new AuthorizationError('Bạn không có quyền thực hiện hành động này');
  }

  return { session, user, response };
} 