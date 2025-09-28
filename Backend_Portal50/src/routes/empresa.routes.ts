// src/routes/empresa.routes.ts
import { Router } from 'express';
import { createEmpresa, getEmpresaByUid, addEjecutivo,
         desactivarEmpresa, getEmpresasActivas, updateEjecutivo, getEmpresaById,
         getProfesionalesActivos, uploadEmpresaFotoPerfil, updateEmpresa
        } from '../controllers/empresa.controller';
import { uploadUsuario } from '../middlewares/upload.middleware';
const router = Router();

/**
 * @swagger
 * /api/empresas:
 *   post:
 *     summary: Crear nueva empresa
 *     tags: [Empresas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               nombre:
 *                 type: string
 *               rut:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Empresa creada
 *       409:
 *         description: Empresa ya existe
 */
router.post('/', createEmpresa);

/**
 * @swagger
 * /api/empresas/{uid}:
 *   get:
 *     summary: Obtener empresa por UID Firebase
 *     tags: [Empresas]
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: UID de Firebase
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *       404:
 *         description: Empresa no encontrada
 */
router.get('/uid/:uid', getEmpresaByUid);

/**
 * @swagger
 * /api/empresas/{empresaId}/ejecutivos:
 *   post:
 *     summary: Agregar ejecutivo a una empresa
 *     tags: [Empresas]
 *     parameters:
 *       - name: empresaId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa (MongoDB _id)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario profesional a asignar como ejecutivo
 *     responses:
 *       200:
 *         description: Ejecutivo agregado
 *       404:
 *         description: Empresa o usuario no encontrado
 *       400:
 *         description: Usuario no válido como ejecutivo
 */
router.post('/:empresaId/ejecutivos', addEjecutivo);

/**
 * @swagger
 * /api/empresas/{empresaId}/ejecutivos:
 *   put:
 *     summary: Agregar o remover ejecutivo de empresa
 *     tags: [Empresas]
 *     parameters:
 *       - name: empresaId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [remove]
 *     responses:
 *       200:
 *         description: Ejecutivo actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:empresaId/ejecutivos', updateEjecutivo);


/**
 * @swagger
 * /api/empresas/{empresaId}/desactivar:
 *   put:
 *     summary: Desactivar (eliminar lógicamente) una empresa
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: empresaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa (MongoDB _id)
 *     responses:
 *       200:
 *         description: Empresa desactivada
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error interno
 */
router.put('/:empresaId/desactivar', desactivarEmpresa);


/**
 * @swagger
 * /api/empresas/activas:
 *   get:
 *     summary: Obtener todas las empresas activas
 *     tags: [Empresas]
 *     responses:
 *       200:
 *         description: Lista de empresas activas
 *       500:
 *         description: Error interno
 */
router.get('/activas', getEmpresasActivas);

/**
 * @swagger
 * /api/empresas/{empresaId}:
 *   get:
 *     summary: Obtener empresa por ID de MongoDB
 *     tags: [Empresas]
 *     parameters:
 *       - name: empresaId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa (MongoDB _id)
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *       404:
 *         description: Empresa no encontrada
 */
router.get('/:empresaId', getEmpresaById);

/**
 * @swagger
 * /api/users/profesionales:
 *   get:
 *     summary: Obtener lista de profesionales activos
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios profesionales
 *       500:
 *         description: Error interno
 */
router.get('/profesionales', getProfesionalesActivos);

/**
 * @swagger
 * /api/empresas/{empresaId}/upload-foto-perfil:
 *   post:
 *     summary: Subir foto de perfil de empresa
 *     tags: [Empresas]
 *     parameters:
 *       - name: empresaId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la empresa (MongoDB _id)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil (.jpg o .png, máx. 2MB)
 *     responses:
 *       200:
 *         description: Imagen subida correctamente
 *       400:
 *         description: Archivo no válido o error al subir
 *       404:
 *         description: Empresa no encontrada
 */
router.post(
  '/:empresaId/upload-foto-perfil',
  uploadUsuario.single('fotoPerfil'),
  uploadEmpresaFotoPerfil
);

/**
 * @swagger
 * /api/empresas/{id}:
 *   put:
 *     summary: Actualiza los datos de una empresa por su ID
 *     tags:
 *       - Empresas
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la empresa
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Empresa ABC
 *               telefono:
 *                 type: string
 *                 example: 987654321
 *               direccion:
 *                 type: string
 *                 example: Chile
 *     responses:
 *       200:
 *         description: Empresa actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", updateEmpresa);

export default router;
