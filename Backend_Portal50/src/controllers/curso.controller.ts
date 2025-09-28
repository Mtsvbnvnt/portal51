// src/controllers/curso.controller.ts
import { Request, Response } from 'express';
import Curso from '../models/curso.model';
import ClaseAgendada from '../models/clase.model';

export const getCursos = async (_req: Request, res: Response) => {
  const cursos = await Curso.find().populate('profesionalId', 'nombre profesion fotoPerfil uid');
  res.status(200).json(cursos);
};

export const getCursoById = async (req: Request, res: Response) => {
  const curso = await Curso.findById(req.params.cursoId).populate('profesionalId');
  if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });
  res.status(200).json(curso);
};

export const agendarClase = async (req: Request, res: Response) => {
  const { aprendizId, fecha } = req.body;
  const curso = await Curso.findById(req.params.cursoId);
  if (!curso) return res.status(404).json({ message: 'Curso no encontrado' });

  const clase = await ClaseAgendada.create({
    cursoId: curso._id,
    profesionalId: curso.profesionalId,
    aprendizId,
    fecha,
    estado: 'pendiente',
    pagado: true,
    feedback: '',
  });

  res.status(201).json({ message: 'Clase agendada', clase });
};

export const uploadVideoCurso = async (req: Request, res: Response) => {
  const videoPath = `/uploads/cursos/${req.file?.filename}`;
  const curso = await Curso.findByIdAndUpdate(req.params.cursoId, { videoIntro: videoPath }, { new: true });
  res.status(200).json({ message: 'Video de curso subido', curso });
};

export const crearCurso = async (req: Request, res: Response) => {
  try {
    const {
      profesionalId,
      titulo,
      descripcion,
      categoria,
      precio,
      tipoPago,
      duracionMinutos,
      agendaDisponible,
    } = req.body;

    if (!profesionalId || !titulo || !precio || !tipoPago) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const nuevoCurso = new Curso({
      profesionalId,
      titulo,
      descripcion,
      categoria,
      precio,
      tipoPago,
      duracionMinutos,
      agendaDisponible,
    });

    const cursoGuardado = await nuevoCurso.save();
    res.status(201).json(cursoGuardado);
  } catch (error: any) {
    console.error("❌ Error al crear curso:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ error: "Error al crear el curso" });
  }
};


export const getCursosPorUsuario = async (req: Request, res: Response) => {
  try {
    const cursos = await Curso.find({ profesionalId: req.params.usuarioId });
    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos por usuario:", error);
    res.status(500).json({ error: "Error al obtener cursos del usuario" });
  }
};
