import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/videos_usuarios',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ['.mp4', '.mov', '.avi'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(ext)) {
    return cb(new Error('Formato de video no permitido'));
  }
  cb(null, true);
};

export const uploadVideoUsuario = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter,
});
