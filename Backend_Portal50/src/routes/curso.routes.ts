import { Router } from 'express';
import {
  getCursos,
  getCursoById,
  agendarClase,
  uploadVideoCurso,
  crearCurso,
  getCursosPorUsuario
} from '../controllers/curso.controller';

import { uploadCurso } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cursos
 *   description: Gestión de cursos y clases
 */

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Listar cursos disponibles
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos ofrecidos por profesionales certificados
 *       500:
 *         description: Error interno al obtener cursos
 */
router.get('/', getCursos);

/**
 * @swagger
 * /api/cursos/{cursoId}:
 *   get:
 *     summary: Obtener detalle de un curso específico
 *     tags: [Cursos]
 *     parameters:
 *       - name: cursoId
 *         in: path
 *         required: true
 *         description: ID del curso a consultar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del curso
 *       404:
 *         description: Curso no encontrado
 */
router.get('/:cursoId', getCursoById);

/**
 * @swagger
 * /api/cursos/{cursoId}/agendar:
 *   post:
 *     summary: Agendar clase con profesional
 *     tags: [Cursos]
 *     parameters:
 *       - name: cursoId
 *         in: path
 *         required: true
 *         description: ID del curso a agendar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aprendizId
 *               - fecha
 *             properties:
 *               aprendizId:
 *                 type: string
 *                 description: ID del usuario que agenda
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de la clase
 *     responses:
 *       201:
 *         description: Clase agendada correctamente
 *       400:
 *         description: Datos inválidos o fecha no disponible
 */
router.post('/:cursoId/agendar', agendarClase);

/**
 * @swagger
 * /api/cursos/{cursoId}/upload-video:
 *   post:
 *     summary: Subir video de presentación del curso
 *     tags: [Cursos]
 *     parameters:
 *       - name: cursoId
 *         in: path
 *         required: true
 *         description: ID del curso
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               videoCurso:
 *                 type: string
 *                 format: binary
 *                 description: Video en formatos .mp4, .mov o .avi (máx. 500MB y 5 minutos)
 *     responses:
 *       200:
 *         description: Video subido correctamente
 *       400:
 *         description: Formato o tamaño inválido
 */
router.post('/:cursoId/upload-video', uploadCurso.single('videoCurso'), uploadVideoCurso);

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Crear un nuevo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profesionalId
 *               - titulo
 *               - precio
 *               - tipoPago
 *             properties:
 *               profesionalId:
 *                 type: string
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               categoria:
 *                 type: string
 *               precio:
 *                 type: number
 *               tipoPago:
 *                 type: string
 *                 enum: [sesion, mensual]
 *               agendaDisponible:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date-time
 *     responses:
 *       201:
 *         description: Curso creado
 *       500:
 *         description: Error al crear el curso
 */
router.post('/', crearCurso);

/**
 * @swagger
 * /api/cursos/usuario/{usuarioId}:
 *   get:
 *     summary: Listar cursos publicados por un usuario
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del profesional
 *     responses:
 *       200:
 *         description: Lista de cursos del profesional
 *       500:
 *         description: Error interno
 */
router.get('/usuario/:usuarioId', getCursosPorUsuario);

export default router;
