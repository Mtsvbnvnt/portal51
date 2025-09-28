import { Schema, model, Document, Types } from 'mongoose';

export interface IEmpresa extends Document {
  uid: string;
  nombre: string;
  email: string;
  videoPresentacion: String;
  telefono?: string;
  direccion?: string;
  ejecutivos?: Types.ObjectId[];
  rol: String;
  activo: boolean;
  fotoPerfil?: String;
}

const empresaSchema = new Schema<IEmpresa>({
  uid: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  email: { type: String, required:true, unique: true},
  telefono: String,
  direccion: String,
  videoPresentacion: String,
  ejecutivos: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  rol: { type: String, required: true },
  activo: { type: Boolean, default: true },
  fotoPerfil: { type: String, default: "" }
});

export const Empresa = model<IEmpresa>('Empresa', empresaSchema, 'empresas');
