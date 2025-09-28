// src/middlewares/upload.middleware.ts
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// --- Crea rutas si no existen
const root = path.resolve(process.cwd(), 'uploads');
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('[MULTER] Creada carpeta:', dir);
  }
};

ensureDir(path.join(root, 'cursos'));
ensureDir(path.join(root, 'usuarios'));
ensureDir(path.join(root, 'cv_usuarios'));
ensureDir(path.join(root, 'fotos_perfil'));
ensureDir(path.join(root, 'otros'));

// --- Almacenamiento general
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'videoCurso') {
      cb(null, path.join(root, 'cursos'));
    } else if (file.fieldname === 'videoPresentacion') {
      cb(null, path.join(root, 'usuarios'));
    } else if (file.fieldname === 'cv') {
      cb(null, path.join(root, 'cv_usuarios'));
    } else if (file.fieldname === 'fotoPerfil') {
      cb(null, path.join(root, 'fotos_perfil'));
    } else {
      cb(null, path.join(root, 'otros'));
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

// --- Filtro de archivos por tipo
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedVideo = ['.mp4', '.mov', '.avi'];
  const allowedDocs = ['.pdf', '.doc', '.docx'];
  const allowedImages = ['.jpg', '.jpeg', '.png'];

  if (file.fieldname === 'videoPresentacion' && !allowedVideo.includes(ext)) {
    return cb(new Error('Formato de video de usuario no válido'));
  }

  if (file.fieldname === 'videoCurso' && !allowedVideo.includes(ext)) {
    return cb(new Error('Formato de video de curso no válido'));
  }

  if (file.fieldname === 'cv' && !allowedDocs.includes(ext)) {
    return cb(new Error('Formato de CV no válido'));
  }

  if (file.fieldname === 'fotoPerfil' && !allowedImages.includes(ext)) {
    return cb(new Error('Formato de imagen de perfil no válido'));
  }

  cb(null, true);
};

// --- Multer configurado por campo
export const uploadUsuario = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB para video usuario
  fileFilter,
});

export const uploadCV = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB para CV
  fileFilter,
});

export const uploadCurso = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB para video curso
  fileFilter,
});
