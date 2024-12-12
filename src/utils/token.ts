import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d'; // Token hết hạn sau 7 ngày

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const tokenUtils = {
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
  },

  verifyToken(token: string): TokenPayload & JwtPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload & JwtPayload;
    } catch (error) {
      throw new Error('Token không hợp lệ hoặc đã hết hạn');
    }
  },

  getTokenFromHeader(authHeader?: string | null): string | null {
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  },

  decodeToken(token: string): TokenPayload & JwtPayload {
    try {
      return jwt.decode(token) as TokenPayload & JwtPayload;
    } catch (error) {
      throw new Error('Token không hợp lệ');
    }
  },

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded.exp) return true;
      
      // exp là thời gian hết hạn tính bằng giây
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded.exp) return null;
      
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }
}; 