// src/middlewares/upload.middleware.ts
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

// ✅ Resuelve SIEMPRE la raíz
const projectRoot = path.resolve(process.cwd());
const uploadRoot = path.join(projectRoot, 'uploads', 'cv_usuarios');

// 👇 Muestra siempre dónde está apuntando
console.log('[MULTER] Directorio raíz:', projectRoot);
console.log('[MULTER] Directorio CV:', uploadRoot);

// ✅ Si no existe lo crea
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
  console.log('[MULTER] Carpeta creada:', uploadRoot);
} else {
  console.log('[MULTER] Carpeta existente:', uploadRoot);
}

const storageCV = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadRoot);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilterCV = (_req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Formato no permitido'));
  }
  cb(null, true);
};

export const uploadCV = multer({
  storage: storageCV,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilterCV,
});
