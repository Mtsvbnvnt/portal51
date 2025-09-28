// src/routes/mensaje.routes.ts
import { Router } from 'express';
import { enviarMensaje, obtenerConversacion } from '../controllers/mensaje.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mensajes
 *   description: Comunicación entre usuarios
 */

/**
 * @swagger
 * /api/mensajes:
 *   post:
 *     summary: Enviar un mensaje entre dos usuarios
 *     tags: [Mensajes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - remitenteId
 *               - destinatarioId
 *               - mensaje
 *             properties:
 *               remitenteId:
 *                 type: string
 *                 description: ID del usuario que envía el mensaje
 *               destinatarioId:
 *                 type: string
 *                 description: ID del usuario que recibe el mensaje
 *               mensaje:
 *                 type: string
 *                 description: Contenido del mensaje
 *               relacionadoA:
 *                 type: string
 *                 enum: [oferta, curso]
 *                 description: Contexto del mensaje (opcional)
 *               relacionadoId:
 *                 type: string
 *                 description: ID de la oferta o curso relacionado (opcional)
 *     responses:
 *       201:
 *         description: Mensaje enviado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', enviarMensaje);

/**
 * @swagger
 * /api/mensajes/conversacion/{userA}/{userB}:
 *   get:
 *     summary: Obtener conversación entre dos usuarios
 *     tags: [Mensajes]
 *     parameters:
 *       - name: userA
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del primer usuario
 *       - name: userB
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del segundo usuario
 *     responses:
 *       200:
 *         description: Lista de mensajes ordenados cronológicamente
 *       500:
 *         description: Error al obtener la conversación
 */
router.get('/conversacion/:userA/:userB', obtenerConversacion);

export default router;
