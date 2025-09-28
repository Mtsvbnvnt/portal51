import { Schema, model, Document } from 'mongoose';

export interface IJob extends Document {
  empresaId: Schema.Types.ObjectId; // ID del usuario empresa
  titulo: string;
  descripcion: string;
  modalidad: string;
  jornada: string;
  ubicacion?: string;
  salario?: string;
  estado?: string;
  etiquetas?: string[];
  fechaPublicacion: Date;
  moderada: boolean;
  preguntas: {
    pregunta: string;
    obligatoria: boolean;
  }[];

}

const jobSchema = new Schema<IJob>({
  empresaId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  modalidad: { type: String, enum: ['presencial', 'remota', 'híbrida'], required: true },
  jornada: { type: String, required: true },
  ubicacion: { type: String },
  salario: { type: String },
  estado: { type: String, default: 'activa' },
  etiquetas: [String],
  fechaPublicacion: { type: Date, default: Date.now },
  preguntas: [
    {
    pregunta: String,
    obligatoria: Boolean
    }
  ],
  moderada: { type: Boolean, default: false }
});

export const Job = model<IJob>('Job', jobSchema, 'ofertas');
