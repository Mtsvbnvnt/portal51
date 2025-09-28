import { Router } from 'express';
import { obtenerEvaluacionesUsuario, crearEvaluacion } from '../controllers/evaluacion.controller';

const router = Router();

/**
 * @swagger
 * /api/evaluaciones/{userId}:
 *   get:
 *     summary: Obtener evaluaciones de un usuario
 *     tags: [Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario evaluado
 *     responses:
 *       200:
 *         description: Lista de evaluaciones con promedio de estrellas
 *       404:
 *         description: No se encontraron evaluaciones
 *       500:
 *         description: Error del servidor
 */
router.get('/:userId', obtenerEvaluacionesUsuario);

/**
 * @swagger
 * /api/evaluaciones:
 *   post:
 *     summary: Crear una nueva evaluación de un curso
 *     tags: [Evaluaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - evaluadorId
 *               - evaluadoId
 *               - cursoId
 *               - tipo
 *               - estrellas
 *             properties:
 *               evaluadorId:
 *                 type: string
 *                 description: ID del usuario que evalúa
 *               evaluadoId:
 *                 type: string
 *                 description: ID del usuario evaluado
 *               cursoId:
 *                 type: string
 *                 description: ID del curso evaluado
 *               tipo:
 *                 type: string
 *                 enum: [curso]
 *               comentario:
 *                 type: string
 *                 description: Comentario opcional
 *               estrellas:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Evaluación creada exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error al crear la evaluación
 */
router.post('/', crearEvaluacion);

export default router;
