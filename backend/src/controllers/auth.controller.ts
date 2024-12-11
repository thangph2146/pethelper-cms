import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';
import logger from '../utils/logger';
import { AuthRequest } from '../types/auth';

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng'
        });
      }

      const user = new User({
        email,
        password,
        name
      });

      await user.save();
      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công'
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng ký',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email: rawEmail, password } = req.body;
      const email = rawEmail.trim().toLowerCase();
      
      logger.info(`Login attempt for email: ${email}`);

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email và mật khẩu là bắt buộc'
        });
      }

      const user = await User.findOne({ email });
      if (!user) {
        logger.info(`Login failed: User not found for email ${email}`);
        return res.status(401).json({
          success: false,
          message: 'Email không tồn tại'
        });
      }

      if (!user.password) {
        logger.info(`Login failed: No password set for user ${email}`);
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      logger.info(`Password match result for ${email}: ${isMatch}`);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        });
      }

      const accessToken = jwt.sign(
        { 
          id: user._id,
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        config.jwtSecret,
        { expiresIn: '1d' }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '7d' }
      );

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng nhập',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as any;
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      const accessToken = jwt.sign(
        { 
          id: user._id,
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        config.jwtSecret,
        { expiresIn: '1d' }
      );

      res.json({
        success: true,
        data: { accessToken }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  },

  logout: async (req: AuthRequest, res: Response) => {
    try {
      logger.info(`User logged out: ${req.user?.email}`);
      res.json({
        success: true,
        message: 'Đăng xuất thành công'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng xuất',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  checkEmail: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      
      res.json({
        exists: !!user,
        hasPassword: user ? !!user.password : false
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra email'
      });
    }
  }
}; 