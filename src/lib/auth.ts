import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function getSession() {
  const token = cookies().get('token')?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return verified.payload;
  } catch (err) {
    return null;
  }
}

export async function updateSession(token: string) {
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });
} 