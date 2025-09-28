import { Request, Response } from 'express';
import Evaluacion from '../models/evaluacion.model';
import mongoose from 'mongoose';

// Obtener evaluaciones
export const obtenerEvaluacionesUsuario = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const evaluaciones = await Evaluacion.find({ evaluadoId: new mongoose.Types.ObjectId(userId) });

    if (!evaluaciones.length) {
      return res.status(404).json({ message: 'No se encontraron evaluaciones para este usuario' });
    }

    const promedio =
      evaluaciones.reduce((acc, curr) => acc + curr.estrellas, 0) / evaluaciones.length;

    res.status(200).json({
      promedio: parseFloat(promedio.toFixed(2)),
      total: evaluaciones.length,
      evaluaciones
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener evaluaciones', error });
  }
};

// Crear una evaluacion
export const crearEvaluacion = async (req: Request, res: Response) => {
  try {
    const { evaluadorId, evaluadoId, cursoId, tipo, comentario, estrellas } = req.body;

    if (!evaluadorId || !evaluadoId || !cursoId || !tipo || !estrellas) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const nuevaEvaluacion = new Evaluacion({
      evaluadorId,
      evaluadoId,
      cursoId,
      tipo,
      comentario,
      estrellas,
      fecha: new Date(),
    });

    await nuevaEvaluacion.save();
    res.status(201).json({ message: 'Evaluación registrada correctamente', evaluacion: nuevaEvaluacion });
  } catch (error) {
    console.error('❌ Error al crear evaluación:', error);
    res.status(500).json({ message: 'Error al crear evaluación' });
  }
};

