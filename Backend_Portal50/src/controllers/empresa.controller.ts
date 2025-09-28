// src/controllers/empresa.controller.ts

import { Request, Response } from 'express';
import { Empresa } from '../models/empresa.model';
import { User } from '../models/user.model';

// ✅ Crear nueva empresa
export const createEmpresa = async (req: Request, res: Response) => {
  try {
    const { uid, nombre, telefono, direccion, email, experiencia, rol } = req.body;

    const exists = await Empresa.findOne({ uid });
    if (exists) return res.status(409).json({ message: 'Empresa ya existe' });

    const nueva = await Empresa.create({
      uid,
      nombre,
      email,
      telefono,
      direccion,
      experiencia,
      ejecutivos: [],
      videoPresentacion: "",
      rol,
      activo: true
    });

    res.status(201).json({ message: 'Empresa creada', empresa: nueva });
  } catch (err) {
    console.error('❌ Error creando empresa:', err);
    res.status(500).json({ message: 'Error creando empresa' });
  }
};

// ✅ Obtener empresa por UID Firebase (solo activas)
export const getEmpresaByUid = async (req: Request, res: Response) => {
  try {
    const empresa = await Empresa.findOne({ uid: req.params.uid, activo: true })
      .populate('ejecutivos', 'nombre email rol telefono uid');
    if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

    res.status(200).json(empresa);
  } catch (err) {
    console.error('❌ Error obteniendo empresa:', err);
    res.status(500).json({ message: 'Error obteniendo empresa' });
  }
};

// ✅ Agregar ejecutivo — versión legacy compatible
export const addEjecutivo = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;
    const { userId } = req.body;

    // Busca por uid (Firebase) — no por _id directo
    const user = await User.findOne({ uid: userId });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.rol !== 'profesional') {
      return res.status(400).json({ message: 'Solo usuarios con rol profesional pueden ser ejecutivos' });
    }

    const empresa = await Empresa.findByIdAndUpdate(
      empresaId,
      { $addToSet: { ejecutivos: user._id } },
      { new: true }
    ).populate('ejecutivos', 'nombre email rol telefono uid');

    if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

    res.status(200).json({ message: 'Ejecutivo agregado', empresa });
  } catch (err) {
    console.error('❌ Error agregando ejecutivo:', err);
    res.status(500).json({ message: 'Error agregando ejecutivo' });
  }
};

// ✅ Actualizar ejecutivo
export const updateEjecutivo = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;
    const { userId, action } = req.body;

    const user = await User.findOne({ uid: userId });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    let empresa;

    if (action === 'remove') {
      // Quita de empresa
      empresa = await Empresa.findByIdAndUpdate(
        empresaId,
        { $pull: { ejecutivos: user._id } },
        { new: true }
      ).populate('ejecutivos', 'nombre email rol telefono uid');

      await User.findByIdAndUpdate(user._id, { isEjecutivo: false });

      if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

      return res.status(200).json({ message: 'Ejecutivo removido', empresa });
    } else {
      if (user.rol !== 'profesional') {
        return res.status(400).json({ message: 'Solo usuarios con rol profesional pueden ser ejecutivos' });
      }

      // Agrega a empresa
      empresa = await Empresa.findByIdAndUpdate(
        empresaId,
        { $addToSet: { ejecutivos: user._id } },
        { new: true }
      ).populate('ejecutivos', 'nombre email rol telefono uid');

      // 🔑 Marcar isEjecutivo = true
      await User.findByIdAndUpdate(user._id, { isEjecutivo: true });

      if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

      return res.status(200).json({ message: 'Ejecutivo agregado (update)', empresa });
    }
  } catch (err) {
    console.error('❌ Error actualizando ejecutivo:', err);
    res.status(500).json({ message: 'Error actualizando ejecutivo' });
  }
};

// ✅ Desactivar empresa (soft delete)
export const desactivarEmpresa = async (req: Request, res: Response) => {
  try {
    const { empresaId } = req.params;

    const empresa = await Empresa.findByIdAndUpdate(
      empresaId,
      { activo: false },
      { new: true }
    );

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    res.status(200).json({ message: 'Empresa desactivada', empresa });
  } catch (error) {
    console.error('❌ Error al desactivar empresa:', error);
    res.status(500).json({ message: 'Error al desactivar empresa' });
  }
};

// ✅ Obtener todas las empresas activas
export const getEmpresasActivas = async (_req: Request, res: Response) => {
  try {
    const empresas = await Empresa.find({ activo: true })
      .populate('ejecutivos', 'nombre email rol telefono uid fotoPerfil');

    res.status(200).json(empresas);
  } catch (error) {
    console.error('❌ Error al obtener empresas activas:', error);
    res.status(500).json({ message: 'Error al obtener empresas activas' });
  }
};

//Obtener empresa por _id (para vista pública de ofertas)
import { Job } from '../models/job.model';
import Postulacion from '../models/postulacion.model';

export const getEmpresaById = async (req: Request, res: Response) => {
  try {
    const empresa = await Empresa.findById(req.params.empresaId)
      .populate('ejecutivos', 'nombre email rol telefono uid');
    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    // Buscar ofertas de la empresa
    const ofertas = await Job.find({ empresaId: empresa._id });

    // Para cada oferta, buscar postulaciones y agregarlas
    const ofertasConPostulantes = await Promise.all(
      ofertas.map(async (oferta) => {
        const postulaciones = await Postulacion.find({ ofertaId: oferta._id })
          .populate('usuarioId', 'nombre email telefono');
        return {
          ...oferta.toObject(),
          postulantes: postulaciones.map(post => {
            const usuario: any = post.usuarioId as any;
            return {
              _id: usuario._id,
              nombre: usuario.nombre,
              email: usuario.email,
              telefono: usuario.telefono,
              estado: post.estado
            };
          })
        };
      })
    );

    res.status(200).json({
      ...empresa.toObject(),
      ofertas: ofertasConPostulantes
    });
  } catch (err) {
    console.error("❌ Error obteniendo empresa por ID:", err);
    res.status(500).json({ message: "Error obteniendo empresa" });
  }
};

export const getProfesionalesActivos = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({
      activo: true,
      rol: 'profesional'
    }).select('nombre experiencia modalidadPreferida cv');

    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error listando profesionales:', error);
    res.status(500).json({ message: 'Error listando profesionales' });
  }
};

// ✅ Subida de imagen de perfil de empresa (corregido)
export const uploadEmpresaFotoPerfil = async (req: Request, res: Response) => {
  try {
    const empresa = await Empresa.findByIdAndUpdate(
      req.params.empresaId,
      { fotoPerfil: `/uploads/fotos_perfil/${req.file?.filename}` },
      { new: true }
    );

    if (!empresa) return res.status(404).json({ message: 'Empresa no encontrada' });

    res.status(200).json({
      message: 'Foto de perfil actualizada',
      fotoPerfil: empresa.fotoPerfil
    });
  } catch (err) {
    console.error('❌ Error actualizando foto de perfil de empresa:', err);
    res.status(500).json({ message: 'Error actualizando foto de perfil de empresa' });
  }
};

export const updateEmpresa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, telefono, direccion } = req.body;

  try {
    const empresa = await Empresa.findByIdAndUpdate(
      id,
      { nombre, telefono, direccion },
      { new: true }
    );

    if (!empresa) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    return res.status(200).json(empresa);
  } catch (err) {
    console.error("❌ Error actualizando empresa:", err);
    return res.status(500).json({ message: "Error al actualizar empresa" });
  }
};