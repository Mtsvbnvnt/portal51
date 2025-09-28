import { Router } from 'express';
import { listarUsuarios, obtenerEvaluacionesUsuario } from '../controllers/admin.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Administración
 *   description: Endpoints administrativos para gestión interna
 */

/**
 * @swagger
 * /api/admin/usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     description: Requiere token con rol de administrador.
 *     responses:
 *       200:
 *         description: Lista completa de usuarios
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener usuarios
 */
router.get('/usuarios', listarUsuarios);

/**
 * @swagger
 * /api/admin/evaluaciones/{userId}:
 *   get:
 *     summary: Obtener evaluaciones de un usuario o profesional
 *     tags: [Administración]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID del usuario para obtener sus evaluaciones
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evaluaciones encontradas
 *       404:
 *         description: No se encontraron evaluaciones para este usuario
 *       500:
 *         description: Error interno al consultar evaluaciones
 */
router.get('/evaluaciones/:userId', obtenerEvaluacionesUsuario);

export default router;
