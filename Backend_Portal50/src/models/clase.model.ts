import mongoose, { Schema, Document } from 'mongoose';

export interface IClase extends Document {
  cursoId: mongoose.Types.ObjectId;
  numeroClase: number;
  titulo: string;
  descripcion: string;
  duracionMinutos: number;
  videoUrl?: string;
  materialesPDF?: string[];
  materialesAdicionales?: {
    nombre: string;
    url: string;
    tipo: 'pdf' | 'link' | 'archivo';
  }[];
  objetivos: string[];
  prerequisitos?: string[];
  orden: number;
  activa: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

const ClaseSchema = new Schema<IClase>({
  cursoId: { type: Schema.Types.ObjectId, ref: 'cursos', required: true },
  numeroClase: { type: Number, required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  duracionMinutos: { type: Number, required: true },
  videoUrl: String,
  materialesPDF: [String],
  materialesAdicionales: [{
    nombre: { type: String, required: true },
    url: { type: String, required: true },
    tipo: { type: String, enum: ['pdf', 'link', 'archivo'], required: true }
  }],
  objetivos: [String],
  prerequisitos: [String],
  orden: { type: Number, required: true },
  activa: { type: Boolean, default: true },
  creadoEn: { type: Date, default: Date.now },
  actualizadoEn: { type: Date, default: Date.now }
});

// Crear índice compuesto para evitar duplicados
ClaseSchema.index({ cursoId: 1, numeroClase: 1 }, { unique: true });

export default mongoose.model<IClase>('clases', ClaseSchema, 'clases');
