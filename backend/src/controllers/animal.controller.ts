import { Request, Response } from 'express';
import Animal, { IAnimal } from '../models/Animal';

export const animalController = {
  // Tạo bài đăng mới
  create: async (req: Request, res: Response) => {
    try {
      const newAnimal = new Animal(req.body);
      const savedAnimal = await newAnimal.save();
      res.status(201).json(savedAnimal);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo bài đăng', error });
    }
  },

  // Lấy danh sách động vật
  getAll: async (req: Request, res: Response) => {
    try {
      const animals = await Animal.find()
        .sort({ createdAt: -1 });
      res.status(200).json(animals);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách', error });
    }
  },

  // Lấy chi tiết một động vật
  getOne: async (req: Request, res: Response) => {
    try {
      const animal = await Animal.findById(req.params.id);
      if (!animal) {
        return res.status(404).json({ message: 'Không tìm thấy' });
      }
      res.status(200).json(animal);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy thông tin', error });
    }
  },

  // Cập nhật thông tin
  update: async (req: Request, res: Response) => {
    try {
      const updatedAnimal = await Animal.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedAnimal);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi cập nhật', error });
    }
  },

  // Xóa bài đăng
  delete: async (req: Request, res: Response) => {
    try {
      await Animal.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Đã xóa thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa', error });
    }
  }
}; 