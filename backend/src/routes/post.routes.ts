import express from 'express';
import { postController } from '../controllers/post.controller';
import { authMiddleware } from '../middleware/auth';
import { upload, handleUploadError } from '../middleware/upload';

const router = express.Router();

// Public routes
router.get('/', postController.getAll);
router.get('/:id', postController.getOne);

// Protected routes
router.post('/', authMiddleware, upload.array('images', 5), handleUploadError, postController.create);
router.put('/:id', authMiddleware, upload.array('images', 5), handleUploadError, postController.update);
router.delete('/:id', authMiddleware, postController.delete);
router.post('/:id/comments', authMiddleware, postController.addComment);
router.post('/:id/like', authMiddleware, postController.toggleLike);

export default router; 