import axios from 'axios';

const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryResponse {
  secure_url: string;
}

export const UploadService = {
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET!);

    const response = await axios.post<CloudinaryResponse>(CLOUDINARY_URL!, formData);
    return response.data.secure_url;
  },

  async uploadMultipleImages(files: FileList) {
    const uploadPromises = Array.from(files).map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }
}; 