import { Request } from 'express';

export interface AuthUser {
  _id: string;
  id: string;
  role: string;
  email: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
} 