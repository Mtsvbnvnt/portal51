import { z } from 'zod';

export const createJobSchema = z.object({
  empresaId: z.string().length(24),
  titulo: z.string().optional(),
  descripcion: z.string().optional(),
  modalidad: z.enum(['presencial', 'remota', 'híbrida']).optional(),
  jornada: z.string().optional(),
  ubicacion: z.string().optional(),
  salario: z.string().optional(),
  etiquetas: z.array(z.string()).optional(),
  preguntas: z.array(z.object({
    pregunta: z.string(),
    obligatoria: z.boolean()
  })).optional(),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobDTO = z.infer<typeof createJobSchema>;
export type UpdateJobDTO = z.infer<typeof updateJobSchema>;
