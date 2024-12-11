// Type cho upload file
export interface UploadDTO {
  file: File;
  folder?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  };
}

// Type cho response upload
export interface UploadResponse {
  url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

// Type cho delete file
export interface DeleteFileDTO {
  public_id: string;
}

// Type cho response delete
export interface DeleteResponse {
  result: 'ok' | 'not found';
  message: string;
} 