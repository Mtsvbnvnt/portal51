// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { AuthRequest } from "../middlewares/auth.middleware";

// ✅ GET user por UID de Firebase (NO _id de Mongo)
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

// ✅ UPDATE user por _id Mongo (aquí sí usa ObjectId)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
    res.status(200).json({ message: 'Perfil actualizado', user: updated });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil del usuario' });
  }
};

// ✅ Subir video de presentación
export const uploadVideoPresentacion = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se envió archivo de video' });

    const videoPath = `/uploads/videos_usuarios/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.params.userId, { videoPresentacion: videoPath }, { new: true });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Video subido correctamente', user });
  } catch (error) {
    console.error('❌ Error al subir video:', error);
    res.status(500).json({ message: 'Error al subir el video de presentación' });
  }
};

// ✅ Subir CV de usuario
export const uploadCVUsuario = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se envió archivo de CV' });

    const cvPath = `/uploads/cv_usuarios/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.params.userId, { cv: cvPath }, { new: true });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json({ message: 'CV subido correctamente', user });
  } catch (error) {
    console.error('❌ Error al subir CV:', error);
    res.status(500).json({ message: 'Error al subir el CV del usuario' });
  }
};

// ✅ Desactivar usuario (por _id Mongo)
export const desactivarUsuario = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { activo: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json({ message: 'Usuario desactivado', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar usuario', error });
  }
};

// ✅ Crear usuario nuevo
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const {
      uid,
      nombre,
      email,
      telefono,
      pais,
      rol,
      habilidades
    } = req.body;

    if (!req.user) return res.status(401).json({ message: 'Token inválido' });
    if (uid !== req.user.uid) return res.status(400).json({ message: 'UID no coincide con token' });

    const exists = await User.findOne({ uid });
    if (exists) return res.status(409).json({ message: 'Usuario ya existe' });

    // Procesar archivos
    let cvPath = "";
    let videoPath = "";
    if (req.files && (req.files as any)["cv"] && (req.files as any)["cv"][0]) {
      cvPath = `/uploads/cv_usuarios/${(req.files as any)["cv"][0].filename}`;
    }
    if (req.files && (req.files as any)["videoPresentacion"] && (req.files as any)["videoPresentacion"][0]) {
      videoPath = `/uploads/usuarios/${(req.files as any)["videoPresentacion"][0].filename}`;
    }

    // Procesar arrays
    let experiencias = [];
    let educaciones = [];
    if (req.body.experiencias) {
      try {
        experiencias = JSON.parse(req.body.experiencias);
      } catch {}
    }
    if (req.body.educaciones) {
      try {
        educaciones = JSON.parse(req.body.educaciones);
      } catch {}
    }

    const nuevo = await User.create({
      uid,
      nombre,
      email,
      telefono,
      pais,
      rol,
      habilidades,
      cv: cvPath,
      videoPresentacion: videoPath,
      experiencias,
      educaciones,
      activo: true,
      isEjecutivo: false,
    });

    res.status(201).json({ message: 'Usuario creado', user: nuevo });

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    res.status(500).json({ message: 'Error creando usuario' });
  }
};

// ✅ GET todos los trabajadores activos con modalidadPreferida
export const getTrabajadores = async (req: Request, res: Response) => {
  try {
    const trabajadores = await User.find({
      activo: true,
      rol: 'profesional',
      modalidadPreferida: { $exists: true, $ne: '' }
    }).select('nombre experiencia modalidadPreferida cv pais videoPresentacion uid fotoPerfil'); // selecciona campos clave

    res.status(200).json(trabajadores);
  } catch (error) {
    console.error('❌ Error obteniendo trabajadores:', error);
    res.status(500).json({ message: 'Error obteniendo trabajadores' });
  }
};

// ✅ Subir imagen de perfil y devolver ruta directamente
export const uploadFotoPerfil = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se envió archivo de imagen' });

    const fotoPath = `/uploads/fotos_perfil/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { fotoPerfil: fotoPath },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // ✅ Devolver solo la URL para el frontend
    res.status(200).json({ fotoPerfil: fotoPath });
  } catch (error) {
    console.error('❌ Error al subir foto de perfil:', error);
    res.status(500).json({ message: 'Error al subir la imagen de perfil' });
  }
};

