import { z } from 'zod';

export const crearPostulacionSchema = z.object({
  ofertaId: z.string().length(24),
  usuarioId: z.string().length(24),
  mensaje: z.string().max(500).optional(),
  documentosAdicionales: z.array(z.string().url()).optional(),
  preguntasRespondidas: z
    .array(
      z.object({
        pregunta: z.string(),
        respuesta: z.string()
      })
    )
    .optional()
});

export const actualizarEstadoSchema = z.object({
  estado: z.enum(['pendiente', 'preseleccionado', 'rechazado', 'contratado']),
  observaciones: z.string().optional()
});
