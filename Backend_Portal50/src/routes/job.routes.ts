import { Router } from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobQuestions
} from '../controllers/job.controller';


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ofertas
 *   description: Gestión de ofertas de empleo
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Crear nueva oferta de empleo
 *     tags: [Ofertas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empresaId
 *               - titulo
 *               - descripcion
 *               - modalidad
 *               - jornada
 *               - ubicacion
 *               - salario
 *             properties:
 *               empresaId:
 *                 type: string
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               modalidad:
 *                 type: string
 *                 enum: [remota, presencial, híbrida]
 *               jornada:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               salario:
 *                 type: string
 *               etiquetas:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Oferta creada correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', createJob);

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Obtener listado de todas las ofertas
 *     tags: [Ofertas]
 *     responses:
 *       200:
 *         description: Lista de ofertas de empleo
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', getAllJobs);

/**
 * @swagger
 * /api/jobs/{jobId}:
 *   get:
 *     summary: Obtener detalles de una oferta específica
 *     tags: [Ofertas]
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID de la oferta
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la oferta
 *       404:
 *         description: Oferta no encontrada
 */
router.get('/:jobId', getJobById);

/**
 * @swagger
 * /api/jobs/{jobId}:
 *   put:
 *     summary: Actualizar una oferta existente
 *     tags: [Ofertas]
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID de la oferta a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               modalidad:
 *                 type: string
 *               jornada:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               salario:
 *                 type: string
 *               etiquetas:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Oferta actualizada correctamente
 *       404:
 *         description: Oferta no encontrada
 */
router.put('/:jobId', updateJob);

/**
 * @swagger
 * /api/jobs/{jobId}:
 *   delete:
 *     summary: Eliminar una oferta de empleo
 *     tags: [Ofertas]
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID de la oferta a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Oferta eliminada correctamente
 *       404:
 *         description: Oferta no encontrada
 */
router.delete('/:jobId', deleteJob);

/**
 * @swagger
 * /api/jobs/{jobId}/preguntas:
 *   put:
 *     summary: Actualizar preguntas de postulación de una oferta
 *     tags: [Ofertas]
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: ID de la oferta a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preguntas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     pregunta:
 *                       type: string
 *                     obligatoria:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Preguntas actualizadas correctamente
 *       400:
 *         description: Body inválido
 *       404:
 *         description: Oferta no encontrada
 */
router.put('/:jobId/preguntas', updateJobQuestions);

export default router;
