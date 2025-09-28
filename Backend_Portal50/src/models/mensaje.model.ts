import mongoose, { Schema, Document } from 'mongoose';

export interface IMensaje extends Document {
  remitenteId: mongoose.Types.ObjectId;
  destinatarioId: mongoose.Types.ObjectId;
  relacionadoA?: 'oferta' | 'curso';
  relacionadoId?: mongoose.Types.ObjectId;
  mensaje: string;
  fecha: Date;
  leido: boolean;
}

const MensajeSchema = new Schema<IMensaje>({
  remitenteId: { type: Schema.Types.ObjectId, ref: 'usuarios', required: true },
  destinatarioId: { type: Schema.Types.ObjectId, ref: 'usuarios', required: true },
  relacionadoA: { type: String, enum: ['oferta', 'curso'], required: false },
  relacionadoId: { type: Schema.Types.ObjectId, required: false },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false }
});

export default mongoose.model<IMensaje>('mensajes', MensajeSchema, 'mensajes');
