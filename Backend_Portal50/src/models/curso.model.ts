import mongoose, { Schema, Document } from 'mongoose';

export interface ICurso extends Document {
  profesionalId: mongoose.Types.ObjectId;
  titulo: string;
  descripcion: string;
  categoria: string;
  videoIntro?: string;
  precio: number;
  tipoPago: 'sesion' | 'mensual';
  agendaDisponible: Date[];
  calificacionPromedio: number;
  activo: boolean;
  creadoEn: Date;
  duracionMinutos: number;
  totalClases?: number;
  clases?: mongoose.Types.ObjectId[];
}

const CursoSchema = new Schema<ICurso>({
  profesionalId: { type: Schema.Types.ObjectId, ref: 'usuarios', required: true },
  titulo: { type: String, required: true },
  descripcion: String,
  categoria: String,
  videoIntro: String,
  precio: Number,
  tipoPago: { type: String, enum: ['sesion', 'mensual'], required: true },
  agendaDisponible: [Date],
  calificacionPromedio: { type: Number, default: 0 },
  duracionMinutos: { type: Number, required: true },
  creadoEn: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true },
  totalClases: { type: Number, default: 0 },
  clases: [{ type: Schema.Types.ObjectId, ref: 'clases' }]
});

export default mongoose.model<ICurso>('cursos', CursoSchema, 'cursos');
