import { Request, Response } from 'express';
import { Post } from '../models/Post';
import { Types } from 'mongoose';
import { AuthRequest } from '../types/auth';
import logger from '../utils/logger';
const { ObjectId } = Types;

export const postController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls = files ? files.map(file => (file as any).path) : [];

      const post = new Post({
        ...req.body,
        images: imageUrls,
        author: req.user?._id || req.user?.id
      });

      await post.save();
      logger.info(`Created new post with ID: ${post._id}`);
      
      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error) {
      logger.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo bài viết',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const { 
        page = 1, 
        limit = 10,
        category,
        status,
        urgency,
        search
      } = req.query;

      const query: any = {};
      
      if (category) query.category = category;
      if (status) query.status = status;
      if (urgency) query.urgency = urgency;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      const posts = await Post.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await Post.countDocuments(query);

      res.json({
        success: true,
        data: {
          posts,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách bài đăng',
        error
      });
    }
  },

  getOne: async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate('author', 'name email')
        .populate('comments.user', 'name');

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài đăng'
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy chi tiết bài đăng',
        error
      });
    }
  },

  update: async (req: AuthRequest, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls = files ? files.map(file => (file as any).path) : [];

      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài viết'
        });
      }

      if (post.author.toString() !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền chỉnh sửa'
        });
      }

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          images: imageUrls.length > 0 ? imageUrls : post.images
        },
        { new: true }
      );

      logger.info(`Updated post with ID: ${req.params.id}`);
      
      res.json({
        success: true,
        data: updatedPost
      });
    } catch (error) {
      logger.error('Error updating post:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật bài viết',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài đăng'
        });
      }

      if (post.author.toString() !== req.user?.id && req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xóa'
        });
      }

      await post.deleteOne();
      res.json({
        success: true,
        message: 'Đã xóa bài đăng thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa bài đăng',
        error
      });
    }
  },

  addComment: async (req: AuthRequest, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài đăng'
        });
      }

      if (req.user?.id) {
        post.comments.push({
          user: new ObjectId(req.user.id),
          content: req.body.content,
          createdAt: new Date()
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'User ID is required to add a comment'
        });
      }

      await post.save();
      
      const updatedPost = await Post.findById(req.params.id)
        .populate('author', 'name email')
        .populate('comments.user', 'name');

      res.json({
        success: true,
        data: updatedPost
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi thêm bình luận',
        error
      });
    }
  },

  toggleLike: async (req: AuthRequest, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài đăng'
        });
      }
  
      const userId = req.user?.id;
  
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
  
      const index = post.likes.findIndex((id: Types.ObjectId) => id.toString() === userId);
      
      if (index === -1) {
        post.likes.push(new ObjectId(userId));
      } else {
        post.likes.splice(index, 1);
      }
  
      await post.save();
      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },
  likePost : async (req: AuthRequest, res: Response) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy bài đăng'
        });
      }
  
      const userId = req.user?.id;
  
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
  
      const index = post.likes.findIndex((id: Types.ObjectId) => id.toString() === userId);
  
      if (index === -1) {
        post.likes.push(new ObjectId(userId));
      } else {
        post.likes.splice(index, 1);
      }
  
      await post.save();
      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}; 