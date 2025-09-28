import { Router } from 'express';
import { verifyFirebaseAuth } from '../middlewares/auth.middleware';
import {
  obtenerClasesPorCurso,
  obtenerClasePorId,
  crearClase,
  actualizarClase,
  eliminarClase,
  subirMaterialClase
} from '../controllers/clase.controller';

const router = Router();

// Obtener todas las clases de un curso (público para usuarios inscritos)
router.get('/curso/:cursoId', obtenerClasesPorCurso);

// Obtener una clase específica
router.get('/:claseId', obtenerClasePorId);

// Rutas protegidas (solo para profesionales propietarios del curso)
router.post('/curso/:cursoId', verifyFirebaseAuth, crearClase);
router.put('/:claseId', verifyFirebaseAuth, actualizarClase);
router.delete('/:claseId', verifyFirebaseAuth, eliminarClase);

// Subir material a una clase
router.post('/:claseId/material', verifyFirebaseAuth, subirMaterialClase);

export default router;
