import mongoose, { Schema, Document } from 'mongoose';

export interface IPostulacion extends Document {
  ofertaId: mongoose.Types.ObjectId;
  usuarioId: mongoose.Types.ObjectId;
  mensaje?: string;
  estado: 'pendiente' | 'preseleccionado' | 'rechazado' | 'contratado';
  documentosAdicionales?: string[];
  preguntasRespondidas?: {
    pregunta: string;
    respuesta: string;
  }[];
  fechaPostulacion: Date;
}

const PostulacionSchema = new Schema<IPostulacion>({
  ofertaId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mensaje: String,
  estado: { type: String, enum: ['pendiente', 'preseleccionado', 'rechazado', 'contratado'], default: 'pendiente' },
  documentosAdicionales: [String],
  preguntasRespondidas: [
    {
      pregunta: String,
      respuesta: String,
    },
  ],
  fechaPostulacion: { type: Date, default: Date.now },
});

export default mongoose.model<IPostulacion>('postulaciones', PostulacionSchema, 'postulaciones');
