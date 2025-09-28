import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Clase from '../models/clase.model';
import Curso from '../models/curso.model';

export const obtenerClasesPorCurso = async (req: AuthRequest, res: Response) => {
  try {
    const { cursoId } = req.params;
    
    const clases = await Clase.find({ cursoId, activa: true })
      .sort({ orden: 1 })
      .select('-__v');

    res.json(clases);
  } catch (error) {
    console.error('Error obteniendo clases del curso:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const obtenerClasePorId = async (req: AuthRequest, res: Response) => {
  try {
    const { claseId } = req.params;
    
    const clase = await Clase.findOne({ _id: claseId, activa: true })
      .populate('cursoId', 'titulo categoria profesionalId')
      .select('-__v');

    if (!clase) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    res.json(clase);
  } catch (error) {
    console.error('Error obteniendo clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const crearClase = async (req: AuthRequest, res: Response) => {
  try {
    const { cursoId } = req.params;
    const { 
      numeroClase, 
      titulo, 
      descripcion, 
      duracionMinutos, 
      objetivos, 
      prerequisitos 
    } = req.body;

    // Verificar que el curso existe y pertenece al usuario
    const curso = await Curso.findById(cursoId);
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Verificar autorización (el curso debe pertenecer al usuario autenticado)
    if (curso.profesionalId.toString() !== req.user?.uid) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Obtener el siguiente número de orden
    const ultimaClase = await Clase.findOne({ cursoId }).sort({ orden: -1 });
    const siguienteOrden = ultimaClase ? ultimaClase.orden + 1 : 1;

    const nuevaClase = new Clase({
      cursoId,
      numeroClase: numeroClase || siguienteOrden,
      titulo,
      descripcion,
      duracionMinutos,
      objetivos: objetivos || [],
      prerequisitos: prerequisitos || [],
      orden: siguienteOrden,
      activa: true
    });

    const claseGuardada = await nuevaClase.save();

    // Actualizar el curso con la nueva clase
    await Curso.findByIdAndUpdate(cursoId, {
      $push: { clases: claseGuardada._id },
      $inc: { totalClases: 1 }
    });

    res.status(201).json(claseGuardada);
  } catch (error) {
    console.error('Error creando clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const actualizarClase = async (req: AuthRequest, res: Response) => {
  try {
    const { claseId } = req.params;
    const actualizaciones = req.body;

    // Buscar la clase y el curso asociado
    const clase = await Clase.findById(claseId).populate('cursoId');
    if (!clase) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    // Verificar autorización
    const curso = clase.cursoId as any;
    if (curso.profesionalId.toString() !== req.user?.uid) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Actualizar la clase
    const claseActualizada = await Clase.findByIdAndUpdate(
      claseId,
      { ...actualizaciones, actualizadoEn: new Date() },
      { new: true }
    );

    res.json(claseActualizada);
  } catch (error) {
    console.error('Error actualizando clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const eliminarClase = async (req: AuthRequest, res: Response) => {
  try {
    const { claseId } = req.params;

    // Buscar la clase y el curso asociado
    const clase = await Clase.findById(claseId).populate('cursoId');
    if (!clase) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    // Verificar autorización
    const curso = clase.cursoId as any;
    if (curso.profesionalId.toString() !== req.user?.uid) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Marcar como inactiva (soft delete)
    await Clase.findByIdAndUpdate(claseId, { activa: false });

    // Actualizar el curso
    await Curso.findByIdAndUpdate(curso._id, {
      $pull: { clases: claseId },
      $inc: { totalClases: -1 }
    });

    res.json({ message: 'Clase eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const subirMaterialClase = async (req: AuthRequest, res: Response) => {
  try {
    const { claseId } = req.params;
    const { nombre, tipo } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    // Buscar la clase y verificar autorización
    const clase = await Clase.findById(claseId).populate('cursoId');
    if (!clase) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    const curso = clase.cursoId as any;
    if (curso.profesionalId.toString() !== req.user?.uid) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Construir la URL del archivo
    const archivoUrl = `/uploads/materiales/${req.file.filename}`;
    
    // Agregar el material a la clase
    const nuevoMaterial = {
      nombre: nombre || req.file.originalname,
      url: archivoUrl,
      tipo: tipo || 'archivo'
    };

    const claseActualizada = await Clase.findByIdAndUpdate(
      claseId,
      { 
        $push: { materialesAdicionales: nuevoMaterial },
        actualizadoEn: new Date()
      },
      { new: true }
    );

    res.json({
      message: 'Material subido exitosamente',
      material: nuevoMaterial,
      clase: claseActualizada
    });
  } catch (error) {
    console.error('Error subiendo material:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
