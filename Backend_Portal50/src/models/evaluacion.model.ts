import mongoose, { Schema, Document } from 'mongoose';

export interface IEvaluacion extends Document {
  evaluadorId: mongoose.Types.ObjectId;
  evaluadoId: mongoose.Types.ObjectId;
  cursoId: mongoose.Types.ObjectId;
  tipo: 'curso';
  comentario: string;
  estrellas: number;
  fecha: Date;
}

const EvaluacionSchema = new Schema<IEvaluacion>({
  evaluadorId: { type: Schema.Types.ObjectId, ref: 'usuarios', required: true },
  evaluadoId: { type: Schema.Types.ObjectId, ref: 'usuarios', required: true },
  cursoId: { type: Schema.Types.ObjectId, ref: 'cursos', required: true },
  tipo: { type: String, enum: ['curso'], required: true },
  comentario: { type: String, required: true },
  estrellas: { type: Number, required: true, min: 1, max: 5 },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model<IEvaluacion>('evaluaciones', EvaluacionSchema, 'evaluaciones');
