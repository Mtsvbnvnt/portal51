import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/user.routes';
import jobRoutes from './routes/job.routes';
import cors from 'cors';
import postulacionRoutes from './routes/postulacion.routes';
import cursoRoutes from './routes/curso.routes';
import claseRoutes from './routes/clase.routes';
import mensajeRoutes from './routes/mensaje.routes';
import adminRoutes from './routes/admin.routes';
import evaluacionRoutes from './routes/evaluacion.routes';
import { connectDB } from './config/db';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import empresaRoutes from './routes/empresa.routes';


dotenv.config();
const app = express();

app.get('/ping', (_, res) => {
  console.log('📡 Ping recibido');
  res.send('pong');
});
app.use(express.json());
app.use(cors());

// Middlewares
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/clases', claseRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/evaluacion', evaluacionRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Conexión a BD y arranque del servidor
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en puerto ${PORT}`);
});


