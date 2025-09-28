// src/validators/user.validator.ts

import { z } from 'zod';

export const updateUserSchema = z.object({
  telefono: z.string().min(8).max(20).optional(),
  pais: z.string().min(2).refine((value) => !/^\d+$/.test(value), { message: "El país no puede ser un número" }).optional(),
  experiencia: z.string().max(300).optional(),
  habilidades: z.array(z.string()).optional(),
  certificado: z.boolean().optional(),
  videoPresentacion: z.string().url().optional(),
  modalidadPreferida: z.enum([
    'tiempo completo',
    'part time',
    'proyectos',
    'híbrida',
    'presencial',
    'remota'
  ]).optional()
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
