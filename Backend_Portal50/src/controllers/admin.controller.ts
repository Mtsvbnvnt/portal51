import { Request, Response } from 'express';
import {User} from '../models/user.model';
import Evaluacion from '../models/evaluacion.model';

export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const { rol, nombre, email } = req.query;
    const filtros: any = {};
    if (rol) filtros.rol = rol;
    if (nombre) filtros.nombre = { $regex: new RegExp(nombre.toString(), 'i') };
    if (email) filtros.email = { $regex: new RegExp(email.toString(), 'i') };

    const usuarios = await User.find(filtros);
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar usuarios' });
  }
};

export const obtenerEvaluacionesUsuario = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const evaluaciones = await Evaluacion.find({ evaluadoId: userId })
      .populate('evaluadorId', 'nombre email')
      .populate('cursoId', 'titulo');

    const promedio = evaluaciones.reduce((acc, e) => acc + e.estrellas, 0) / (evaluaciones.length || 1);

    res.status(200).json({ promedio: Number(promedio.toFixed(1)), evaluaciones });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener evaluaciones' });
  }
};