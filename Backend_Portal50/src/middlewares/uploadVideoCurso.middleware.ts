import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const storageCurso = multer.diskStorage({
  destination: 'uploads/videos_cursos',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilterCurso = (_req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = ['.mp4', '.mov', '.avi'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(ext)) {
    return cb(new Error('Formato de video no permitido'));
  }
  cb(null, true);
};

export const uploadVideoCurso = multer({
  storage: storageCurso,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: fileFilterCurso,
});