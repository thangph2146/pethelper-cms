import express from 'express';
import { animalController } from '../controllers/animal.controller';
import { authMiddleware } from '../middleware/auth';
import { handleUploadError, upload } from '../middleware/upload';

const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), handleUploadError, animalController.create);
router.get('/', animalController.getAll);
router.get('/:id', animalController.getOne);
router.put('/:id', authMiddleware, upload.single('image'), handleUploadError, animalController.update);
router.delete('/:id', authMiddleware, animalController.delete);

export default router; 