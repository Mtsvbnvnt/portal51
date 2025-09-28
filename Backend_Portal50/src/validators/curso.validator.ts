import { z } from 'zod';

export const agendarClaseSchema = z.object({
  usuarioId: z.string().length(24, 'ID inválido'),
  fecha: z.string().refine((fecha) => !isNaN(Date.parse(fecha)), {
    message: 'Fecha inválida',
  }),
});
