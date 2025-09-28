import { Request, Response } from 'express';
import Postulacion from '../models/postulacion.model';
import mongoose from 'mongoose';
import { Job } from '../models/job.model';
import { crearPostulacionSchema, actualizarEstadoSchema } from '../validators/postulacion.validator';

//Crear una postulacion
export const crearPostulacion = async (req: Request, res: Response) => {
  const parsed = crearPostulacionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten().fieldErrors });
  }

  const { ofertaId, usuarioId } = parsed.data;

  // Evitar postulaciones duplicadas
  const yaExiste = await Postulacion.findOne({ ofertaId, usuarioId });
  if (yaExiste) {
    return res.status(409).json({ message: 'Ya estás postulado a esta oferta' });
  }

  try {
    const nuevaPostulacion = new Postulacion({
      ...parsed.data,
      estado: 'pendiente',
    });
    await nuevaPostulacion.save();
    res.status(201).json({ message: 'Postulación enviada correctamente', postulacion: nuevaPostulacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la postulación' });
  }
};

//Obtener Postulaciones
export const obtenerPostulacionesPorUsuario = async (req: Request, res: Response) => {
  try {
    const usuarioObjectId = new mongoose.Types.ObjectId(req.params.userId);   
    const postulaciones = await Postulacion.find({ usuarioId: usuarioObjectId }).populate('ofertaId');  
    res.status(200).json(postulaciones);
    //console.log(usuarioObjectId);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener postulaciones del usuario' });
  }
};

//Obtener postulaciones por oferta
export const obtenerPostulacionesPorOferta = async (req: Request, res: Response) => {
  try {
    const ofertaObjectId = new mongoose.Types.ObjectId(req.params.jobId);
    const postulaciones = await Postulacion.find({ ofertaId: ofertaObjectId }).populate('usuarioId');
    res.status(200).json(postulaciones);
    //console.log(ofertaObjectId);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener postulaciones de la oferta' });
  }
};

//Actualizar postulacion
export const actualizarEstadoPostulacion = async (req: Request, res: Response) => {
  const parsed = actualizarEstadoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten().fieldErrors });
  }

  try {
    const actualizada = await Postulacion.findByIdAndUpdate(req.params.postulacionId, parsed.data, { new: true });
    if (!actualizada) {
      return res.status(404).json({ message: 'Postulación no encontrada' });
    }
    res.status(200).json({ message: 'Estado actualizado', postulacion: actualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado de postulación' });
  }
};
